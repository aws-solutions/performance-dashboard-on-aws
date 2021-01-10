import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import SettingsFactory from "../../factories/settings-factory";
import SettingsRepository from "../../repositories/settings-repo";
import SettingsCtrl from "../settings-ctrl";
import AuthService from "../../services/auth";

jest.mock("../../services/auth");
jest.mock("../../repositories/settings-repo");
jest.mock("../../factories/settings-factory");

const user: User = { userId: "johndoe" };
const repository = mocked(SettingsRepository.prototype);
const req = ({} as any) as Request;
let res: Response;

beforeEach(() => {
  AuthService.getCurrentUser = jest.fn().mockReturnValue(user);
  SettingsRepository.getInstance = jest.fn().mockReturnValue(repository);
  res = ({
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any) as Response;
});

describe("getSettings", () => {
  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await SettingsCtrl.getSettings(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns settings when available in the database", async () => {
    SettingsFactory.getDefaultSettings = jest.fn();
    repository.getSettings = jest.fn().mockReturnValueOnce({
      publishingGuidance:
        "I acknowledge that I have reviewed the dashboard and it is ready to publish",
    });

    await SettingsCtrl.getSettings(req, res);
    expect(SettingsFactory.getDefaultSettings).not.toBeCalled();
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        publishingGuidance:
          "I acknowledge that I have reviewed the dashboard and it is ready to publish",
      })
    );
  });
});

describe("updateSettings", () => {
  let req: Request;
  const now = new Date();
  jest.useFakeTimers("modern");
  jest.setSystemTime(now);
  beforeEach(() => {
    req = ({
      body: {
        updatedAt: now.toISOString(),
      },
    } as any) as Request;
  });

  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await SettingsCtrl.updateSettings(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns a 400 error when updatedAt is not specified", async () => {
    delete req.body.updatedAt;
    await SettingsCtrl.updateSettings(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing field `updatedAt` in body");
  });

  it("updates publishing guidance setting", async () => {
    req.body.publishingGuidance = "abc";
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updateSetting).toHaveBeenCalledWith(
      "publishingGuidance",
      "abc",
      now.toISOString(),
      user
    );
  });

  it("updates dateTimeFormat setting", async () => {
    req.body.dateTimeFormat = {
      date: "YYYY-MM-DD",
      time: "hh:mm",
    };
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updateSetting).toHaveBeenCalledWith(
      "dateTimeFormat",
      {
        date: "YYYY-MM-DD",
        time: "hh:mm",
      },
      now.toISOString(),
      user
    );
  });

  it("updates navbarTitle setting", async () => {
    req.body.navbarTitle = "New Title";
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updateSetting).toHaveBeenCalledWith(
      "navbarTitle",
      "New Title",
      now.toISOString(),
      user
    );
  });

  it("updates topicAreaLabels setting", async () => {
    req.body.topicAreaLabels = {
      singular: "Topic Area",
      plural: "Topic Areas",
    };
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updateSetting).toHaveBeenCalledWith(
      "topicAreaLabels",
      {
        singular: "Topic Area",
        plural: "Topic Areas",
      },
      now.toISOString(),
      user
    );
  });
});

describe("getPublicSettings", () => {
  it("returns the public settings only", async () => {
    const publicSettings = { foo: "bar" };
    SettingsFactory.toPublicSettings = jest
      .fn()
      .mockReturnValue(publicSettings);

    await SettingsCtrl.getPublicSettings(req, res);
    expect(res.json).toBeCalledWith(publicSettings);
  });
});
