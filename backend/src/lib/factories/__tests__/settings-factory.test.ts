import { SettingsItem } from "../../models/settings";
import SettingsFactory from "../settings-factory";

describe("getDefaultSettings", () => {
  it("returns default values", () => {
    expect(SettingsFactory.getDefaultSettings()).toEqual({
      updatedAt: expect.anything(),
      publishingGuidance:
        "I acknowledge that I have reviewed the dashboard and it is ready to publish",
    });
  });
});

describe("fromItem", () => {
  it("converts a dynamodb item to a Settings object", () => {
    const item: SettingsItem = {
      pk: "Settings",
      sk: "Settings",
      type: "Settings",
      publishingGuidance:
        "I acknowledge that I have reviewed the dashboard and it is ready to publish",
    };

    const settings = SettingsFactory.fromItem(item);
    expect(settings.publishingGuidance).toEqual(
      "I acknowledge that I have reviewed the dashboard and it is ready to publish"
    );
  });
});
