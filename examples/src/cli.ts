import { handler } from "./index";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

handler(
  {
    body: {
      tableName: process.env.EXAMPLE_TABLENAME,
      examples: process.env.EXAMPLE_EXAMPLESBUCKET,
      datasets: process.env.EXAMPLE_DATASETBUCKET,
      useremail: process.env.EXAMPLE_USEREMAIL,
      language: process.env.EXAMPLE_LANGUAGE,
    },
  } as unknown as APIGatewayProxyEvent,
  {} as Context
);
