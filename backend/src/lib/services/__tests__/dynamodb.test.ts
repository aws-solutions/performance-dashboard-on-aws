/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { AwsClientStub, mockClient } from "aws-sdk-client-mock";
import DynamoDBService from "../dynamodb";

describe("transactWrite", () => {
    let dynamoDBMock: AwsClientStub<DynamoDBDocumentClient>;

    beforeAll(() => {
        dynamoDBMock = mockClient(DynamoDBDocumentClient);
        jest.mock("aws-xray-sdk", () => {
            return {
                captureAWSv3Client: <T>(client: T) => client,
            };
        });
    });

    beforeEach(() => {
        dynamoDBMock.reset();
    });

    afterAll(() => {
        dynamoDBMock.restore();
    });

    it("creates 2 batches of 25 requests", async () => {
        dynamoDBMock.on(TransactWriteCommand).resolves({});
        const numberOfItems = 50;
        const updateItems = [];
        for (let i = 0; i < numberOfItems; i++) {
            updateItems.push({
                Update: {
                    Key: {
                        pk: i,
                    },
                    TableName: "Banana",
                    UpdateExpression: "set foo = bar",
                },
            });
        }

        const dynamodb = DynamoDBService.getInstance();
        await dynamodb.transactWrite({
            TransactItems: updateItems,
        });

        expect(dynamoDBMock.commandCalls(TransactWriteCommand).length).toBe(2);
    });
});

describe("unmarshall", () => {
    it("should convert a raw dynamodb item into a javascript object", () => {
        const dynamodb = DynamoDBService.getInstance();
        const item = {
            dashboardId: {
                S: "Dashboard#001",
            },
            version: {
                N: "3",
            },
        };

        const dashboard = dynamodb.unmarshall(item);
        expect(dashboard.dashboardId).toEqual("Dashboard#001");
        expect(dashboard.version).toEqual(3);
    });
});
