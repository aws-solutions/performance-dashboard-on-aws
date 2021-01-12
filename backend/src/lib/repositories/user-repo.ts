import { User } from "../models/user";
import UserFactory from "../factories/user-factory";
import CognitoService from "../services/cognito";

class UserRepository {
  protected static instance: UserRepository;
  protected cognito: CognitoService;
  protected userPoolId: string;

  private constructor() {
    if (!process.env.USER_POOL_ID) {
      throw new Error("Environment variable USER_POOL_ID not found");
    }

    this.cognito = CognitoService.getInstance();
    this.userPoolId = process.env.USER_POOL_ID;
  }

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }

    return UserRepository.instance;
  }

  public async listUsers(): Promise<Array<User>> {
    const result = await this.cognito.listUsers({
      UserPoolId: this.userPoolId,
    });

    if (!result.Users || !result.Users.length) {
      return [];
    }

    return result.Users.map((cognitoUser) =>
      UserFactory.fromCognitoUser(cognitoUser)
    );
  }

  public async addUsers(users: Array<User>) {
    try {
      for (const user of users) {
        await this.cognito.addUser({
          UserPoolId: this.userPoolId,
          Username: user.userId,
          UserAttributes: [
            { Name: "email", Value: user.email },
            { Name: "custom:roles", Value: JSON.stringify(user.roles) },
          ],
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public async resendInvite(emails: Array<string>) {
    try {
      for (const email of emails) {
        await this.cognito.addUser({
          UserPoolId: this.userPoolId,
          Username: email.split("@")[0],
          MessageAction: "RESEND",
        });
      }
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
