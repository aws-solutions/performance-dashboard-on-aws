import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Widget, WidgetItem } from "../models/widget";
import BaseRepository from "./base";
import WidgetFactory, {
  WIDGET_PREFIX,
  WIDGET_ITEM_TYPE,
} from "../factories/widget-factory";

class WidgetRepository extends BaseRepository {
  private static instance: WidgetRepository;
  private constructor() {
    super();
  }

  static getInstance(): WidgetRepository {
    if (!WidgetRepository.instance) {
      WidgetRepository.instance = new WidgetRepository();
    }

    return WidgetRepository.instance;
  }

  public async getWidgets(dashboardId: string): Promise<Array<Widget>> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      KeyConditionExpression: "pk = :dashboardId and begins_with(sk, :sortKey)",
      ExpressionAttributeValues: {
        ":dashboardId": WidgetFactory.itemPk(dashboardId),
        ":sortKey": WIDGET_PREFIX,
      },
    });

    if (!result.Items) {
      return [];
    }

    const items = result.Items.filter((item) => item.type === WIDGET_ITEM_TYPE);
    return WidgetFactory.fromItems(items as Array<WidgetItem>);
  }

  public async getWidgetById(dashboardId: string, widgetId: string) {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: WidgetFactory.itemPk(dashboardId),
        sk: WidgetFactory.itemSk(widgetId),
      },
    });
    return WidgetFactory.fromItem(result.Item as WidgetItem);
  }

  public async saveWidget(widget: Widget) {
    // Before saving new widget, need to determine the proper `order` for it.
    // by finding the last widget sorted by order.
    const widgets = await this.getWidgets(widget.dashboardId);
    if (widgets.length > 0) {
      const lastWidget = widgets.reduce((a, b) => (a.order > b.order ? a : b));
      widget.order = lastWidget.order + 1; // put this widget next to the last one
    }

    await this.dynamodb.put({
      TableName: this.tableName,
      Item: WidgetFactory.toItem(widget),
    });
  }

  public async updateWidget(
    dashboardId: string,
    widgetId: string,
    name: string,
    content: any,
    updatedAt: Date
  ) {
    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: WidgetFactory.itemPk(dashboardId),
          sk: WidgetFactory.itemSk(widgetId),
        },
        UpdateExpression:
          "set #name = :name, #content = :content, #updatedAt = :updatedAt",
        ConditionExpression: "#updatedAt <= :lastUpdatedAt",
        ExpressionAttributeValues: {
          ":name": name,
          ":content": content,
          ":lastUpdatedAt": updatedAt.toISOString(),
          ":updatedAt": new Date().toISOString(),
        },
        ExpressionAttributeNames: {
          "#name": "name",
          "#content": "content",
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

  public async deleteWidget(dashboardId: string, widgetId: string) {
    await this.dynamodb.delete({
      TableName: this.tableName,
      Key: {
        pk: WidgetFactory.itemPk(dashboardId),
        sk: WidgetFactory.itemSk(widgetId),
      },
    });
  }

  public async setWidgetOrder(
    dashboardId: string,
    widgets: Array<{ id: string; order: number; updatedAt: string }>
  ) {
    const transactions: DocumentClient.TransactWriteItemList = widgets.map(
      (widget) => ({
        Update: {
          TableName: this.tableName,
          Key: {
            pk: WidgetFactory.itemPk(dashboardId),
            sk: WidgetFactory.itemSk(widget.id),
          },
          UpdateExpression: "set #order = :order, #updatedAt = :now",
          ConditionExpression: "#updatedAt <= :lastUpdated",
          ExpressionAttributeNames: {
            "#order": "order",
            "#updatedAt": "updatedAt",
          },
          ExpressionAttributeValues: {
            ":order": widget.order,
            ":now": new Date().toISOString(),
            ":lastUpdated": widget.updatedAt,
          },
        },
      })
    );

    await this.dynamodb.transactWrite({ TransactItems: transactions });
  }
}

export default WidgetRepository;
