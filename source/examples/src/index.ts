import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Configuration } from "./common";
import { env } from "./env";
import { importDashboard } from "./services/importer-service";

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
    const config = (event.body as unknown as Configuration) || {};
    if (!config.example) {
      config.example = env.EXAMPLE;
    }
    if (!config.author) {
      config.author = env.USER_EMAIL;
    }
    if (config.reuseTopicArea === undefined) {
      config.reuseTopicArea = true;
    }

    const dashboard = await importDashboard(config);
    console.log({ dashboard });
  } catch (e) {
    console.log(e);
  }

  return context?.logStreamName;
};
