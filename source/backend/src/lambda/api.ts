import { APIGatewayProxyEvent, Context } from "aws-lambda";
import serverlessExpress from "aws-serverless-express";
import api from "../lib/api";

const server = serverlessExpress.createServer(api);

function logRequest(event: APIGatewayProxyEvent, context: Context) {
  // Don't log sensitive data such as API body and authorization headers
  let eventToLog = { ...event };
  if (eventToLog) {
    if (eventToLog.resource.includes("ingestapi")) {
      eventToLog = { ...eventToLog, body: null };
    }
    if (eventToLog.headers?.Authorization) {
      eventToLog.headers.Authorization = "<Redacted>";
    }
    if (eventToLog.multiValueHeaders?.Authorization) {
      eventToLog.multiValueHeaders.Authorization = ["<Redacted>"];
    }
  }

  console.log("Event=", JSON.stringify(eventToLog));
  console.log("Context=", JSON.stringify(context));
}

/**
 * Lambda entry handler for HTTP requests
 * coming from API Gateway.
 *
 * @param event
 */
export const handler = (event: APIGatewayProxyEvent, context: Context) => {
  logRequest(event, context);

  return serverlessExpress.proxy(server, event, context);
};
