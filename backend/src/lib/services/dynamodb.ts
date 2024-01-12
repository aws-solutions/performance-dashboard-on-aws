/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import AWSXRay from "aws-xray-sdk";
import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DeleteCommandInput,
    DynamoDBDocumentClient,
    GetCommand,
    GetCommandInput,
    PutCommand,
    PutCommandInput,
    QueryCommand,
    QueryCommandInput,
    TransactWriteCommand,
    TransactWriteCommandInput,
    UpdateCommand,
    UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import logger from "./logger";
import packagejson from "../../../package.json";

/**
 * This class serves as a wrapper to the DynamoDB DocumentClient.
 * The primary benefit of this wrapper is to make testing of other
 * classes that use DynamoDB easier.  Mocking AWS services in unit testing
 * is a pain because of the promise() response structure.
 */
class DynamoDBService {
    private readonly docClient: DynamoDBDocumentClient;
    private static instance: DynamoDBService;
    private readonly options = {
        customUserAgent: packagejson.awssdkUserAgent + packagejson.version,
    };

    /**
     * DynamoDBService is a Singleton, hence private constructor
     * to prevent direct constructions calls with new operator.
     */
    private constructor() {
        AWSXRay.setContextMissingStrategy(() => {});
        this.docClient = DynamoDBDocumentClient.from(
            AWSXRay.captureAWSv3Client(new DynamoDBClient({ ...this.options })),
            {
                marshallOptions: {
                    removeUndefinedValues: true,
                },
            },
        );
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

    async get(input: GetCommandInput) {
        logger.debug("DynamoDB GetItem %o", input);
        const command = new GetCommand(input);
        return await this.docClient.send(command);
    }

    async put(input: PutCommandInput) {
        logger.debug("DynamoDB PutItem %o", input);
        const command = new PutCommand(input);
        return await this.docClient.send(command);
    }

    async query(input: QueryCommandInput) {
        logger.debug("DynamoDB Query %o", input);
        const command = new QueryCommand(input);
        return await this.docClient.send(command);
    }

    async update(input: UpdateCommandInput) {
        logger.debug("DynamoDB UpdateItem %o", input);
        const command = new UpdateCommand(input);
        return await this.docClient.send(command);
    }

    async delete(input: DeleteCommandInput) {
        logger.debug("DynamoDB DeleteItem %o", input);
        const command = new DeleteCommand(input);
        return await this.docClient.send(command);
    }

    /**
     * This function is useful to convert records from DynamoDB Streams
     * into Javascript objects. It maps the "S", "N", attributes into
     * corresponding primitives (string, number, boolean, etc).
     */
    unmarshall(data: { [key: string]: AttributeValue }) {
        return unmarshall(data);
    }

    async transactWrite(input: TransactWriteCommandInput) {
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
            const command = new TransactWriteCommand({
                TransactItems: batch,
            });
            await this.docClient.send(command);
        }
    }
}

export default DynamoDBService;
