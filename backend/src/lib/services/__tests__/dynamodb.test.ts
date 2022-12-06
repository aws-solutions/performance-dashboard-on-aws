/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { mocked } from "ts-jest/utils";
import DynamoDBService from "../dynamodb";

jest.mock("aws-xray-sdk");

describe("transactWrite", () => {
    jest.mock("aws-sdk/clients/dynamodb");
    let documentClient = mocked(DocumentClient.prototype);
    documentClient.transactWrite = jest.fn().mockReturnValue({
        promise: jest.fn(),
    });

    it("creates 2 batches of 25 requests", async () => {
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

        expect(documentClient.transactWrite).toBeCalledTimes(2);
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
