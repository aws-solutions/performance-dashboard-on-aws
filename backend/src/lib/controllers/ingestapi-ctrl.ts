import { Request, Response } from "express";
import DatasetRepository from "../repositories/dataset-repo";

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

  try {
    const repo = DatasetRepository.getInstance();
    const dataset = await repo.createDataset(metadata, data);
    res.json(dataset);
  } catch (err) {
    console.error(err);
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

  try {
    const repo = DatasetRepository.getInstance();
    await repo.updateDataset(id, metadata, data);
    res.json();
  } catch (err) {
    console.error(err);
    res.status(400).send("Unable to update dataset");
  }
}

async function deleteDataset(req: Request, res: Response) {
  const { id } = req.params;

  const repo = DatasetRepository.getInstance();
  await repo.deleteDataset(id);
  return res.send();
}

export default {
  createDataset,
  updateDataset,
  deleteDataset,
};
