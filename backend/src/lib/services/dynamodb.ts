import AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

/**
 * This class serves as a wrapper to the DynamoDB DocumentClient.
 * The primary benefit of this wrapper is to make testing of other
 * classes that use DynamoDB easier.  Mocking AWS services in unit testing
 * is a pain because of the promise() response structure.
 */
class DynamoDBService {
  private client: DocumentClient;
  private static instance: DynamoDBService;

  /**
   * DynamoDBService is a Singleton, hence private constructor
   * to prevent direct constructions calls with new operator.
   */
  private constructor() {
    this.client = new DocumentClient();
    AWSXRay.setContextMissingStrategy(() => {});
    AWSXRay.captureAWSClient((this.client as any).service);
  }

  /**
   * Controls access to the singleton instance.
   */
  static getInstance() {
    if (!DynamoDBService.instance) {
      DynamoDBService.instance = new DynamoDBService();
    }

    return DynamoDBService.instance;
  }

  async get(input: DocumentClient.GetItemInput) {
    return this.client.get(input).promise();
  }

  async put(input: DocumentClient.PutItemInput) {
    return this.client.put(input).promise();
  }

  async query(input: DocumentClient.QueryInput) {
    return this.client.query(input).promise();
  }

  async update(input: DocumentClient.UpdateItemInput) {
    return this.client.update(input).promise();
  }

  async delete(input: DocumentClient.DeleteItemInput) {
    return this.client.delete(input).promise();
  }

  async transactWrite(input: DocumentClient.TransactWriteItemsInput) {
    return this.client.transactWrite(input).promise();
  }
}

export default DynamoDBService;
