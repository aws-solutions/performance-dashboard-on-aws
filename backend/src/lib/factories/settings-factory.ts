import { Settings, SettingsItem } from "../models/settings";

function getDefaultSettings(): Settings {
  return {
    publishingGuidance:
      "I acknowledge that I have reviewed the dashboard and it is ready to publish",
  };
}

function fromItem(item: SettingsItem): Settings {
  return {
    publishingGuidance: item.publishingGuidance,
  };
}

export default {
  getDefaultSettings,
  fromItem,
};
