import { User } from "../models/user";
import TopicAreaFactory from "../factories/topicarea-factory";
import BaseRepository from "./base";
import { TopicArea, TopicAreaList, TopicAreaItem } from "../models/topicarea";

class TopicAreaRepository extends BaseRepository {
  private static instance: TopicAreaRepository;
  private constructor() {
    super();
  }

  static getInstance(): TopicAreaRepository {
    if (!TopicAreaRepository.instance) {
      TopicAreaRepository.instance = new TopicAreaRepository();
    }

    return TopicAreaRepository.instance;
  }

  public async create(topicArea: TopicArea) {
    await this.dynamodb.put({
      TableName: this.tableName,
      Item: TopicAreaFactory.toItem(topicArea),
    });
  }

  public async getTopicAreaById(id: string): Promise<TopicArea> {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: TopicAreaFactory.itemId(id),
        sk: TopicAreaFactory.itemId(id),
      },
    });
    return TopicAreaFactory.fromItem(result.Item as TopicAreaItem);
  }

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
