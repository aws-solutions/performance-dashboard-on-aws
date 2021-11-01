import DatasetRepository from "performance-dashboard-backend/src/lib/repositories/dataset-repo";
import {
  Dataset,
  SourceType,
} from "performance-dashboard-backend/src/lib/models/dataset";
import { v4 as uuidv4 } from "uuid";
import { S3 } from "aws-sdk";
import { env } from "../env";
import { DatasetResource } from "../common";

function copyFile(
  sourceBucket: string,
  sourceFile: string,
  destinationBucket: string,
  destinationFile: string
): Promise<S3.CopyObjectOutput> {
  const s3Client = new S3();
  return new Promise((resolve, reject) => {
    console.log(
      "s3.copyContent call: {}/{} -> {}/{}",
      sourceBucket,
      sourceFile,
      destinationBucket,
      destinationFile
    );
    s3Client.copyObject(
      {
        Bucket: destinationBucket,
        Key: destinationFile,
        CopySource: `${sourceBucket}/${sourceFile}`,
      },
      function (err, data) {
        console.log("s3.copyObject completed");
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

export class DatasetBuilder {
  private id: string | undefined = undefined;
  private author: string | undefined = undefined;
  private datasetResource: DatasetResource | undefined = undefined;

  withId(id: string): DatasetBuilder {
    this.id = id;
    return this;
  }

  withAuthor(author: string): DatasetBuilder {
    this.author = author;
    return this;
  }

  withDatasetResource(datasetResource: DatasetResource): DatasetBuilder {
    this.datasetResource = datasetResource;
    return this;
  }

  generateIdIf(flag: boolean): DatasetBuilder {
    if (flag) {
      this.withId(uuidv4());
    }
    return this;
  }

  build(): Dataset {
    if (!this.datasetResource) {
      throw new Error("Dataset resource not set");
    }
    const dataset: Dataset = {
      id: this.id || uuidv4(),
      createdBy: this.author || "system",
      fileName: this.datasetResource.fileName,
      s3Key: this.datasetResource.key,
      updatedAt: new Date(),
      sourceType: SourceType.FileUpload,
      schema: this.datasetResource.schema,
    };
    console.log("building dataset: {}", dataset);
    console.log("> copying raw file: {}", this.datasetResource.key.raw);
    copyFile(
      env.EXAMPLES_BUCKET,
      this.datasetResource.key.raw,
      env.DATASETS_BUCKET,
      `public/${this.datasetResource.key.raw}`
    );
    if (this.datasetResource.key.raw !== this.datasetResource.key.json) {
      console.log("> copying json file: {}", this.datasetResource.key.json);
      copyFile(
        env.EXAMPLES_BUCKET,
        this.datasetResource.key.json,
        env.DATASETS_BUCKET,
        `public/${this.datasetResource.key.json}`
      );
    }
    DatasetRepository.getInstance().saveDataset(dataset);
    console.log("dataset created");
    return dataset;
  }
}
