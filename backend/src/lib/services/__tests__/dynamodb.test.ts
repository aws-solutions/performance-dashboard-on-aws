import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { mocked } from "ts-jest/utils";
import DynamoDBService from "../dynamodb";

jest.mock("aws-sdk/clients/dynamodb");
jest.mock("aws-xray-sdk");

let documentClient = mocked(DocumentClient.prototype);
documentClient.transactWrite = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

describe("transactWrite", () => {
  it("creates 2 batches of 25 requests", async () => {
    const numberOfItems = 50;
    const updateItems = [];
    for (let i = 0; i < numberOfItems; i++) {
      updateItems.push({
        Update: {
          Key: {
            pk: i,
          },
          TableName: "Banana",
          UpdateExpression: "set foo = bar",
        },
      });
    }

    const dynamodb = DynamoDBService.getInstance();
    await dynamodb.transactWrite({
      TransactItems: updateItems,
    });

    expect(documentClient.transactWrite).toBeCalledTimes(2);
  });
});
