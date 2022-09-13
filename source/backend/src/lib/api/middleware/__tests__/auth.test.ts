import auth from "../auth";
import { User } from "../../../models/user";
import AuthService from "../../../services/auth";

jest.mock("../../../services/auth");

let req: any;
let res: any;
let next = jest.fn();
const user: User = { userId: "johndoe" };

beforeEach(() => {
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  next = jest.fn();
});

test("adds a user to the request object", () => {
  AuthService.getCurrentUser = jest.fn().mockReturnValue(user);
  auth(req, res, next);
  expect(req.user).toEqual(user);
});

test("invokes the next function", () => {
  AuthService.getCurrentUser = jest.fn().mockReturnValue(user);
  auth(req, res, next);
  expect(next).toBeCalled();
});

test("returns a 401 Unauthorized when no user found", () => {
  AuthService.getCurrentUser = jest.fn().mockReturnValue(undefined);
  auth(req, res, next);
  expect(res.status).toBeCalledWith(401);
  expect(res.send).toBeCalledWith("Unauthorized");
  expect(next).not.toBeCalled();
});
