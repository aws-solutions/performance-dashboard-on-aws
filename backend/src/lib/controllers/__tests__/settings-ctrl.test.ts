import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import SettingsFactory from "../../factories/settings-factory";
import SettingsRepository from "../../repositories/settings-repo";
import SettingsCtrl from "../settings-ctrl";

jest.mock("../../repositories/settings-repo");
jest.mock("../../factories/settings-factory");

const user: User = { userId: "johndoe" };
const repository = mocked(SettingsRepository.prototype);
const req = ({} as any) as Request;
let res: Response;

beforeEach(() => {
  SettingsRepository.getInstance = jest.fn().mockReturnValue(repository);
  res = ({
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any) as Response;
});

describe("getSettings", () => {
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
      user,
      body: {
        updatedAt: now.toISOString(),
      },
    } as any) as Request;
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

  it("updates customLogoS3Key setting", async () => {
    req.body.customLogoS3Key = "abc";
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updateSetting).toHaveBeenCalledWith(
      "customLogoS3Key",
      "abc",
      now.toISOString(),
      user
    );
  });

  it("updates colors setting", async () => {
    req.body.colors = { primary: "#ffffff", secondary: "#fff" };
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updateSetting).toHaveBeenCalledWith(
      "colors",
      {
        primary: "#ffffff",
        secondary: "#fff",
      },
      now.toISOString(),
      user
    );
  });

  it("updates contact email", async () => {
    req.body.contactEmailAddress = "test@aol.com";
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updateSetting).toHaveBeenCalledWith(
      "contactEmailAddress",
      "test@aol.com",
      now.toISOString(),
      user
    );
  });

  it("updates admin contact email", async () => {
    req.body.adminContactEmailAddress = "test@hotmail.com";
    await SettingsCtrl.updateSettings(req, res);
    expect(repository.updateSetting).toHaveBeenCalledWith(
      "adminContactEmailAddress",
      "test@hotmail.com",
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
