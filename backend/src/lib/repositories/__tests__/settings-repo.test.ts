import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import { Settings, SettingsItem } from "../../models/settings";
import SettingsRepository from "../settings-repo";
import DynamoDBService from "../../services/dynamodb";
import S3Service from "../../services/s3";

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
  it("returns undefined if Settings is not found", async () => {
    dynamodb.get = jest.fn().mockReturnValueOnce({ Item: null });
    const settings = await repo.getSettings();
    expect(settings).toBeUndefined();
  });

  it("returns a Settings if found on database", async () => {
    const item: SettingsItem = {
      pk: "Settings",
      sk: "Settings",
      type: "Settings",
      publishingGuidance:
        "I acknowledge that I have reviewed the dashboard and it is ready to publish",
    };

    dynamodb.get = jest.fn().mockReturnValueOnce({ Item: item });
    const settings = (await repo.getSettings()) as Settings;

    expect(settings.publishingGuidance).toEqual(
      "I acknowledge that I have reviewed the dashboard and it is ready to publish"
    );
  });
});

describe("updateSettings", () => {
  it("should call updateItem with the correct keys", async () => {
    const now = new Date();
    await repo.updatePublishingGuidance("abc", now.toISOString(), user);
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

  it("should call update with all the fields", async () => {
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    await repo.updatePublishingGuidance("abc", now.toISOString(), user);
    expect(dynamodb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        UpdateExpression:
          "set #publishingGuidance = :publishingGuidance, #type = :type, #updatedAt = :updatedAt, #updatedBy = :userId",
        ExpressionAttributeValues: {
          ":publishingGuidance": "abc",
          ":lastUpdatedAt": now.toISOString(),
          ":updatedAt": now.toISOString(),
          ":userId": user.userId,
          ":type": "Settings",
        },
      })
    );
  });
});
