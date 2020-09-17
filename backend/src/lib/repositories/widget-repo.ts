import { DocumentClient } from "aws-sdk/clients/dynamodb";
import DynamoDBService from "../services/dynamodb";
import { Widget } from "../models/widget";
import WidgetFactory from "../factories/widget-factory";

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

  public async saveWidget(widget: Widget) {
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
