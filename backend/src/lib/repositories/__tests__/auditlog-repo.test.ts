import { mocked } from "ts-jest/utils";
import { AuditLogItem } from "../../models/auditlog";
import AuditLogRepository from "../auditlog-repo";
import DynamoDBService from "../../services/dynamodb";

jest.mock("../../services/dynamodb");

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
