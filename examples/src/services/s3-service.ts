import { env } from "../env";
import { S3 } from "aws-sdk";
import { DashboardSnapshot } from "../common";

const fs = require("fs-extra");

export const downloadResource = async function (name: string, file: string) {
  const folder = `${__dirname}/../../resources/${name}`;
  fs.ensureDirSync(folder);

  const s3 = new S3();
  let readStream = s3
    .getObject({
      Bucket: env.DATASETS_BUCKET,
      Key: `public/${file}`,
    })
    .createReadStream();

  let writeStream = fs.createWriteStream(`${folder}/${file}`);
  return new Promise((resolve, reject) =>
    readStream
      .pipe(writeStream)
      .on("finish", resolve)
      .on("error", reject)
      .on("close", () => {
        console.log(`Downloaded ${file}`);
      })
  );
};

function readSnapshotFromResources(name: string) {
  const file = `${__dirname}/../../resources/${name}.json`;
  const text = fs.readFileSync(file, "utf8");
  return JSON.parse(text) as DashboardSnapshot;
}

export const readSnapshot = async function (
  name: string
): Promise<DashboardSnapshot> {
  const s3 = new S3();
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: env.EXAMPLES_BUCKET,
        Key: `${name}.json`,
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
