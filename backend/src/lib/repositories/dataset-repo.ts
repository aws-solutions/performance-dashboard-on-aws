import DynamoDBService from "../services/dynamodb";
import S3Service from "../services/s3";
import { Dataset } from "../models/dataset";
import DatasetFactory from "../factories/dataset-factory";

class DatasetRepository {
  private dynamodb: DynamoDBService;
  private s3Service: S3Service;
  private tableName: string;
  private bucketName: string;
  private static instance: DatasetRepository;

  private constructor() {
    if (!process.env.BADGER_TABLE) {
      throw new Error("Environment variable BADGER_TABLE not found");
    }

    if (!process.env.BADGER_DATASETS_BUCKET) {
      throw new Error("Environment variable BADGER_DATASETS_BUCKET not found");
    }

    this.dynamodb = DynamoDBService.getInstance();
    this.s3Service = S3Service.getInstance();
    this.tableName = process.env.BADGER_TABLE;
    this.bucketName = process.env.BADGER_DATASETS_BUCKET;
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
    let fileExists = await this.s3Service.objectExists(this.bucketName, raw);
    if (!fileExists) {
      console.error("Raw file not found for dataset=", dataset);
      throw new Error("Raw file for dataset not found on S3");
    }

    fileExists = await this.s3Service.objectExists(this.bucketName, json);
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
