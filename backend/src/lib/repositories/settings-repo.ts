import { User } from "../models/user";
import { Settings, SettingsItem } from "../models/settings";
import SettingsFactory from "../factories/settings-factory";
import BaseRepository from "./base";

class SettingsRepository extends BaseRepository {
  protected static instance: SettingsRepository;
  private constructor() {
    super();
  }

  static getInstance(): SettingsRepository {
    if (!SettingsRepository.instance) {
      SettingsRepository.instance = new SettingsRepository();
    }

    return SettingsRepository.instance;
  }

  public async getSettings(): Promise<Settings | undefined> {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: "Settings",
        sk: "Settings",
      },
    });

    if (!result.Item) {
      return undefined;
    }

    return SettingsFactory.fromItem(result.Item as SettingsItem);
  }

  /**
   * Updates the publishing guidance
   */
  public async updatePublishingGuidance(
    publishingGuidance: string,
    lastUpdatedAt: string,
    user: User
  ) {
    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: "Settings",
          sk: "Settings",
        },
        UpdateExpression:
          "set #publishingGuidance = :publishingGuidance, #type = :type, #updatedAt = :updatedAt, #updatedBy = :userId",
        ConditionExpression:
          "attribute_not_exists(#updatedAt) or #updatedAt <= :lastUpdatedAt",
        ExpressionAttributeValues: {
          ":publishingGuidance": publishingGuidance,
          ":lastUpdatedAt": lastUpdatedAt,
          ":updatedAt": new Date().toISOString(),
          ":userId": user.userId,
          ":type": "Settings",
        },
        ExpressionAttributeNames: {
          "#publishingGuidance": "publishingGuidance",
          "#updatedBy": "updatedBy",
          "#updatedAt": "updatedAt",
          "#type": "type",
        },
      });
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        console.log("Someone else updated the item before us");
        return;
      } else {
        throw error;
      }
    }
  }
}

export default SettingsRepository;
