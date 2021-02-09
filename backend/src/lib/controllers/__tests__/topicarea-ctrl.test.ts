import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import TopicAreaCtrl from "../topicarea-ctrl";
import TopicAreaRepository from "../../repositories/topicarea-repo";

jest.mock("../../repositories/topicarea-repo");

const user: User = { userId: "johndoe" };
const repository = mocked(TopicAreaRepository.prototype);
const res = ({
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any) as Response;

beforeEach(() => {
  TopicAreaRepository.getInstance = jest.fn().mockReturnValue(repository);
});

describe("updateTopicArea", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      user,
      params: {
        id: "3ffdb1ef-081d-4534-97e9-b69cdbb687d0",
      },
      body: {
        name: "New Name",
      },
    } as any) as Request;
  });

  it("returns a 400 error when name is missing", async () => {
    delete req.body.name;
    await TopicAreaCtrl.updateTopicArea(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `name`");
    expect(repository.renameTopicArea).not.toBeCalled();
  });

  it("renames a topic area successfully", async () => {
    await TopicAreaCtrl.updateTopicArea(req, res);
    expect(repository.renameTopicArea).toBeCalledWith(
      "3ffdb1ef-081d-4534-97e9-b69cdbb687d0",
      "New Name",
      user
    );
  });
});

describe("deleteTopicArea", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      user,
      params: {
        id: "3ffdb1ef-081d-4534-97e9-b69cdbb687d0",
      },
    } as any) as Request;
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
