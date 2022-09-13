import { DynamoDBStreamEvent, Context } from "aws-lambda";
import StreamProcessor from "../lib/services/stream-processor";

/**
 * Lambda entry handler for messages coming from the
 * DynamoDB Streams of the main table.
 *
 * @param event
 */
export const handler = async (event: DynamoDBStreamEvent, context: Context) => {
  console.log("Event=", JSON.stringify(event));
  console.log("Context=", JSON.stringify(context));

  const promises = event.Records.map(StreamProcessor.processRecord);
  await Promise.all(promises);

  console.log("Finished processing records", promises.length);
};
