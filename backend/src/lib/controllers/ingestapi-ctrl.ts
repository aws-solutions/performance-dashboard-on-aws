/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { DatasetContent, SourceType, DatasetSchema } from "../models/dataset";
import DatasetRepository from "../repositories/dataset-repo";
import DatasetService from "../services/dataset-service";
import DatasetFactory from "../factories/dataset-factory";
import pino from "../services/logger";
import { CurrencyDataType, NumberDataType } from "../models/widget";
const escapeHtml = require("escape-html");

// Add an identifier so that any log from the ingest API is easy
// to find in CloudWatch logs.
const logger = pino.child({
  api: "ingestapi",
});

/**
 * Validates the metrics schema.
 * @param data any
 * @returns string error message
 */
function validateMetricsSchema(data: any): string | null {
  for (let datum in data) {
    //symbol should be valid input or empty
    if (
      !["", NumberDataType.Percentage, NumberDataType.Currency].includes(
        data[datum].percentage
      )
    ) {
      return "Invalid symbol type. Choose either `Currency`, `Percentage` or ``";
    }
    //currency should be valid input or empty
    if (
      ![
        "",
        CurrencyDataType["Dollar $"],
        CurrencyDataType["Euro €"],
        CurrencyDataType["Pound £"],
      ].includes(data[datum].currency)
    ) {
      return "Invalid symbol type. Choose either ``, `Dollar $`, `Euro €` or `Pound £`";
    }

    //if symbol is currency, then a currency should be indicated
    if (
      data[datum].percentage === NumberDataType.Currency &&
      data[datum].currency === ""
    ) {
      return "Missing optional field `currency`";
    }
    //if currencies are indicated, then symbol should be currency
    if (
      data[datum].percentage !== NumberDataType.Currency &&
      (data[datum].currency === CurrencyDataType["Dollar $"] ||
        data[datum].currency === CurrencyDataType["Euro €"] ||
        data[datum].currency === CurrencyDataType["Pound £"])
    ) {
      return "Can only input currency type along with `Currency`";
    }
  }
  return null;
}

async function createDataset(req: Request, res: Response) {
  const { metadata, data } = req.body;
  if (!metadata.name) {
    return res.status(400).send("Missing required field `metadata.name`");
  }

  if (!data) {
    return res.status(400).send("Missing required field `data`");
  }

  if (metadata.schema === "Metrics") {
    const errorMessage = validateMetricsSchema(data);
    if (errorMessage) {
      return res.status(400).send(errorMessage);
    }
  }

  if (
    metadata.schema &&
    !Object.values(DatasetSchema).includes(metadata.schema)
  ) {
    return res
      .status(400)
      .send(`Unknown schema provided '${escapeHtml(metadata.schema)}'`);
  }

  const repo = DatasetRepository.getInstance();
  let parsedData: DatasetContent;

  try {
    parsedData = DatasetService.parse(data, metadata.schema);
  } catch (err) {
    logger.warn("Unable to parse dataset %o", data);
    return res
      .status(400)
      .send(`Unable to parse dataset: ${escapeHtml(err.message)}`.trim());
  }

  try {
    const s3Key = await repo.uploadDatasetContent(parsedData);
    const dataset = DatasetFactory.createNew({
      fileName: metadata.name,
      createdBy: "ingestapi",
      s3Key: {
        raw: s3Key,
        json: s3Key,
      },
      sourceType: SourceType.IngestApi,
      schema: metadata.schema,
    });

    await repo.saveDataset(dataset);
    res.json(dataset);
  } catch (err) {
    logger.error("Failed to create dataset %o, %o", metadata, parsedData);
    res.status(400).send("Unable to create dataset");
  }
}

async function updateDataset(req: Request, res: Response) {
  const { id } = req.params;
  const { metadata, data } = req.body;
  if (!metadata) {
    return res.status(400).send("Missing required field `metadata`");
  }

  if (!metadata.name) {
    return res.status(400).send("Missing required field `name`");
  }

  if (!data) {
    return res.status(400).send("Missing required field `data`");
  }

  if (metadata.schema === "Metrics") {
    const errorMessage = validateMetricsSchema(data);
    if (errorMessage) {
      return res.status(400).send(errorMessage);
    }
  }

  let parsedData: DatasetContent;

  try {
    parsedData = DatasetService.parse(data);
  } catch (err) {
    logger.warn("Unable to parse dataset %s", data);
    return res.status(400).send("Data is not a valid JSON array");
  }

  try {
    await DatasetService.updateDataset(id, metadata, parsedData);
    res.json();
  } catch (err) {
    logger.error("Failed to update dataset %o, %o", err, metadata, parsedData);
    res.status(400).send("Unable to update dataset");
  }
}

async function deleteDataset(req: Request, res: Response) {
  const { id } = req.params;

  const repo = DatasetRepository.getInstance();
  const widgetCount = await repo.getWidgetCount(id);

  if (widgetCount > 0) {
    return res.status(409).send("Dataset has widgets associated to it");
  }

  await repo.deleteDataset(id);
  logger.info("Dataset deleted %s", id);

  return res.send();
}

export default {
  createDataset,
  updateDataset,
  deleteDataset,
};
