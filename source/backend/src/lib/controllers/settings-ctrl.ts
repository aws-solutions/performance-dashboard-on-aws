import { Request, Response } from "express";
import SettingsFactory from "../factories/settings-factory";
import SettingsRepository from "../repositories/settings-repo";
import AuthService from "../services/auth";

async function getSettings(req: Request, res: Response) {
  const repo = SettingsRepository.getInstance();
  const settings = await repo.getSettings();

  return res.json(settings);
}

async function updateSettings(req: Request, res: Response) {
  const user = req.user;
  let { updatedAt } = req.body;

  const {
    publishingGuidance,
    dateTimeFormat,
    navbarTitle,
    topicAreaLabels,
    customLogoS3Key,
    customLogoAltText,
    customFaviconS3Key,
    colors,
    adminContactEmailAddress,
    contactEmailAddress,
    contactUsContent,
    analyticsTrackingId,
  } = req.body;

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

  if (topicAreaLabels) {
    if (!topicAreaLabels.singular || !topicAreaLabels.plural) {
      res.status(400);
      return res.send(
        "Missing fields `singular` or `plural` in topicAreaLabels"
      );
    }

    updatedAt = await repo.updateSetting(
      "topicAreaLabels",
      topicAreaLabels,
      updatedAt,
      user
    );
  }

  if (customLogoS3Key) {
    updatedAt = await repo.updateSetting(
      "customLogoS3Key",
      customLogoS3Key,
      updatedAt,
      user
    );
  }

  if (customLogoAltText) {
    updatedAt = await repo.updateSetting(
      "customLogoAltText",
      customLogoAltText,
      updatedAt,
      user
    );
  }

  if (customFaviconS3Key) {
    updatedAt = await repo.updateSetting(
      "customFaviconS3Key",
      customFaviconS3Key,
      updatedAt,
      user
    );
  }

  if (colors) {
    if (!colors.primary || !colors.secondary) {
      res.status(400);
      return res.send("Missing fields `primary` or `secondary` in colors");
    }

    updatedAt = await repo.updateSetting("colors", colors, updatedAt, user);
  }

  if (adminContactEmailAddress) {
    updatedAt = await repo.updateSetting(
      "adminContactEmailAddress",
      adminContactEmailAddress,
      updatedAt,
      user
    );
  }

  if (contactEmailAddress) {
    updatedAt = await repo.updateSetting(
      "contactEmailAddress",
      contactEmailAddress,
      updatedAt,
      user
    );
  }

  if (contactUsContent) {
    updatedAt = await repo.updateSetting(
      "contactUsContent",
      contactUsContent,
      updatedAt,
      user
    );
  }

  if (analyticsTrackingId) {
    updatedAt = await repo.updateSetting(
      "analyticsTrackingId",
      analyticsTrackingId,
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
