import DynamoDBService from "../services/dynamodb";

abstract class BaseRepository {
  protected dynamodb: DynamoDBService;
  protected tableName: string;

  constructor() {
    if (!process.env.BADGER_TABLE) {
      throw new Error("Environment variable BADGER_TABLE not found");
    }

    this.dynamodb = DynamoDBService.getInstance();
    this.tableName = process.env.BADGER_TABLE;
  }
}

export default BaseRepository;
