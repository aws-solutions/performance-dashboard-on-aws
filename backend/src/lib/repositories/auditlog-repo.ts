import { AuditLogItem } from "../models/auditlog";
import DynamoDBService from "../services/dynamodb";
import logger from "../services/logger";

async function saveAuditLog(auditLog: AuditLogItem) {
  const dynamodb = DynamoDBService.getInstance();
  logger.info("Saving audit log record %o", auditLog);
  return dynamodb.put({
    TableName: getTableName(),
    Item: auditLog,
  });
}

function getTableName(): string {
  return process.env.AUDIT_TRAIL_TABLE as string;
}

export default {
  saveAuditLog,
};
