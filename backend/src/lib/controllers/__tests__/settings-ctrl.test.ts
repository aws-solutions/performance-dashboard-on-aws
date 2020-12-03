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
const res = ({
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any) as Response;

beforeEach(() => {
  AuthService.getCurrentUser = jest.fn().mockReturnValue(user);
  SettingsRepository.getInstance = jest.fn().mockReturnValue(repository);
});

describe("getSettings", () => {
  it("returns a 401 error when user is not authenticated", async () => {
    AuthService.getCurrentUser = jest.fn().mockReturnValue(null);
    await SettingsCtrl.getSettings(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toBeCalledWith("Unauthorized");
  });

  it("returns default values for settings", async () => {
    // No Settings found on the database
    repository.getSettings = jest.fn().mockReturnValueOnce(undefined);

    // Settings factory should provide the default settings
    SettingsFactory.getDefaultSettings = jest.fn().mockReturnValueOnce({
      publishingGuidance:
        "I acknowledge that I have reviewed the dashboard and it is ready to publish",
    });

    await SettingsCtrl.getSettings(req, res);
    expect(SettingsFactory.getDefaultSettings).toBeCalled();
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        publishingGuidance:
          "I acknowledge that I have reviewed the dashboard and it is ready to publish",
      })
    );
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
        publishingGuidance: "abc",
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

  it("update the settings", async () => {
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updatePublishingGuidance).toHaveBeenCalledWith(
      "abc",
      now.toISOString(),
      user
    );
  });
});
