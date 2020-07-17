import { mocked } from 'ts-jest/utils';
import DynamoDbService from '../dynamodb';

jest.mock('aws-sdk');
import AWS from 'aws-sdk';

let client : AWS.DynamoDB.DocumentClient;
let dynamodb : DynamoDbService;
let tableName = "BagderTable";

beforeEach(() => {
  /**
   * Mock dynamodb client
   */
  client = mocked(AWS.DynamoDB.DocumentClient.prototype, true);
  mocked(AWS.DynamoDB.DocumentClient).mockReturnValue(client);
  client.put = jest.fn().mockReturnValue({ promise: jest.fn() });

  /**
   * Initialize DynamoDbService
   */
  process.env.BADGER_TABLE = tableName;
  dynamodb = new DynamoDbService();
});

describe('DynamoDbService.putItem', () => {
  it('should do a put request', async () => {
    const item = { id: 'abc' };
    await dynamodb.putItem(item);
    expect(client.put).toHaveBeenCalledWith({
      TableName: tableName,
      Item: item
    });
  });
});