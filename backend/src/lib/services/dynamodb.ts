/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import AWSXRay from "aws-xray-sdk";
import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import logger from "./logger";
import packagejson from "../../../package.json";

/**
 * This class serves as a wrapper to the DynamoDB DocumentClient.
 * The primary benefit of this wrapper is to make testing of other
 * classes that use DynamoDB easier.  Mocking AWS services in unit testing
 * is a pain because of the promise() response structure.
 */
class DynamoDBService {
  private client: DocumentClient;
  private static instance: DynamoDBService;
  private options = {
    customUserAgent: packagejson.awssdkUserAgent + packagejson.version,
  };

  /**
   * DynamoDBService is a Singleton, hence private constructor
   * to prevent direct constructions calls with new operator.
   */
  private constructor() {
    this.client = new DocumentClient(this.options);
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
    logger.debug("DynamoDB GetItem %o", input);
    return this.client.get(input).promise();
  }

  async put(input: DocumentClient.PutItemInput) {
    logger.debug("DynamoDB PutItem %o", input);
    return this.client.put(input).promise();
  }

  async query(input: DocumentClient.QueryInput) {
    logger.debug("DynamoDB Query %o", input);
    return this.client.query(input).promise();
  }

  async update(input: DocumentClient.UpdateItemInput) {
    logger.debug("DynamoDB UpdateItem %o", input);
    return this.client.update(input).promise();
  }

  async delete(input: DocumentClient.DeleteItemInput) {
    logger.debug("DynamoDB DeleteItem %o", input);
    return this.client.delete(input).promise();
  }

  /**
   * This function is useful to convert records from DynamoDB Streams
   * into Javascript objects. It maps the "S", "N", attributes into
   * corresponding primitives (string, number, boolean, etc).
   */
  unmarshall(data: DynamoDB.AttributeMap) {
    return DynamoDB.Converter.unmarshall(data);
  }

  async transactWrite(input: DocumentClient.TransactWriteItemsInput) {
    logger.debug("DynamoDB TransactWrite %o", input);
    if (!input.TransactItems) {
      return;
    }

    // Given that DynamoDB doesn't support more than 25 updates in a transaction.
    // We need to batch them in chunks of 25.
    const batchSize = 25;
    const batches = [];
    let i = 0;
    while (i < input.TransactItems.length) {
      const items = input.TransactItems.slice(i, i + batchSize);
      batches.push(items);
      i += batchSize;
    }

    logger.debug("DynamoDB TransactWrite batches = %d", batches.length);
    for await (const batch of batches) {
      await this.client
        .transactWrite({
          ...input,
          TransactItems: batch,
        })
        .promise();
    }
  }
}

export default DynamoDBService;
