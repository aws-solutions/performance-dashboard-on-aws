import { User } from "../models/user";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import DashboardFactory from "../factories/dashboard-factory";
import TopicAreaFactory from "../factories/topicarea-factory";
import WidgetFactory from "../factories/widget-factory";
import { WidgetItem } from "../models/widget";
import { ItemNotFound } from "../errors";
import {
  Dashboard,
  DashboardList,
  DashboardItem,
  DashboardState,
} from "../models/dashboard";
import BaseRepository from "./base";

class DashboardRepository extends BaseRepository {
  private static instance: DashboardRepository;
  private constructor() {
    super();
  }

  static getInstance(): DashboardRepository {
    if (!DashboardRepository.instance) {
      DashboardRepository.instance = new DashboardRepository();
    }

    return DashboardRepository.instance;
  }

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
  public async updateDashboard(
    dashboardId: string,
    name: string,
    topicAreaId: string,
    topicAreaName: string,
    description: string,
    lastUpdatedAt: string,
    user: User
  ) {
    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: DashboardFactory.itemId(dashboardId),
          sk: DashboardFactory.itemId(dashboardId),
        },
        UpdateExpression:
          "set #dashboardName = :dashboardName, #topicAreaId = :topicAreaId, #topicAreaName = :topicAreaName, #description = :description, #updatedAt = :updatedAt, #updatedBy = :userId",
        ConditionExpression: "#updatedAt <= :lastUpdatedAt",
        ExpressionAttributeValues: {
          ":dashboardName": name,
          ":topicAreaId": TopicAreaFactory.itemId(topicAreaId),
          ":topicAreaName": topicAreaName,
          ":description": description,
          ":lastUpdatedAt": lastUpdatedAt,
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
   * Publish a Dashboard identified by the param `dashboardId`.
   */
  public async publishDashboard(
    dashboardId: string,
    lastUpdatedAt: string,
    releaseNotes: string,
    user: User
  ) {
    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: DashboardFactory.itemId(dashboardId),
          sk: DashboardFactory.itemId(dashboardId),
        },
        UpdateExpression:
          "set #state = :state, #updatedAt = :updatedAt, #releaseNotes = :releaseNotes, #updatedBy = :userId",
        ConditionExpression: "#updatedAt <= :lastUpdatedAt",
        ExpressionAttributeValues: {
          ":state": DashboardState.Published,
          ":lastUpdatedAt": lastUpdatedAt,
          ":releaseNotes": releaseNotes,
          ":updatedAt": new Date().toISOString(),
          ":userId": user.userId,
        },
        ExpressionAttributeNames: {
          "#state": "state",
          "#updatedBy": "updatedBy",
          "#releaseNotes": "releaseNotes",
          "#updatedAt": "updatedAt",
        },
      });
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        console.error(
          "ConditionalCheckFailed when publishing dashboard",
          dashboardId
        );
      }
      throw error;
    }
  }

  /**
   * Set a Dashboard identified by the param `dashboardId` to publish pending state.
   */
  public async publishPendingDashboard(
    dashboardId: string,
    lastUpdatedAt: string,
    user: User
  ) {
    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: DashboardFactory.itemId(dashboardId),
          sk: DashboardFactory.itemId(dashboardId),
        },
        UpdateExpression:
          "set #state = :state, #updatedAt = :updatedAt, #updatedBy = :userId",
        ConditionExpression: "#updatedAt <= :lastUpdatedAt",
        ExpressionAttributeValues: {
          ":state": DashboardState.PublishPending,
          ":lastUpdatedAt": lastUpdatedAt,
          ":updatedAt": new Date().toISOString(),
          ":userId": user.userId,
        },
        ExpressionAttributeNames: {
          "#state": "state",
          "#updatedBy": "updatedBy",
          "#updatedAt": "updatedAt",
        },
      });
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        console.error(
          "ConditionalCheckFailed when publishing dashboard",
          dashboardId
        );
      }
      throw error;
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
      throw new ItemNotFound();
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

  public async listPublishedDashboards(): Promise<Array<Dashboard>> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: "byType",
      KeyConditionExpression: "#type = :type",
      FilterExpression: "#state = :state",
      ExpressionAttributeNames: {
        "#type": "type",
        "#state": "state",
      },
      ExpressionAttributeValues: {
        ":type": "Dashboard",
        ":state": DashboardState.Published,
      },
    });

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) =>
      DashboardFactory.fromItem(item as DashboardItem)
    );
  }

  public async getCurrentDraft(
    parentDashboardId: string
  ): Promise<Dashboard | null> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: "byParentDashboard",
      KeyConditionExpression: "parentDashboardId = :parentDashboardId",
      FilterExpression: "#state = :state",
      ExpressionAttributeNames: {
        "#state": "state",
      },
      ExpressionAttributeValues: {
        ":parentDashboardId": parentDashboardId,
        ":state": DashboardState.Draft,
      },
    });

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return DashboardFactory.fromItem(result.Items[0] as DashboardItem);
  }

  public async saveDashboardAndWidgets(dashboard: Dashboard) {
    const transactions: DocumentClient.TransactWriteItemList = [];

    // Add the dashboard item to the transactions
    transactions.push({
      Put: {
        TableName: this.tableName,
        Item: DashboardFactory.toItem(dashboard),
      },
    });

    // Add widgets, if any
    if (dashboard.widgets) {
      dashboard.widgets.forEach((widget) => {
        transactions.push({
          Put: {
            TableName: this.tableName,
            Item: WidgetFactory.toItem(widget),
          },
        });
      });
    }

    await this.dynamodb.transactWrite({
      TransactItems: transactions,
    });
  }
}

export default DashboardRepository;
