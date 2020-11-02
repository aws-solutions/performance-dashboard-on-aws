import S3Service from "../services/s3";
import { Dataset } from "../models/dataset";
import DatasetFactory from "../factories/dataset-factory";
import BaseRepository from "./base";

class DatasetRepository extends BaseRepository {
  private s3Service: S3Service;
  private bucketName: string;
  private s3Prefix: string;
  private static instance: DatasetRepository;

  private constructor() {
    super();

    if (!process.env.DATASETS_BUCKET) {
      throw new Error("Environment variable DATASETS_BUCKET not found");
    }

    this.s3Service = S3Service.getInstance();
    this.bucketName = process.env.DATASETS_BUCKET;
    this.s3Prefix = "public/";
  }

  static getInstance(): DatasetRepository {
    if (!DatasetRepository.instance) {
      DatasetRepository.instance = new DatasetRepository();
    }
    return DatasetRepository.instance;
  }

  public async saveDataset(dataset: Dataset) {
    const { raw, json } = dataset.s3Key;

    // Avoid creating datasets for which there aren't corresponding files on S3.
    const rawKey = this.s3Prefix.concat(raw);
    let fileExists = await this.s3Service.objectExists(this.bucketName, rawKey);
    if (!fileExists) {
      console.error("Raw file not found for dataset=", dataset);
      throw new Error("Raw file for dataset not found on S3");
    }

    const jsonKey = this.s3Prefix.concat(json);
    fileExists = await this.s3Service.objectExists(this.bucketName, jsonKey);
    if (!fileExists) {
      console.error("JSON file not found for dataset=", dataset);
      throw new Error("JSON file for dataset not found on S3");
    }

    return this.dynamodb.put({
      TableName: this.tableName,
      Item: DatasetFactory.toItem(dataset),
    });
  }
}

export default DatasetRepository;
