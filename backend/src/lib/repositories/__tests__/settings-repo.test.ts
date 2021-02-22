import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import { Settings, SettingsItem } from "../../models/settings";
import SettingsRepository from "../settings-repo";
import DynamoDBService from "../../services/dynamodb";
import S3Service from "../../services/s3";
import SettingsFactory from "../../factories/settings-factory";

jest.mock("../../services/dynamodb");
jest.mock("../../services/s3");
jest.mock("../../factories/dataset-factory");

let tableName: string;
let repo: SettingsRepository;
let dynamodb = mocked(DynamoDBService.prototype);
let s3Service = mocked(S3Service.prototype);
let user: User;

beforeAll(() => {
  user = { userId: "test" };
  tableName = "MainTable";
  process.env.MAIN_TABLE = tableName;

  DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
  S3Service.getInstance = jest.fn().mockReturnValue(s3Service);
  repo = SettingsRepository.getInstance();
});

describe("getSettings", () => {
  it("returns default settings if Settings not found", async () => {
    const defaultSettings = { foo: "bar" };
    SettingsFactory.getDefaultSettings = jest
      .fn()
      .mockReturnValue(defaultSettings);

    dynamodb.get = jest.fn().mockReturnValueOnce({ Item: null });
    const settings = await repo.getSettings();

    expect(settings).toBe(defaultSettings);
  });

  it("returns a Settings if found on database", async () => {
    const item: SettingsItem = {
      pk: "Settings",
      sk: "Settings",
      type: "Settings",
      publishingGuidance:
        "I acknowledge that I have reviewed the dashboard and it is ready to publish",
      navbarTitle: "Performance Dashboard",
      topicAreaLabels: {
        singular: "Topic Area",
        plural: "Topic Areas",
      },
      customLogoS3Key: "12345",
    };

    dynamodb.get = jest.fn().mockReturnValueOnce({ Item: item });
    const settings = (await repo.getSettings()) as Settings;

    expect(settings.publishingGuidance).toEqual(
      "I acknowledge that I have reviewed the dashboard and it is ready to publish"
    );
  });
});

describe("updateSetting", () => {
  const settingKey = "foo";
  const settingValue = "bar";
  const lastUpdated = new Date().toISOString();

  it("should call updateItem with the correct Key", async () => {
    await repo.updateSetting(settingKey, settingValue, lastUpdated, user);
    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: {
          pk: "Settings",
          sk: "Settings",
        },
      })
    );
  });

  it("should call updateItem with type=Settings", async () => {
    await repo.updateSetting(settingKey, settingValue, lastUpdated, user);
    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        /**
         * Making sure that type is always set to Settings is important
         * because it covers the scenario where the Settings item does
         * not exist in the database yet and it is being created for the
         * first time.
         */
        ExpressionAttributeValues: expect.objectContaining({
          ":type": "Settings",
        }),
      })
    );
  });

  it("should update the correct setting key", async () => {
    await repo.updateSetting(settingKey, settingValue, lastUpdated, user);
    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        ExpressionAttributeNames: expect.objectContaining({
          "#foo": "foo",
        }),
        ExpressionAttributeValues: expect.objectContaining({
          ":foo": "bar",
        }),
      })
    );
  });
});
