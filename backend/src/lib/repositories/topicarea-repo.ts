import AWS from "aws-sdk";
import TopicAreaFactory from "../models/topicarea-factory";
import { User } from "../models/user-models";
import {
  TopicArea,
  TopicAreaList,
  TopicAreaItem,
} from "../models/topicarea-models";

class TopicAreaRepository {
  private dynamodb: AWS.DynamoDB.DocumentClient;
  private tableName: string;
  private static instance: TopicAreaRepository;

  private constructor() {
    if (!process.env.BADGER_TABLE) {
      throw new Error("Environment variable BADGER_TABLE not found");
    }

    this.dynamodb = new AWS.DynamoDB.DocumentClient();
    this.tableName = process.env.BADGER_TABLE;
  }

  static getInstance() {
    if (!TopicAreaRepository.instance) {
      TopicAreaRepository.instance = new TopicAreaRepository();
    }

    return TopicAreaRepository.instance;
  }

  async create(topicArea: TopicArea) {
    const item = TopicAreaFactory.toItem(topicArea);
    await this.dynamodb
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  }

  async list(): Promise<TopicAreaList> {
    const result = await this.dynamodb
      .query({
        TableName: this.tableName,
        IndexName: "byType",
        KeyConditionExpression: "#type = :type",
        ExpressionAttributeNames: {
          "#type": "type",
        },
        ExpressionAttributeValues: {
          ":type": "TopicArea",
        },
      })
      .promise();

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) =>
      TopicAreaFactory.fromItem(item as TopicAreaItem)
    );
  }

  async updateName(id: string, name: string, user: User) {
    await this.dynamodb
      .update({
        TableName: this.tableName,
        Key: {
          pk: TopicAreaFactory.itemId(id),
          sk: TopicAreaFactory.itemId(id),
        },
        UpdateExpression: "set #name = :name, #updatedBy = :userId",
        ExpressionAttributeValues: {
          ":name": name,
          ":userId": user.userId,
        },
        ExpressionAttributeNames: {
          "#name": "name",
          "#updatedBy": "updatedBy",
        },
      })
      .promise();
  }

  async delete(id: string) {
    await this.dynamodb
      .delete({
        TableName: this.tableName,
        Key: {
          pk: TopicAreaFactory.itemId(id),
          sk: TopicAreaFactory.itemId(id),
        },
      })
      .promise();
  }
}

export default TopicAreaRepository;
