import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Configuration, ExampleBuilder, Language, Languages } from "./common";
import { env } from "./env";
import { englishBuilder } from "./languages/english/example";

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
    if (!config.language) {
      config.language = env.LANGUAGE as Language;
    }
    if (!config.author) {
      config.author = env.USER_EMAIL;
    }

    const builderMap = new Map<Language, ExampleBuilder>();
    builderMap.set(Languages.English, englishBuilder);

    const builder = builderMap.get(config.language);
    if (!builder) {
      throw new Error(`Language ${config.language} not supported`);
    }

    const dashboard = await builder.build(config);
    console.log({ dashboard });
  } catch (e) {
    console.log(e);
  }

  return context?.logStreamName;
};
