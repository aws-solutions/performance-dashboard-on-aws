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
  const settings = await repo.getSettings();

  return res.json(settings);
}

async function updateSettings(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  let { updatedAt } = req.body;
  const { publishingGuidance, dateTimeFormat, navbarTitle } = req.body;

  if (!updatedAt) {
    res.status(400);
    return res.send("Missing field `updatedAt` in body");
  }

  const repo = SettingsRepository.getInstance();

  if (publishingGuidance) {
    updatedAt = await repo.updateSetting(
      "publishingGuidance",
      publishingGuidance,
      updatedAt,
      user
    );
  }

  if (dateTimeFormat) {
    if (!dateTimeFormat.date || !dateTimeFormat.time) {
      res.status(400);
      return res.send("Missing fields `date` or `time` in dateTimeFormat");
    }

    updatedAt = await repo.updateSetting(
      "dateTimeFormat",
      dateTimeFormat,
      updatedAt,
      user
    );
  }

  if (navbarTitle) {
    updatedAt = await repo.updateSetting(
      "navbarTitle",
      navbarTitle,
      updatedAt,
      user
    );
  }
  res.send();
}

async function getPublicSettings(req: Request, res: Response) {
  const repo = SettingsRepository.getInstance();
  let settings = await repo.getSettings();

  const publicSettings = SettingsFactory.toPublicSettings(settings);
  return res.json(publicSettings);
}

export default {
  getSettings,
  getPublicSettings,
  updateSettings,
};
