import { AuditLog, AuditLogItem } from "../models/auditlog";
import DynamoDBService from "../services/dynamodb";
import AuditLogFactory from "../factories/auditlog-factory";
import logger from "../services/logger";

async function saveAuditLog(auditLog: AuditLogItem) {
  const dynamodb = DynamoDBService.getInstance();
  logger.info("Saving audit log record %o", auditLog);
  return dynamodb.put({
    TableName: getTableName(),
    Item: auditLog,
  });
}

async function listAuditLogs(pk: string): Promise<AuditLog[]> {
  const dynamodb = DynamoDBService.getInstance();
  logger.info("Listing audit logs for pk = %s", pk);

  const queryResult = await dynamodb.query({
    TableName: getTableName(),
    KeyConditionExpression: "#pk = :pk",
    ScanIndexForward: false, // get items in descending order of timestamp (sk)
    ExpressionAttributeNames: {
      "#pk": "pk",
    },
    ExpressionAttributeValues: {
      ":pk": pk,
    },
  });

  if (!queryResult || !queryResult.Items) {
    logger.info("Query did not return any results");
    return [];
  }

  const auditLogs: AuditLog[] = [];
  queryResult.Items.forEach((item) => {
    const auditLog = AuditLogFactory.fromItem(item as AuditLogItem);
    if (auditLog) {
      auditLogs.push(auditLog);
    }
  });

  return auditLogs;
}

function getTableName(): string {
  return process.env.AUDIT_TRAIL_TABLE as string;
}

export default {
  saveAuditLog,
  listAuditLogs,
};
