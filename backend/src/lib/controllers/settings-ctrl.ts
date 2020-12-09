import { Request, Response } from "express";
import SettingsFactory from "../factories/settings-factory";
import SettingsRepository from "../repositories/settings-repo";
import AuthService from "../services/auth";

async function getSettings(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401);
    return res.send("Unauthorized");
  }

  const repo = SettingsRepository.getInstance();

  let settings = await repo.getSettings();

  if (!settings) {
    settings = SettingsFactory.getDefaultSettings();
  }

  return res.json({
    ...settings,
  });
}

async function updateSettings(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { publishingGuidance, dateTimeFormat, updatedAt } = req.body;

  if (!updatedAt) {
    res.status(400);
    return res.send("Missing field `updatedAt` in body");
  }

  const repo = SettingsRepository.getInstance();

  /**
   * Potential refactor: Make the updateSetting function in the repo be
   * able to receive multiple settings to update at once.
   */
  if (publishingGuidance) {
    await repo.updateSetting(
      "publishingGuidance",
      publishingGuidance,
      updatedAt,
      user
    );
  }

  if (dateTimeFormat) {
    await repo.updateSetting("dateTimeFormat", dateTimeFormat, updatedAt, user);
  }

  res.send();
}

export default {
  getSettings,
  updateSettings,
};
