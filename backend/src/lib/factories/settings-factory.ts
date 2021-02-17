import { Settings, PublicSettings, SettingsItem } from "../models/settings";

function getDefaultSettings(): Settings {
  return {
    updatedAt: new Date(),
    dateTimeFormat: {
      date: "YYYY-MM-DD",
      time: "HH:mm",
    },
    publishingGuidance:
      "I acknowledge that I have reviewed " +
      "the dashboard and it is ready to publish",
    navbarTitle: "Performance Dashboard",
    topicAreaLabels: {
      singular: "Topic Area",
      plural: "Topic Areas",
    },
    customLogoS3ID: undefined,
  };
}

function fromItem(item: SettingsItem): Settings {
  const defaults = getDefaultSettings();
  return {
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : defaults.updatedAt,
    publishingGuidance: item.publishingGuidance
      ? item.publishingGuidance
      : defaults.publishingGuidance,
    dateTimeFormat: item.dateTimeFormat
      ? item.dateTimeFormat
      : defaults.dateTimeFormat,
    navbarTitle: item.navbarTitle ? item.navbarTitle : defaults.navbarTitle,
    topicAreaLabels: item.topicAreaLabels
      ? item.topicAreaLabels
      : defaults.topicAreaLabels,
    customLogoS3ID: item.customLogoS3ID
      ? item.customLogoS3ID
      : defaults.customLogoS3ID,
  };
}

function toPublicSettings(settings: Settings): PublicSettings {
  const defaults = getDefaultSettings();
  return {
    dateTimeFormat: settings.dateTimeFormat
      ? settings.dateTimeFormat
      : defaults.dateTimeFormat,
    navbarTitle: settings.navbarTitle
      ? settings.navbarTitle
      : defaults.navbarTitle,
    topicAreaLabels: settings.topicAreaLabels
      ? settings.topicAreaLabels
      : defaults.topicAreaLabels,
    customLogoS3ID: settings.customLogoS3ID
      ? settings.customLogoS3ID
      : defaults.customLogoS3ID,
  };
}

export default {
  getDefaultSettings,
  fromItem,
  toPublicSettings,
};
