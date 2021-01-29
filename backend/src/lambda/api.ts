import { APIGatewayProxyEvent, Context } from "aws-lambda";
import serverlessExpress from "aws-serverless-express";
import api from "../lib/api";

const server = serverlessExpress.createServer(api);

/**
 * Lambda entry handler for HTTP requests
 * coming from API Gateway.
 *
 * @param event
 */
export const handler = (event: APIGatewayProxyEvent, context: Context) => {
  let eventToLog = { ...event };
  if (eventToLog && eventToLog.resource.includes("ingestapi")) {
    eventToLog = { ...eventToLog, body: null };
  }

  console.log("Event=", JSON.stringify(eventToLog));
  console.log("Context=", JSON.stringify(context));

  return serverlessExpress.proxy(server, event, context);
};
