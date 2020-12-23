import { Request, Response } from "express";
import { DatasetContent } from "../models/dataset";
import DatasetRepository from "../repositories/dataset-repo";
import DatasetParser from "../services/dataset-parser";
import pino from "../services/logger";

// Add an identifier so that any log from the ingest API is easy
// to find in CloudWatch logs.
const logger = pino.child({
  api: "ingestapi",
});

async function createDataset(req: Request, res: Response) {
  const { metadata, data } = req.body;

  if (!metadata) {
    return res.status(400).send("Missing required field `metadata`");
  }

  if (!metadata.name) {
    return res.status(400).send("Missing required field `name`");
  }

  if (!metadata.createdBy) {
    return res.status(400).send("Missing required field `createdBy`");
  }

  if (!data) {
    return res.status(400).send("Missing required field `data`");
  }

  let parsedData: DatasetContent;

  try {
    parsedData = DatasetParser.parse(data);
  } catch (err) {
    logger.warn("Unable to parse dataset %s", data);
    return res.status(400).send("Data is not a valid JSON array");
  }

  try {
    const repo = DatasetRepository.getInstance();
    const dataset = await repo.createDataset(metadata, parsedData);
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

  let parsedData: DatasetContent;

  try {
    parsedData = DatasetParser.parse(data);
  } catch (err) {
    logger.warn("Unable to parse dataset %s", data);
    return res.status(400).send("Data is not a valid JSON array");
  }

  try {
    const repo = DatasetRepository.getInstance();
    await repo.updateDataset(id, metadata, parsedData);
    res.json();
  } catch (err) {
    logger.error("Failed to update dataset %o, %o", metadata, parsedData);
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
