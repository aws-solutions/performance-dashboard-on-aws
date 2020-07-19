import AWS from "aws-sdk";
import factory from "../models/topicarea-factory";
import DynamoDbService from "../services/dynamodb";
import {
  TopicArea,
  TopicAreaList,
  TopicAreaItem,
} from "../models/topicarea-models";

function getTableName(): string {
  if (!process.env.BADGER_TABLE) {
    throw new Error("Environment variable BADGER_TABLE missing");
  }
  return process.env.BADGER_TABLE;
}

async function create(topicArea: TopicArea) {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const tableName = getTableName();

  const item = factory.toItem(topicArea);
  await dynamodb
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();
}

async function list(): Promise<TopicAreaList> {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const tableName = getTableName();

  const result = await dynamodb
    .query({
      TableName: tableName,
      IndexName: "byType",
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":type": "TopicArea",
      },
    })
    .promise();

  if (!result.Items) {
    return [];
  }

  return result.Items.map((item) => factory.fromItem(item as TopicAreaItem));
}

export default {
  create,
  list,
};
