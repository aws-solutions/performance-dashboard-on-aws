import { v4 as uuidv4 } from "uuid";
import { DynamoDB } from "aws-sdk";
import awsWrapper from "./aws-wrapper";
import { Config } from "./config";

const databaseIdPrefixes = {
  dataset: "Dataset",
  dashboard: "Dashboard",
  widget: "Widget",
  topicArea: "TopicArea",
};

function generateDBId(prefix: string, id?: string) {
  id = id !== undefined ? id : uuidv4();
  return `${prefix}#${id}`;
}

async function saveTopicArea(
  deploymentContext: Config,
  topicAreaBucketKey: string
) {
  if (deploymentContext === undefined)
    throw new Error("deploymentContext is undefined");
  if (topicAreaBucketKey === undefined)
    throw new Error("topicAreaBucketKey is undefined");

  let topicAreaEntity =
    await awsWrapper.getJsonOfKey<DynamoDB.PutItemInputAttributeMap>(
      deploymentContext.examplesBucket,
      topicAreaBucketKey
    );

  topicAreaEntity.pk.S = generateDBId(databaseIdPrefixes.topicArea);
  topicAreaEntity.sk.S = topicAreaEntity.pk.S;
  topicAreaEntity.createdBy.S = deploymentContext.userEmail;

  await awsWrapper.dynamoSave(deploymentContext.tableName, topicAreaEntity);
  return topicAreaEntity.pk.S;
}

async function saveDashboard(
  deploymentContext: Config,
  topicAreaId: string,
  dashboardBucketKey: string
) {
  if (deploymentContext === undefined)
    throw new Error("deploymentContext is undefined");
  if (topicAreaId === undefined) throw new Error("topicAreaId is undefined");
  if (dashboardBucketKey === undefined)
    throw new Error("dashboardBucketKey is undefined");

  let dashboardEntity =
    await awsWrapper.getJsonOfKey<DynamoDB.PutItemInputAttributeMap>(
      deploymentContext.examplesBucket,
      dashboardBucketKey
    );

  const entityId = uuidv4();
  dashboardEntity.pk.S = generateDBId(databaseIdPrefixes.dashboard, entityId);
  dashboardEntity.sk.S = dashboardEntity.pk.S;
  dashboardEntity.parentDashboardId.S = entityId;
  dashboardEntity.createdBy.S = deploymentContext.userEmail;
  dashboardEntity.updatedBy.S = deploymentContext.userEmail;
  dashboardEntity.topicAreaId.S = topicAreaId;

  await awsWrapper.dynamoSave(deploymentContext.tableName, dashboardEntity);
  return dashboardEntity.pk.S;
}

const saveChart = async function (
  deploymentContext: Config,
  dashboardId: string,
  datasetUUID: string,
  dataFileUUID: string,
  widgetKey: string
) {
  if (deploymentContext === undefined)
    throw new Error("deploymentContext is undefined");
  if (dashboardId === undefined) throw new Error("dashboardId is undefined");
  if (datasetUUID === undefined) throw new Error("datasetUUID is undefined");
  if (dataFileUUID === undefined) throw new Error("datafileUUID is undefined");
  if (widgetKey === undefined) throw new Error("widgetKey is undefined");

  let widgetEntity =
    await awsWrapper.getJsonOfKey<DynamoDB.PutItemInputAttributeMap>(
      deploymentContext.examplesBucket,
      widgetKey
    );

  // ts-ignore
  widgetEntity.pk.S = dashboardId;
  widgetEntity.sk.S = generateDBId(databaseIdPrefixes.widget);
  if (widgetEntity.content.M) {
    widgetEntity.content.M.datasetId.S = datasetUUID;
    if (widgetEntity.content.M.s3Key.M) {
      widgetEntity.content.M.s3Key.M.raw.S = `${dataFileUUID}.csv`;
      widgetEntity.content.M.s3Key.M.json.S = `${dataFileUUID}.json`;
    }
  }

  await awsWrapper.dynamoSave(deploymentContext.tableName, widgetEntity);
};

const saveDataset = async function (
  deploymentContext: Config,
  datasetUUID: string,
  dataFileUUID: string,
  datasetKey: string
) {
  if (deploymentContext === undefined)
    throw new Error("deploymentContext is undefined");
  if (datasetUUID === undefined) throw new Error("datasetUUID is undefined");
  if (dataFileUUID === undefined) throw new Error("dataFileUUID is undefined");
  if (datasetKey === undefined) throw new Error("datasetKey is undefined");

  let datasetEntity =
    await awsWrapper.getJsonOfKey<DynamoDB.PutItemInputAttributeMap>(
      deploymentContext.examplesBucket,
      datasetKey
    );
  if (!datasetEntity) {
    throw new Error("Unable to read dataset entity.");
  }

  datasetEntity.pk.S = generateDBId(databaseIdPrefixes.dataset, datasetUUID);
  datasetEntity.sk.S = datasetEntity.pk.S;
  datasetEntity.createdBy.S = deploymentContext.userEmail;
  if (datasetEntity.s3Key.M) {
    datasetEntity.s3Key.M.raw.S = `${dataFileUUID}.csv`;
    datasetEntity.s3Key.M.json.S = `${dataFileUUID}.json`;
  }

  await awsWrapper.dynamoSave(deploymentContext.tableName, datasetEntity);
  return datasetEntity.pk.S;
};

const saveText = async function (
  deploymentContext: Config,
  dashboardId: string,
  widgetKey: string
) {
  if (deploymentContext === undefined)
    throw new Error("deploymentContext is undefined");
  if (dashboardId === undefined) throw new Error("dashboardId is undefined");
  if (widgetKey === undefined) throw new Error("widgetKey is undefined");

  let widgetEntity =
    await awsWrapper.getJsonOfKey<DynamoDB.PutItemInputAttributeMap>(
      deploymentContext.examplesBucket,
      widgetKey
    );

  widgetEntity.pk.S = dashboardId;
  widgetEntity.sk.S = generateDBId(databaseIdPrefixes.widget);

  await awsWrapper.dynamoSave(deploymentContext.tableName, widgetEntity);
};

export default {
  saveChart,
  saveDataset,
  saveText,
  saveDashboard,
  saveTopicArea,
  generateDBId,
};
