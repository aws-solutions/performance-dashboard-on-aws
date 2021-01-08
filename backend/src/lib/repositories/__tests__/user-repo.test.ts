import { UserType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import { mocked } from "ts-jest/utils";
import CognitoService from "../../services/cognito";
import UserRepository from "../user-repo";

jest.mock("../../services/cognito");

let userPoolId: string;
let repo: UserRepository;
let cognito = mocked(CognitoService.prototype);

beforeEach(() => {
  userPoolId = "abc";
  process.env.USER_POOL_ID = userPoolId;

  CognitoService.getInstance = jest.fn().mockReturnValue(cognito);
  repo = UserRepository.getInstance();
});

describe("UserRepository", () => {
  it("should be a singleton", () => {
    const repo2 = UserRepository.getInstance();
    expect(repo).toBe(repo2);
  });
});

describe("listUsers", () => {
  it("should list users using the correct userPoolId", async () => {
    // Mock response
    cognito.listUsers = jest.fn().mockReturnValue({});

    await repo.listUsers();

    expect(cognito.listUsers).toHaveBeenCalledWith({ UserPoolId: "abc" });
  });

  it("returns a list of users", async () => {
    // Mock query response
    const now = new Date();
    const cognitoUser: UserType = {
      Username: "test user",
      Enabled: true,
      UserStatus: "CONFIRMED",
      Attributes: [
        {
          Name: "sub",
          Value: "123",
        },
        { Name: "email", Value: "test@test.com" },
      ],
      UserCreateDate: now,
      UserLastModifiedDate: now,
    };
    cognito.listUsers = jest.fn().mockReturnValue({
      Users: [cognitoUser],
    });

    const list = await repo.listUsers();
    expect(list.length).toEqual(1);
    expect(list[0]).toEqual({
      userId: "test user",
      enabled: true,
      userStatus: "CONFIRMED",
      sub: "123",
      email: "test@test.com",
      createdAt: now,
      updatedAt: now,
    });
  });
});
