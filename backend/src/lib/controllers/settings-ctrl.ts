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

  const { publishingGuidance, updatedAt } = req.body;

  if (publishingGuidance) {
    const repo = SettingsRepository.getInstance();
    await repo.updatePublishingGuidance(publishingGuidance, updatedAt, user);
  }

  res.send();
}

export default {
  getSettings,
  updateSettings,
};
