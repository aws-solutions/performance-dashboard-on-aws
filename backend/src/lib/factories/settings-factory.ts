import { Settings, SettingsItem } from "../models/settings";

function getDefaultSettings(): Settings {
  return {
    updatedAt: new Date(),
    publishingGuidance:
      "I acknowledge that I have reviewed the dashboard and it is ready to publish",
  };
}

function fromItem(item: SettingsItem): Settings {
  return {
    publishingGuidance: item.publishingGuidance,
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  };
}

export default {
  getDefaultSettings,
  fromItem,
};
