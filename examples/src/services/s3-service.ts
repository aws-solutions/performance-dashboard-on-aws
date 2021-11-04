import { env } from "../env";
import { S3 } from "aws-sdk";
import { DashboardSnapshot } from "../common";
import {
  readSnapshot as readSnapshotFromResources,
  writeResource,
} from "./fs-service";

const fs = require("fs-extra");

export const downloadResource = async function (name: string, file: string) {
  const s3 = new S3();
  let readStream = s3
    .getObject({
      Bucket: env.DATASETS_BUCKET,
      Key: `public/${file}`,
    })
    .createReadStream();

  return writeResource(name, file, readStream);
};

export const copyResource = function (
  name: string,
  source: string,
  destination: string
): Promise<S3.CopyObjectOutput> {
  const s3Client = new S3();
  const sourceFile = `${name}/files/${source}`;
  const destinationFile = `public/${destination}`;
  return new Promise((resolve, reject) => {
    console.log(
      "s3.copyContent call: {}/{} -> {}/{}",
      env.EXAMPLES_BUCKET,
      sourceFile,
      env.DATASETS_BUCKET,
      destinationFile
    );
    s3Client.copyObject(
      {
        Bucket: env.DATASETS_BUCKET,
        Key: destinationFile,
        CopySource: `${env.EXAMPLES_BUCKET}/${sourceFile}`,
      },
      function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("resource copied");
          resolve(data);
        }
      }
    );
  });
};

export const readSnapshot = async function (
  name: string
): Promise<DashboardSnapshot> {
  const s3 = new S3();
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: env.EXAMPLES_BUCKET,
        Key: `${name}/snapshot.json`,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          console.log(`reading from local resources`);

          try {
            const snapshot = readSnapshotFromResources(name);
            resolve(snapshot);
          } catch (e) {
            reject(err);
          }
        }

        const text = data.Body?.toString();
        if (!text) {
          reject("No data");
        }

        resolve(JSON.parse(text as string));
      }
    );
  });
};
