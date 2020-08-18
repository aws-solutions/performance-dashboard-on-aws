import { User } from "../models/user";
import DynamoDBService from "../services/dynamodb";
import TopicAreaFactory from "../factories/topicarea-factory";
import {
  TopicArea,
  TopicAreaList,
  TopicAreaItem,
} from "../models/topicarea";

class TopicAreaRepository {
  private dynamodb: DynamoDBService;
  private tableName: string;
  private static instance: TopicAreaRepository;

  /**
   * Repo is a Singleton, hence private constructor
   * to prevent direct constructions calls with new operator.
   */
  private constructor() {
    if (!process.env.BADGER_TABLE) {
      throw new Error("Environment variable BADGER_TABLE not found");
    }

    this.dynamodb = DynamoDBService.getInstance();
    this.tableName = process.env.BADGER_TABLE;
  }

  /**
   * Controls access to the singleton instance.
   */
  static getInstance(): TopicAreaRepository {
    if (!TopicAreaRepository.instance) {
      TopicAreaRepository.instance = new TopicAreaRepository();
    }

    return TopicAreaRepository.instance;
  }

  /**
   * Performs a putItem request to DynamoDB to create a new
   * topic area item.
   *
   * @param topicArea TopicArea
   */
  public async create(topicArea: TopicArea) {
    await this.dynamodb.put({
      TableName: this.tableName,
      Item: TopicAreaFactory.toItem(topicArea),
    });
  }

  /**
   * Get a topicArea specifiying the topicArea id.
   */
  public async getTopicAreaById(id: string) : Promise<TopicArea> {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: TopicAreaFactory.itemId(id),
        sk: TopicAreaFactory.itemId(id),
      },
    });
    return TopicAreaFactory.fromItem(result.Item as TopicAreaItem);
  }

  /**
   * Returns a list of TopicAreas by performing a query
   * operation against the `byType` Global Secondary Index
   * on the DynamoDB table.
   *
   * TODO: Implement pagination
   */
  public async list(): Promise<TopicAreaList> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: "byType",
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":type": "TopicArea",
      },
    });

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) =>
      TopicAreaFactory.fromItem(item as TopicAreaItem)
    );
  }

  /**
   * Updates the name of an existing TopicArea identified
   * by the param `id`. Sets the `updatedBy` field to the userId
   * doing the update action.
   */
  public async updateTopicArea(topicArea: TopicArea, user: User) {
    await this.dynamodb.update({
      TableName: this.tableName,
      Key: {
        pk: TopicAreaFactory.itemId(topicArea.id),
        sk: TopicAreaFactory.itemId(topicArea.id),
      },
      UpdateExpression: "set #name = :name, #updatedBy = :userId",
      ExpressionAttributeValues: {
        ":name": topicArea.name,
        ":userId": user.userId,
      },
      ExpressionAttributeNames: {
        "#name": "name",
        "#updatedBy": "updatedBy",
      },
    });
  }

  /**
   * Deletes the TopicArea identified by the param `id`.
   */
  public async delete(id: string) {
    await this.dynamodb.delete({
      TableName: this.tableName,
      Key: {
        pk: TopicAreaFactory.itemId(id),
        sk: TopicAreaFactory.itemId(id),
      },
    });
  }
}

export default TopicAreaRepository;
