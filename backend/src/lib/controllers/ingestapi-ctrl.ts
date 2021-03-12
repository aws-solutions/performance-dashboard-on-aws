import { Request, Response } from "express";
import { DatasetContent, SourceType, DatasetSchema } from "../models/dataset";
import DatasetRepository from "../repositories/dataset-repo";
import DatasetService from "../services/dataset-service";
import DatasetFactory from "../factories/dataset-factory";
import pino from "../services/logger";

// Add an identifier so that any log from the ingest API is easy
// to find in CloudWatch logs.
const logger = pino.child({
  api: "ingestapi",
});

async function createDataset(req: Request, res: Response) {
  const { metadata, data } = req.body;

  if (!metadata.name) {
    return res.status(400).send("Missing required field `metadata.name`");
  }

  if (!data) {
    return res.status(400).send("Missing required field `data`");
  }

  if (
    metadata.schema &&
    !Object.values(DatasetSchema).includes(metadata.schema)
  ) {
    return res.status(400).send(`Unknown schema provided '${metadata.schema}'`);
  }

  const repo = DatasetRepository.getInstance();
  let parsedData: DatasetContent;

  try {
    parsedData = DatasetService.parse(data, metadata.schema);
  } catch (err) {
    logger.warn("Unable to parse dataset %o", data);
    return res.status(400).send(err.message);
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
    console.log(err);
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
