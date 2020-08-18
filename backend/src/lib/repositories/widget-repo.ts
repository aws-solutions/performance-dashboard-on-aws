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
}

export default WidgetRepository;
