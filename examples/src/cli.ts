import { handler } from "./index";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Configuration, Languages } from "./common";

const config = {
  reuseTopicArea: true,
  reuseDashboard: false,
  reuseDataset: false,
} as Configuration;

handler(
  {
    body: config,
  } as unknown as APIGatewayProxyEvent,
  {} as Context
);
