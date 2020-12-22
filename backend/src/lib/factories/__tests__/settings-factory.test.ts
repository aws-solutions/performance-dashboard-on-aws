import { SettingsItem, Settings } from "../../models/settings";
import SettingsFactory from "../settings-factory";

describe("getDefaultSettings", () => {
  it("returns default values", () => {
    expect(SettingsFactory.getDefaultSettings()).toEqual({
      updatedAt: expect.anything(),
      dateTimeFormat: {
        date: "YYYY-MM-DD",
        time: "HH:mm",
      },
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
      dateTimeFormat: {
        date: "YYYY-MM-DD",
        time: "HH:mm",
      },
      publishingGuidance: "I acknowledge foo is equal to bar",
      updatedAt: "2020-12-09T17:21:42.823Z",
    };

    const settings = SettingsFactory.fromItem(item);
    expect(settings).toEqual({
      publishingGuidance: "I acknowledge foo is equal to bar",
      dateTimeFormat: {
        date: "YYYY-MM-DD",
        time: "HH:mm",
      },
      updatedAt: new Date("2020-12-09T17:21:42.823Z"),
    });
  });
});

describe("toPublicSettings", () => {
  it("removes values that should not be public", () => {
    const settings: Settings = {
      updatedAt: new Date(),
      publishingGuidance: "foo=bar",
      dateTimeFormat: {
        date: "MMM, YYY",
        time: "hh:mm",
      },
    };

    const publicSettings = SettingsFactory.toPublicSettings(settings);
    expect(publicSettings).toEqual({
      dateTimeFormat: {
        date: "MMM, YYY",
        time: "hh:mm",
      },
    });
  });
});
