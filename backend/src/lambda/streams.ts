import { DynamoDBStreamEvent, Context } from "aws-lambda";

/**
 * Lambda entry handler for messages coming from the
 * DynamoDB Streams of the main table.
 *
 * @param event
 */
export const handler = (event: DynamoDBStreamEvent, context: Context) => {
  console.log("Event=", JSON.stringify(event));
  console.log("Context=", JSON.stringify(context));

  // TODO: Implement function to process messages from the stream

  return true;
};
