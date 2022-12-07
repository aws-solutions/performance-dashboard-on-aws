/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { mocked } from "ts-jest/utils";
import { AuditLogItem } from "../../models/auditlog";
import AuditLogRepository from "../auditlog-repo";
import AuditLogFactory from "../../factories/auditlog-factory";
import DynamoDBService from "../../services/dynamodb";

jest.mock("../../services/dynamodb");
jest.mock("../../factories/auditlog-factory");

process.env.AUDIT_TRAIL_TABLE = "AuditTrailTable";

const dynamodb = mocked(DynamoDBService.prototype);
DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);

describe("saveAuditLog", () => {
    it("calls putItem on dynamodb service", async () => {
        const auditLog = {} as AuditLogItem;
        await AuditLogRepository.saveAuditLog(auditLog);
        expect(dynamodb.put).toBeCalledWith({
            TableName: "AuditTrailTable",
            Item: auditLog,
        });
    });
});

describe("listAuditLogs", () => {
    it("queries dynamodb", async () => {
        await AuditLogRepository.listAuditLogs("Dashboard#001");
        expect(dynamodb.query).toBeCalledWith({
            TableName: "AuditTrailTable",
            KeyConditionExpression: "#pk = :pk",
            ScanIndexForward: false,
            ExpressionAttributeNames: {
                "#pk": "pk",
            },
            ExpressionAttributeValues: {
                ":pk": "Dashboard#001",
            },
        });
    });

    it("converts audit log items into audit log objects", async () => {
        const item = { foo: "bar" };
        dynamodb.query = jest.fn().mockReturnValue({ Items: [item] });

        const auditLog = { fizz: "buzz" };
        AuditLogFactory.fromItem = jest.fn().mockReturnValueOnce(auditLog);

        const result = await AuditLogRepository.listAuditLogs("Dashboard#001");
        expect(result).toContain(auditLog);
        expect(AuditLogFactory.fromItem).toBeCalledWith(item);
    });
});
