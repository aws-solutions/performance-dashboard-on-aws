/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { InvalidDatasetContent } from "../errors";
import { DatasetContent, DatasetSchema } from "../models/dataset";
import { User } from "../models/user";
import { Validator, ValidatorResult } from "jsonschema";
import DashboardRepository from "../repositories/dashboard-repo";
import WidgetRepository from "../repositories/widget-repo";
import DatasetRepository from "../repositories/dataset-repo";
import pino from "../services/logger";

import MetricsSchema from "../jsonschema/datasets/metrics.json";
import NoneSchema from "../jsonschema/datasets/none.json";

const logger = pino.child({
  api: "ingestapi",
});

function parse(
  dataset: any,
  schema: DatasetSchema = DatasetSchema.None
): DatasetContent {
  const schemaValidator = new Validator();
  let result: ValidatorResult;

  switch (schema) {
    case DatasetSchema.Metrics:
      logger.info("Validating dataset against Metrics schema %o", dataset);
      result = schemaValidator.validate(dataset, MetricsSchema);
      break;
    case DatasetSchema.None:
    default:
      logger.info("Validating dataset against None schema %o", dataset);
      result = schemaValidator.validate(dataset, NoneSchema);
      break;
  }

  if (!result.valid) {
    logger.error(
      "Dataset does not conform to schema %s, %s, %s",
      schema,
      JSON.stringify(dataset),
      result.toString()
    );
    throw new InvalidDatasetContent(result.toString());
  }

  return dataset;
}

async function updateDataset(
  datasetId: string,
  newMetadata: any,
  newContent: DatasetContent
) {
  // First, update the dataset in DynamoDB and S3
  const repo = DatasetRepository.getInstance();
  await repo.updateDataset(datasetId, newMetadata, newContent);

  // Fetch all widgets associated to this dataset
  const widgetRepo = WidgetRepository.getInstance();
  const associatedWidgets = await widgetRepo.getAssociatedWidgets(datasetId);

  // Get the dashboards associated to these widgets and update
  // their `updateAt` value to reflect that their datasets have been updated.
  const dashboards = associatedWidgets.map((widget) => widget.dashboardId);
  const uniqueDashboards = new Set(dashboards);
  const dashboardRepo = DashboardRepository.getInstance();

  // Instantiate a system user who will update the dashboards.
  const updatedBy: User = { userId: "ingestapi" };

  for await (const dashboardId of uniqueDashboards) {
    await dashboardRepo.updateAt(dashboardId, updatedBy);
  }
}

export default {
  parse,
  updateDataset,
};
