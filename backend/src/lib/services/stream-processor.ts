import { DynamoDBRecord, StreamRecord } from "aws-lambda";
import DynamoDBService from "./dynamodb";
import AuditTrailService from "./audit-trail";
import { ItemEvent } from "../models/auditlog";
import logger from "./logger";

/**
 * This function is the entry point for processing a single
 * message coming from the DynamoDB Stream of the main table.
 *
 * Relevant documentation:
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.Tutorial.html
 */
async function processRecord(record: DynamoDBRecord) {
  if (!record.dynamodb || record.eventSource != "aws:dynamodb") {
    logger.error("Discarding invalid stream record");
    return;
  }

  switch (record.eventName) {
    case "MODIFY":
      logger.info("Handling MODIFY stream record");
      return handleModifyRecord(record.dynamodb);

    case "INSERT":
      logger.info("Handling INSERT stream record");
      return handleInsertRecord(record.dynamodb);

    case "REMOVE":
      logger.info("Handling REMOVE stream record");
      return handleRemoveRecord(record.dynamodb);

    default:
      logger.error("Discarding stream record, unknown eventName");
      return;
  }
}

/**
 * Handles a MODIFY record, which occurs when an item is updated on the
 * main table. The record contains the old item (OldImage) and the new
 * item (NewImage).
 */
async function handleModifyRecord(record: StreamRecord) {
  if (!record.OldImage || !record.NewImage) {
    logger.error("Discarding stream record. Missing `OldImage` or `NewImage`");
    return;
  }

  const dynamodb = DynamoDBService.getInstance();
  const oldItem = dynamodb.unmarshall(record.OldImage);
  const newItem = dynamodb.unmarshall(record.NewImage);

  const timestamp = getTimestampFromRecord(record);
  return AuditTrailService.handleItemEvent(
    ItemEvent.Update,
    oldItem,
    newItem,
    timestamp
  );
}

/**
 * Handles an INSERT record, which occurs when a new item is created on the
 * main table. The record contains the new item (NewImage).
 */
async function handleInsertRecord(record: StreamRecord) {
  if (!record.NewImage) {
    logger.error("Discarding stream record. Missing `NewImage`");
    return;
  }

  const dynamodb = DynamoDBService.getInstance();
  const newItem = dynamodb.unmarshall(record.NewImage);

  const timestamp = getTimestampFromRecord(record);
  return AuditTrailService.handleItemEvent(
    ItemEvent.Create,
    null,
    newItem,
    timestamp
  );
}

/**
 * Handles a REMOVE record, which occurs when an item is deleted from the
 * main table. The record contains the deleted item (OldImage).
 */
async function handleRemoveRecord(record: StreamRecord) {
  if (!record.OldImage) {
    logger.error("Discarding stream record. Missing `OldImage`");
    return;
  }

  const dynamodb = DynamoDBService.getInstance();
  const oldItem = dynamodb.unmarshall(record.OldImage);

  const timestamp = getTimestampFromRecord(record);
  return AuditTrailService.handleItemEvent(
    ItemEvent.Delete,
    oldItem,
    null,
    timestamp
  );
}

function getTimestampFromRecord(record: StreamRecord): Date {
  if (!record.ApproximateCreationDateTime) {
    return new Date();
  }

  const epochTime = record.ApproximateCreationDateTime as number;
  return new Date(epochTime * 1000);
}

export default {
  processRecord,
};
