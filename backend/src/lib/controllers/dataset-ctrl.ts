import { Request, Response } from "express";
import AuthService from "../services/auth";
import DatasetRepository from "../repositories/dataset-repo";
import DatasetFactory from "../factories/dataset-factory";

async function createDataset(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const { fileName, s3Key } = req.body;
  if (!fileName) {
    return res.status(400).send("Missing required field `fileName`");
  }

  if (!s3Key.raw || !s3Key.json) {
    return res.status(400).send("Missing required field `s3Key`");
  }

  try {
    const dataset = DatasetFactory.createNew({
      fileName,
      createdBy: user.userId,
      s3Key,
    });

    const repo = DatasetRepository.getInstance();
    await repo.saveDataset(dataset);
    res.json(dataset);
  } catch (err) {
    console.error(err);
    res.status(400).send("Unable to create dataset");
  }
}

export default {
  createDataset,
};
