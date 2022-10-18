import { User } from "../models/user";
import TopicAreaFactory from "../factories/topicarea-factory";
import DashboardFactory from "../factories/dashboard-factory";
import BaseRepository from "./base";
import { TopicArea, TopicAreaList, TopicAreaItem } from "../models/topicarea";
import { ItemNotFound } from "../errors";
import { Dashboard, DashboardItem } from "../models/dashboard";
import DashboardRepository from "./dashboard-repo";

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

    if (!result.Item) {
      throw new ItemNotFound();
    }

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

    const topicareas = result.Items.map((item) =>
      TopicAreaFactory.fromItem(item as TopicAreaItem)
    );

    for await (const topicarea of topicareas) {
      const count = await this.getDashboardCount(topicarea.id);
      topicarea.dashboardCount = count;
    }

    return topicareas;
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

  public async getDashboardCount(topicAreaId: string) {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: "byTopicArea",
      ProjectionExpression:
        "#pk, #sk, #type, #parentDashboardId, #version, #topicAreaId",
      KeyConditionExpression: "#topicAreaId = :topicAreaId",
      ExpressionAttributeNames: {
        "#topicAreaId": "topicAreaId",
        "#pk": "pk",
        "#sk": "sk",
        "#type": "type",
        "#parentDashboardId": "parentDashboardId",
        "#version": "version",
      },
      ExpressionAttributeValues: {
        ":topicAreaId": TopicAreaFactory.itemId(topicAreaId),
      },
    });

    if (!result.Items) {
      return 0;
    }

    const dashboards: Dashboard[] = result.Items.map((item) =>
      DashboardFactory.fromItem(item as DashboardItem)
    );

    // Count the number of dashboards in the query result grouped by parentDashboardId.
    // We don't want to count every dashboard version. We only want to count 1 for
    // every "dashboard family".
    const uniqueParents = new Set();
    dashboards.forEach((dashboard) =>
      uniqueParents.add(dashboard.parentDashboardId)
    );
    return uniqueParents.size;
  }

  public async renameTopicArea(topicAreaId: string, name: string, user: User) {
    // 1. Update the TopicArea item
    await this.dynamodb.update({
      TableName: this.tableName,
      Key: {
        pk: TopicAreaFactory.itemId(topicAreaId),
        sk: TopicAreaFactory.itemId(topicAreaId),
      },
      UpdateExpression: "set #name = :name",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": name,
      },
    });

    // 2. Fetch all dashboards related to this topic area
    const dashboardRepo = DashboardRepository.getInstance();
    const dashboards = await dashboardRepo.listDashboardsInTopicArea(
      topicAreaId
    );

    // 3. Update topicAreaName in every dashboard in the query result
    await dashboardRepo.updateTopicAreaName(dashboards, name, user);
  }
}

export default TopicAreaRepository;
