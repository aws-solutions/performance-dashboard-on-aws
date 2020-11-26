import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import TopicAreaCtrl from "../topicarea-ctrl";
import TopicAreaFactory from "../../factories/topicarea-factory";
import TopicAreaRepository from "../../repositories/topicarea-repo";
import AuthService from "../../services/auth";

jest.mock("../../services/auth");
jest.mock("../../repositories/topicarea-repo");

const user: User = { userId: "johndoe" };
const repository = mocked(TopicAreaRepository.prototype);
const res = ({
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any) as Response;

beforeEach(() => {
  AuthService.getCurrentUser = jest.fn().mockReturnValue(user);
  TopicAreaRepository.getInstance = jest.fn().mockReturnValue(repository);
});

describe("deleteTopicArea", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      params: {
        id: "3ffdb1ef-081d-4534-97e9-b69cdbb687d0",
      },
    } as any) as Request;
  });

  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await TopicAreaCtrl.deleteTopicArea(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns a 400 error when topicAreaId is missing", async () => {
    delete req.params.id;
    await TopicAreaCtrl.deleteTopicArea(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required param `id`");
  });

  it("returns a 409 conflict when topic area is not empty", async () => {
    repository.getDashboardCount = jest.fn().mockReturnValueOnce(1);
    await TopicAreaCtrl.deleteTopicArea(req, res);
    expect(res.status).toBeCalledWith(409);
    expect(res.send).toBeCalledWith(
      "Topic Area has dashboards associated to it"
    );
    expect(repository.delete).not.toBeCalled();
  });

  it("deletes a topic area successfully", async () => {
    // no dashboards should be associated in order to delete it
    repository.getDashboardCount = jest.fn().mockReturnValueOnce(0);
    await TopicAreaCtrl.deleteTopicArea(req, res);
    expect(repository.delete).toBeCalled();
  });
});
