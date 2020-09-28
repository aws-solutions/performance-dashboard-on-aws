import { User } from "../models/user";
import DynamoDBService from "../services/dynamodb";
import DashboardFactory from "../factories/dashboard-factory";
import TopicAreaFactory from "../factories/topicarea-factory";
import WidgetFactory from "../factories/widget-factory";
import { WidgetItem } from "../models/widget";
import { Dashboard, DashboardList, DashboardItem } from "../models/dashboard";

class DashboardRepository {
  private dynamodb: DynamoDBService;
  private tableName: string;
  private static instance: DashboardRepository;

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
  static getInstance(): DashboardRepository {
    if (!DashboardRepository.instance) {
      DashboardRepository.instance = new DashboardRepository();
    }

    return DashboardRepository.instance;
  }

  /**
   * Get a dashboard specifiying the dashboard id
   * and the topicArea id.
   */
  public async getDashboardById(dashboardId: string) {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: DashboardFactory.itemId(dashboardId),
        sk: DashboardFactory.itemId(dashboardId),
      },
    });
    return DashboardFactory.fromItem(result.Item as DashboardItem);
  }

  /**
   * Performs a putItem request to DynamoDB to create
   * a new dashboard item or replace an old one.
   *
   * @param dashboard Dashboard
   */
  public async putDashboard(dashboard: Dashboard) {
    await this.dynamodb.put({
      TableName: this.tableName,
      Item: DashboardFactory.toItem(dashboard),
    });
  }

  /**
   * Returns all Dashboards by performing a query
   * operation against the `byType` Global Secondary Index
   * on the DynamoDB table.
   *
   * TODO: Implement pagination
   */
  public async listDashboards(): Promise<DashboardList> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: "byType",
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":type": "Dashboard",
      },
    });

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) =>
      DashboardFactory.fromItem(item as DashboardItem)
    );
  }

  /**
   * Returns the list of Dashboards within an specified topic area.
   */
  public async listDashboardsWithinTopicArea(
    topicAreaId: string
  ): Promise<DashboardList> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: "byTopicAreaId",
      KeyConditionExpression: "#topicAreaId = :topicAreaId",
      ExpressionAttributeNames: {
        "#topicAreaId": "topicAreaId",
      },
      ExpressionAttributeValues: {
        ":topicAreaId": TopicAreaFactory.itemId(topicAreaId),
      },
    });

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) =>
      DashboardFactory.fromItem(item as DashboardItem)
    );
  }

  /**
   * Updates a Dashboard identified by the param `dashboard`. Sets
   * the `updatedBy` field to the userId doing the update action.
   */
  public async updateDashboard(dashboard: Dashboard, user: User) {
    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: DashboardFactory.itemId(dashboard.id),
          sk: DashboardFactory.itemId(dashboard.id),
        },
        UpdateExpression:
          "set #dashboardName = :dashboardName, #topicAreaId = :topicAreaId, #topicAreaName = :topicAreaName, #description = :description, #updatedAt = :updatedAt, #updatedBy = :userId",
        ConditionExpression: "#updatedAt <= :lastUpdatedAt",
        ExpressionAttributeValues: {
          ":dashboardName": dashboard.name,
          ":topicAreaId": TopicAreaFactory.itemId(dashboard.topicAreaId),
          ":topicAreaName": dashboard.topicAreaName,
          ":description": dashboard.description,
          ":lastUpdatedAt": dashboard.updatedAt.toISOString(),
          ":updatedAt": new Date().toISOString(),
          ":userId": user.userId,
        },
        ExpressionAttributeNames: {
          "#dashboardName": "dashboardName",
          "#topicAreaId": "topicAreaId",
          "#topicAreaName": "topicAreaName",
          "#description": "description",
          "#updatedBy": "updatedBy",
          "#updatedAt": "updatedAt",
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

  /**
   * Updates the updatedAt field. Sets the `updatedBy` field
   * to the userId doing the update action.
   */
  public async updateAt(dashboardId: string, user: User) {
    await this.dynamodb.update({
      TableName: this.tableName,
      Key: {
        pk: DashboardFactory.itemId(dashboardId),
        sk: DashboardFactory.itemId(dashboardId),
      },
      UpdateExpression: "set #updatedAt = :updatedAt, #updatedBy = :userId",
      ExpressionAttributeValues: {
        ":updatedAt": new Date().toISOString(),
        ":userId": user.userId,
      },
      ExpressionAttributeNames: {
        "#updatedBy": "updatedBy",
        "#updatedAt": "updatedAt",
      },
    });
  }

  /**
   * Deletes the Dashboard identified by the params
   * `dashboardId` and `topicAreaId`.
   */
  public async delete(dashboardId: string) {
    await this.dynamodb.delete({
      TableName: this.tableName,
      Key: {
        pk: DashboardFactory.itemId(dashboardId),
        sk: DashboardFactory.itemId(dashboardId),
      },
    });
  }

  public async getDashboardWithWidgets(
    dashboardId: string
  ): Promise<Dashboard> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      KeyConditionExpression: "pk = :dashboardId",
      ExpressionAttributeValues: {
        ":dashboardId": DashboardFactory.itemId(dashboardId),
      },
    });

    if (!result.Items || result.Items.length === 0) {
      throw new Error("Dashboard not found");
    }

    // Query returns multiple items, one of them is the master record
    // that represents the Dashboard item.
    const item = result.Items.find((item) => item.type === "Dashboard");
    const dashboard = DashboardFactory.fromItem(item as DashboardItem);

    // Parse the widgets and add them to the dashboard
    const items = result.Items.filter((item) => item.type === "Widget");
    dashboard.widgets = WidgetFactory.fromItems(items as Array<WidgetItem>);

    return dashboard;
  }
}

export default DashboardRepository;
