import AWS from "aws-sdk";
import factory from "../models/topicarea-factory";
import { User } from "../models/user-models";
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

async function updateName(id: string, name: string, user: User) {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const tableName = getTableName();

  await dynamodb
    .update({
      TableName: tableName,
      Key: {
        pk: factory.itemId(id),
        sk: factory.itemId(id),
      },
      UpdateExpression: "set #name = :name, #updatedBy = :userId",
      ExpressionAttributeValues: {
        ":name": name,
        ":userId": user.userId,
      },
      ExpressionAttributeNames: {
        "#name": "name",
        "#updatedBy": "updatedBy",
      },
    })
    .promise();
}

async function remove(id: string) {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const tableName = getTableName();
  await dynamodb
    .delete({
      TableName: tableName,
      Key: {
        pk: factory.itemId(id),
        sk: factory.itemId(id),
      },
    })
    .promise();
}

export default {
  create,
  list,
  updateName,
  remove,
};
