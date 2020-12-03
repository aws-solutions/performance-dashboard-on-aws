import { User } from "../models/user";
import { Homepage, HomepageItem } from "../models/homepage";
import HomepageFactory from "../factories/homepage-factory";
import BaseRepository from "./base";

class HomepageRepository extends BaseRepository {
  protected static instance: HomepageRepository;
  private constructor() {
    super();
  }

  static getInstance(): HomepageRepository {
    if (!HomepageRepository.instance) {
      HomepageRepository.instance = new HomepageRepository();
    }

    return HomepageRepository.instance;
  }

  public async getHomepage(): Promise<Homepage | undefined> {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: "Homepage",
        sk: "Homepage",
      },
    });

    if (!result.Item) {
      return undefined;
    }

    return HomepageFactory.fromItem(result.Item as HomepageItem);
  }

  /**
   * Updates the homepage title and description
   */
  public async updateHomepage(
    title: string,
    description: string,
    lastUpdatedAt: string,
    user: User
  ) {
    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: "Homepage",
          sk: "Homepage",
        },
        UpdateExpression:
          "set #title = :title, #description = :description, #type = :type, #updatedAt = :updatedAt, #updatedBy = :userId",
        ConditionExpression:
          "attribute_not_exists(#updatedAt) or #updatedAt <= :lastUpdatedAt",
        ExpressionAttributeValues: {
          ":title": title,
          ":description": description,
          ":lastUpdatedAt": lastUpdatedAt,
          ":updatedAt": new Date().toISOString(),
          ":userId": user.userId,
          ":type": "Homepage",
        },
        ExpressionAttributeNames: {
          "#title": "title",
          "#description": "description",
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

export default HomepageRepository;
