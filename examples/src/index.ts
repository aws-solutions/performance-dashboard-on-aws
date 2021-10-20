import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { processConfig, Config } from "./config";
import { setupDashboards } from "./insert-example-dashboard";

function logRequest(event: APIGatewayProxyEvent, context: Context) {
  // Don't log sensitive data such as API body and authorization headers
  let eventToLog: APIGatewayProxyEvent = { ...event };
  if (eventToLog) {
    if (eventToLog.resource?.includes("ingestapi")) {
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
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  logRequest(event, context);

  try {
    const eventConfig = event.body as unknown as Config;
    const config: Config = { ...processConfig, ...eventConfig };
    await setupDashboards(config);
  } catch (e) {
    console.log(e);
  }

  return context?.logStreamName;
};
