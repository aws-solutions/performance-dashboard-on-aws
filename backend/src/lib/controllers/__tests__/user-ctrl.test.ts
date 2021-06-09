import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { Role, User } from "../../models/user";
import UserRepository from "../../repositories/user-repo";
import UserCtrl from "../user-ctrl";
import UserFactory from "../../factories/user-factory";

jest.mock("../../repositories/user-repo");
jest.mock("../../factories/user-factory");

const user: User = { userId: "johndoe" };
const repository = mocked(UserRepository.prototype);
let req = {} as any as Request;
let res: Response;

beforeEach(() => {
  UserRepository.getInstance = jest.fn().mockReturnValue(repository);
  res = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any as Response;
});

describe("addUser", () => {
  beforeEach(() => {
    req = {
      user,
      body: {
        role: "Admin",
        emails: "test1@test.com,test2@test.com",
      },
    } as any as Request;
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

  it("returns a 400 error when emails have an invalid email and escapes HTML characters from email", async () => {
    req.body.emails = "<script>temp</script>";
    await UserCtrl.addUsers(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(
      "Invalid email: &lt;script&gt;temp&lt;/script&gt;"
    );
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
  beforeEach(() => {
    req = {
      user,
      body: {
        emails: "test1@test.com,test2@test.com",
      },
    } as any as Request;
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

  it("resend invite", async () => {
    await UserCtrl.resendInvite(req, res);
    expect(repository.resendInvite).toBeCalledWith(["test1", "test2"]);
  });
});

describe("changeRole", () => {
  beforeEach(() => {
    req = {
      user,
      body: {
        role: "Editor",
        usernames: ["test1", "test2"],
      },
    } as any as Request;
  });

  it("returns a 400 error when role is missing", async () => {
    delete req.body.role;
    await UserCtrl.changeRole(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required body `role`");
  });

  it("returns a 400 error when role is invalid", async () => {
    req.body.role = "wrong role";
    await UserCtrl.changeRole(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Invalid role value");
  });

  it("returns a 400 error when usernames field is missing", async () => {
    delete req.body.usernames;
    await UserCtrl.changeRole(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required body `usernames`");
  });

  it("change role", async () => {
    await UserCtrl.changeRole(req, res);
    expect(repository.changeRole).toBeCalledWith(
      ["test1", "test2"],
      Role.Editor
    );
  });
});

describe("getUsers", () => {
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

describe("removeUsers", () => {
  beforeEach(() => {
    req = {
      body: {},
    } as any as Request;
  });

  it("returns a 400 error when usernames is not specified", async () => {
    await UserCtrl.removeUsers(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith(expect.stringContaining("usernames"));
  });

  it("calls user repo to delete users", async () => {
    req.body = { usernames: ["johndoe", "alice", "bob"] };
    await UserCtrl.removeUsers(req, res);
    expect(repository.removeUsers).toBeCalledWith(["johndoe", "alice", "bob"]);
  });
});
