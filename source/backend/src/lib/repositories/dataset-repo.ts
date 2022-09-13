import S3Service from "../services/s3";
import {
  Dataset,
  DatasetItem,
  DatasetList,
  DatasetContent,
} from "../models/dataset";
import DatasetFactory from "../factories/dataset-factory";
import BaseRepository from "./base";
import { SourceType } from "../models/dataset";
import { v4 as uuidv4 } from "uuid";
import logger from "../services/logger";
import WidgetRepository from "./widget-repo";

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

  public async listDatasets(): Promise<DatasetList> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: "byType",
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":type": "Dataset",
      },
    });

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) =>
      DatasetFactory.fromItem(item as DatasetItem)
    );
  }

  public async getDatasetById(datasetId: string) {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: {
        pk: DatasetFactory.itemId(datasetId),
        sk: DatasetFactory.itemId(datasetId),
      },
    });
    return DatasetFactory.fromItem(result.Item as DatasetItem);
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

  /**
   * Uploads the JSON content for a dataset to S3.
   * Returns the generated S3 key.
   */
  public async uploadDatasetContent(content: DatasetContent): Promise<string> {
    const jsonS3Key = this.getNewJsonS3Key();
    const jsonKey = this.s3Prefix.concat(jsonS3Key);

    try {
      await this.s3Service.putObject(
        this.bucketName,
        jsonKey,
        JSON.stringify(content)
      );
    } catch (err) {
      logger.error("Failed to save dataset content to S3 %o", content);
      throw err;
    }

    return jsonS3Key;
  }

  public async updateDataset(id: string, metadata: any, data: DatasetContent) {
    const dataset = await this.getDatasetById(id);
    const jsonS3Key = dataset.s3Key.json || this.getNewJsonS3Key();
    const jsonKey = this.s3Prefix.concat(jsonS3Key);

    try {
      await this.s3Service.putObject(
        this.bucketName,
        jsonKey,
        JSON.stringify(data)
      );
    } catch (err) {
      logger.error("Failed to update dataset on S3 %o", data);
      throw err;
    }

    try {
      await this.dynamodb.update({
        TableName: this.tableName,
        Key: {
          pk: DatasetFactory.itemId(id),
          sk: DatasetFactory.itemId(id),
        },
        UpdateExpression:
          "set #fileName = :fileName, #s3Key = :s3Key, #sourceType = :sourceType, #updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":fileName": metadata.name,
          ":s3Key": { raw: "", json: jsonS3Key },
          ":updatedAt": new Date().toISOString(),
          ":sourceType": SourceType.IngestApi,
        },
        ExpressionAttributeNames: {
          "#fileName": "fileName",
          "#s3Key": "s3Key",
          "#updatedAt": "updatedAt",
          "#sourceType": "sourceType",
        },
      });
    } catch (err) {
      logger.error("Failed to update dataset in DynamoDB %o", metadata);
      throw err;
    }
  }

  public async deleteDataset(id: string) {
    const dataset = await this.getDatasetById(id);
    const jsonKey = this.s3Prefix.concat(dataset.s3Key.json);

    try {
      await this.s3Service.deleteObject(this.bucketName, jsonKey);
    } catch (err) {
      logger.error("Failed to delete dataset from S3 %s", jsonKey);
      throw err;
    }

    try {
      await this.dynamodb.delete({
        TableName: this.tableName,
        Key: {
          pk: DatasetFactory.itemId(id),
          sk: DatasetFactory.itemId(id),
        },
      });
    } catch (err) {
      logger.error("Failed to delete dataset from DynamoDB %s", id);
      throw err;
    }
  }

  public async getWidgetCount(datasetId: string) {
    return (
      await WidgetRepository.getInstance().getAssociatedWidgets(datasetId)
    ).length;
  }

  private getNewJsonS3Key() {
    const s3Key = uuidv4();
    const jsonS3Key = s3Key.concat(".json");
    return jsonS3Key;
  }
}

export default DatasetRepository;
