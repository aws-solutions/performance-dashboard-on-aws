import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { Role, User } from "../../models/user";
import UserRepository from "../../repositories/user-repo";
import UserCtrl from "../user-ctrl";
import AuthService from "../../services/auth";
import UserFactory from "../../factories/user-factory";

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

describe("addUser", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      body: {
        role: "Admin",
        emails: "test1@test.com,test2@test.com",
      },
    } as any) as Request;
  });

  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await UserCtrl.addUsers(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns a 400 error when role is missing", async () => {
    delete req.body.role;
    await UserCtrl.addUsers(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required body `role`");
  });

  it("returns a 400 error when role is invalid", async () => {
    req.body.role = "wrong role";
    await UserCtrl.addUsers(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Invalid role value");
  });

  it("returns a 400 error when emails is missing", async () => {
    delete req.body.emails;
    await UserCtrl.addUsers(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required body `emails`");
  });

  it("returns a 400 error when emails have an invalid email", async () => {
    req.body.emails = "wrong email";
    await UserCtrl.addUsers(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Invalid email: wrong email");
  });

  it("create the users", async () => {
    const user1 = UserFactory.createNew("test1@test.com", "Admin");
    const user2 = UserFactory.createNew("test2@test.com", "Editor");
    UserFactory.createNew = jest
      .fn()
      .mockReturnValueOnce(user1)
      .mockReturnValueOnce(user2);
    await UserCtrl.addUsers(req, res);
    expect(repository.addUsers).toBeCalledWith([user1, user2]);
  });
});

describe("resendInvite", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      body: {
        emails: "test1@test.com,test2@test.com",
      },
    } as any) as Request;
  });

  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await UserCtrl.resendInvite(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns a 400 error when emails is missing", async () => {
    delete req.body.emails;
    await UserCtrl.resendInvite(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required body `emails`");
  });

  it("returns a 400 error when emails have an invalid email", async () => {
    req.body.emails = "wrong email";
    await UserCtrl.resendInvite(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Invalid email: wrong email");
  });

  it("create the users", async () => {
    await UserCtrl.resendInvite(req, res);
    expect(repository.resendInvite).toBeCalledWith([
      "test1@test.com",
      "test2@test.com",
    ]);
  });
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
    const user: User = {
      userId: "test user",
      enabled: true,
      userStatus: "CONFIRMED",
      sub: "123",
      email: "test@test.com",
      roles: [Role.Admin],
      createdAt: now,
      updatedAt: now,
    };
    repository.listUsers = jest.fn().mockReturnValueOnce([user]);

    await UserCtrl.getUsers(req, res);
    expect(res.json).toBeCalledWith(expect.objectContaining([user]));
  });
});
