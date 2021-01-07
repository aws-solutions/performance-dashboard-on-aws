import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import UserRepository from "../../repositories/user-repo";
import UserCtrl from "../user-ctrl";
import AuthService from "../../services/auth";
import { UserType } from "aws-sdk/clients/cognitoidentityserviceprovider";

jest.mock("../../services/auth");
jest.mock("../../repositories/user-repo");
jest.mock("../../factories/user-factory");

const user: User = { userId: "johndoe" };
const repository = mocked(UserRepository.prototype);
const req = ({} as any) as Request;
let res: Response;

beforeEach(() => {
  AuthService.getCurrentUser = jest.fn().mockReturnValue(user);
  UserRepository.getInstance = jest.fn().mockReturnValue(repository);
  res = ({
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any) as Response;
});

describe("getUsers", () => {
  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await UserCtrl.getUsers(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns users when available in cognito", async () => {
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    const cognitoUser: UserType = {
      Username: "test user",
      Enabled: true,
      UserStatus: "CONFIRMED",
      Attributes: [
        {
          Name: "sub",
          Value: "123",
        },
        { Name: "email_verified", Value: "true" },
        { Name: "email", Value: "test@test.com" },
      ],
      UserCreateDate: now,
      UserLastModifiedDate: now,
    };

    const user: User = {
      userId: cognitoUser.Username || "",
      enabled: cognitoUser.Enabled,
      userStatus: cognitoUser.UserStatus,
      sub: cognitoUser.Attributes ? cognitoUser.Attributes[0].Value : "",
      emailVerified: cognitoUser.Attributes
        ? cognitoUser.Attributes[1].Value === "true"
        : false,
      email: cognitoUser.Attributes ? cognitoUser.Attributes[2].Value : "",
      createdAt: cognitoUser.UserCreateDate
        ? cognitoUser.UserCreateDate
        : new Date(),
      updatedAt: cognitoUser.UserLastModifiedDate
        ? cognitoUser.UserLastModifiedDate
        : new Date(),
    };
    repository.listUsers = jest.fn().mockReturnValueOnce([user]);

    await UserCtrl.getUsers(req, res);
    expect(res.json).toBeCalledWith(expect.objectContaining([user]));
  });
});
