import { handler } from "./index";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

handler(
  {
    body: {},
  } as unknown as APIGatewayProxyEvent,
  {} as Context
);
