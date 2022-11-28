/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { User } from "../models/user";
import { Settings, SettingsItem } from "../models/settings";
import SettingsFactory from "../factories/settings-factory";
import BaseRepository from "./base";
import logger from "../services/logger";

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

  public async getSettings(): Promise<Settings> {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: "Settings",
        sk: "Settings",
      },
    });

    if (!result.Item) {
      return SettingsFactory.getDefaultSettings();
    }

    return SettingsFactory.fromItem(result.Item as SettingsItem);
  }

  /**
   * Updates a given setting key with the provided setting value.
   * Performs conditional check based on the lastUpdatedAt and
   * also updates the updatedAt value to now(). It returns the new
   * updatedAt value as a date string in ISO format.
   */
  public async updateSetting(
    settingKey: string,
    settingValue: string | object,
    lastUpdatedAt: string,
    user: User
  ): Promise<string> {
    const expressionAttributeKey = `#${settingKey}`;
    const expressionAttributeValue = `:${settingKey}`;
    try {
      const now = new Date().toISOString();
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: "Settings",
          sk: "Settings",
        },
        UpdateExpression:
          `set ${expressionAttributeKey} = ${expressionAttributeValue}, ` +
          `#type = :type, ` +
          `#updatedAt = :updatedAt, ` +
          `#updatedBy = :userId`,
        ConditionExpression:
          "attribute_not_exists(#updatedAt) or #updatedAt <= :lastUpdatedAt",
        ExpressionAttributeValues: {
          [expressionAttributeValue]: settingValue,
          ":lastUpdatedAt": lastUpdatedAt,
          ":updatedAt": now,
          ":userId": user.userId,
          ":type": "Settings",
        },
        ExpressionAttributeNames: {
          [expressionAttributeKey]: settingKey,
          "#updatedBy": "updatedBy",
          "#updatedAt": "updatedAt",
          "#type": "type",
        },
      });
      return now;
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        logger.warn(
          "ConditionalCheckFailed on update setting=%s. Someone else updated the settings before us",
          settingKey
        );
      }
      throw error;
    }
  }
}

export default SettingsRepository;
