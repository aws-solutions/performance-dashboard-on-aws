import { Settings, SettingsItem } from "../models/settings";

function getDefaultSettings(): Settings {
  return {
    updatedAt: new Date(),
    dateTimeFormat: "YYYY-MM-DD hh:mm",
    publishingGuidance:
      "I acknowledge that I have reviewed " +
      "the dashboard and it is ready to publish",
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
  };
}

export default {
  getDefaultSettings,
  fromItem,
};
