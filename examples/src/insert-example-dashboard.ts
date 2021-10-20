import awsWrapper from "./aws-wrapper";
import exampleBuilder from "./example-builder";
import storage from "./storage";
import { Config } from "./config";
import { ExampleConfig } from "./example-builder";
import { v4 as uuidv4 } from "uuid";

class DashboardContext {
  public readonly topicAreaId: string;
  public readonly dashboardId: string;
  public readonly exampleBucketKeys: ExampleConfig;

  constructor(
    topicAreaId: string,
    dashboardId: string,
    exampleBucketKeys: ExampleConfig
  ) {
    this.topicAreaId = topicAreaId;
    this.dashboardId = dashboardId;
    this.exampleBucketKeys = exampleBucketKeys;
  }
}

const setupDashboardTopicAreaEntities = async function (
  deploymentContext: Config,
  exampleBucketKeys: ExampleConfig
) {
  console.log("Saving TopicArea...");
  const topicAreaId = await storage.saveTopicArea(
    deploymentContext,
    exampleBucketKeys.topicAreaS3Key
  );

  console.log("Saving Dashboard...");
  const dashboardId = await storage.saveDashboard(
    deploymentContext,
    topicAreaId,
    exampleBucketKeys.dashboardS3Key
  );

  return new DashboardContext(topicAreaId, dashboardId, exampleBucketKeys);
};

const copyContentToBucket = async function (
  examplesbucket: string,
  exampleFile: string,
  datasetBucket: string,
  dataFileUUID: string,
  fileExtention: string
) {
  await awsWrapper.copyContent(
    examplesbucket,
    exampleFile,
    datasetBucket,
    `public/${dataFileUUID}.${fileExtention}`
  );
};

const setupExample = async function (
  deploymentContext: Config,
  exampleBucketKeys: ExampleConfig
) {
  const dashboardContext = await setupDashboardTopicAreaEntities(
    deploymentContext,
    exampleBucketKeys
  );

  for (
    let i = 0,
      widgetLength = dashboardContext.exampleBucketKeys.widgets.length,
      widget = null;
    i < widgetLength &&
    (widget = dashboardContext.exampleBucketKeys.widgets[i]);
    i++
  ) {
    console.log(`Setting up Widget: ${widget.name}`);
    if (widget.name.startsWith("text")) {
      console.log(`Saving text for Widget: ${widget.name}`);
      await storage.saveText(
        deploymentContext,
        dashboardContext.dashboardId,
        widget.s3Key
      );
    } else {
      let datasetUUID = uuidv4();
      let dataFileUUID = uuidv4();

      console.log(`Saving chart for Widget: ${widget.name}`);
      await storage.saveChart(
        deploymentContext,
        dashboardContext.dashboardId,
        datasetUUID,
        dataFileUUID,
        widget.s3Key
      );
      console.log(`Saving dataset for Widget: ${widget.name}`);
      await storage.saveDataset(
        deploymentContext,
        datasetUUID,
        dataFileUUID,
        widget.datasetS3Key
      );

      let jsonDatasetKey = widget.datafileS3Keys[0].endsWith(".json")
        ? widget.datafileS3Keys[0]
        : widget.datafileS3Keys[1];
      let csvDatasetKey = widget.datafileS3Keys[0].endsWith(".csv")
        ? widget.datafileS3Keys[0]
        : widget.datafileS3Keys[1];

      console.log(`Copying datafiles for Widget: ${widget.name}`);
      await copyContentToBucket(
        deploymentContext.examplesBucket,
        jsonDatasetKey,
        deploymentContext.datasetsBucket,
        dataFileUUID,
        "json"
      );
      await copyContentToBucket(
        deploymentContext.examplesBucket,
        csvDatasetKey,
        deploymentContext.datasetsBucket,
        dataFileUUID,
        "csv"
      );
    }
  }
};

export const setupDashboards = async function (config: Config) {
  const prefix = config.language + "/";
  console.log("Getting contents of examples bucket...");
  const examplesBucketContent = await awsWrapper.getBucketContents(
    config.examplesBucket,
    prefix
  );

  console.log("Building examples to setup...");
  const exampleBucketKeys = exampleBuilder.buildExamplesFromContents(
    examplesBucketContent,
    prefix
  );

  for (const exampleBucketKey of exampleBucketKeys.entries()) {
    console.log(`Setting up ${exampleBucketKey[1].example}`);
    await setupExample(config, exampleBucketKey[1]);
  }
};
