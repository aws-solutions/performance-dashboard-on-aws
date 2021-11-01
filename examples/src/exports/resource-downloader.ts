import { S3 } from "aws-sdk";
import { env } from "../env";
const fs = require("fs-extra");

export const downloadResource = async function (name: string, file: string) {
  const s3 = new S3();
  let readStream = s3
    .getObject({
      Bucket: env.DATASETS_BUCKET,
      Key: `public/${file}`,
    })
    .createReadStream();

  let writeStream = fs.createWriteStream(
    `${__dirname}/../../../resources/${file}`
  );
  readStream.pipe(writeStream).on("close", () => {
    console.log(`Downloaded ${file}`);
  });
  return new Promise((resolve, reject) =>
    readStream.on("end", resolve).on("error", reject)
  );
};
