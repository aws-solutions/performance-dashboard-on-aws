import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import WidgetCtrl from "../widget-ctrl";
import WidgetRepository from "../../repositories/widget-repo";
import AuthService from "../../services/auth";

jest.mock("../../services/auth");
jest.mock("../../repositories/widget-repo");

const user: User = { userId: "johndoe" };
const repository = mocked(WidgetRepository.prototype);
const res = ({
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any) as Response;

beforeEach(() => {
  AuthService.getCurrentUser = jest.fn().mockReturnValue(user);
  WidgetRepository.getInstance = jest.fn().mockReturnValue(repository);
});

describe("deleteWidget", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      params: {
        id: "090b0410",
        widgetId: "14507073",
      },
    } as any) as Request;
  });

  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await WidgetCtrl.deleteWidget(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns a 400 error when dashboardId is missing", async () => {
    delete req.params.id;
    await WidgetCtrl.deleteWidget(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required path param `id`");
  });

  it("returns a 400 error when widgetId is missing", async () => {
    delete req.params.widgetId;
    await WidgetCtrl.deleteWidget(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required path param `widgetId`");
  });

  it("deletes the widget", async () => {
    await WidgetCtrl.deleteWidget(req, res);
    expect(repository.deleteWidget).toBeCalledWith("090b0410", "14507073");
  });
});

describe("setWidgetOrder", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      params: { id: "090b0410" },
      body: {
        widgets: [
          {
            id: "abc",
            order: 1,
            updatedAt: "2020-09-17T00:24:35",
          },
          {
            id: "xyz",
            order: 2,
            updatedAt: "2020-09-17T00:24:35",
          },
        ],
      },
    } as any) as Request;
  });

  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await WidgetCtrl.setWidgetOrder(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns a 400 error when dashboardId is missing", async () => {
    delete req.params.id;
    await WidgetCtrl.setWidgetOrder(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required path param `id`");
  });

  it("returns a 400 error when widgets field is missing", async () => {
    delete req.body.widgets;
    await WidgetCtrl.setWidgetOrder(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `widgets`");
  });

  it("sets widget order", async () => {
    await WidgetCtrl.setWidgetOrder(req, res);
    expect(repository.setWidgetOrder).toBeCalledWith(
      "090b0410",
      req.body.widgets
    );
  });
});
