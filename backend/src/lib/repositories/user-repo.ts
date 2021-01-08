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

  public async listUsers(): Promise<User[]> {
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
}

export default UserRepository;
