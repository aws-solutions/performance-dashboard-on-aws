import { DocumentClient } from "aws-sdk/clients/dynamodb";
import DynamoDBService from "../services/dynamodb";
import { Widget, WidgetItem } from "../models/widget";
import WidgetFactory, {
  WIDGET_PREFIX,
  WIDGET_ITEM_TYPE,
} from "../factories/widget-factory";

class WidgetRepository {
  private dynamodb: DynamoDBService;
  private tableName: string;
  private static instance: WidgetRepository;

  private constructor() {
    if (!process.env.BADGER_TABLE) {
      throw new Error("Environment variable BADGER_TABLE not found");
    }

    this.dynamodb = DynamoDBService.getInstance();
    this.tableName = process.env.BADGER_TABLE;
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
          ConditionExpression:
            "attribute_not_exists(#updatedAt) or #updatedAt <= :lastUpdated",
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
