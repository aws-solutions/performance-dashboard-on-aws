import Storage from "@aws-amplify/storage";
import { v4 as uuidv4 } from "uuid";
import EnvConfig from "../services/EnvConfig";

type ValidFileTypes = {
  [key: string]: string;
};

/**
 * Access Level `public` does not mean the S3 bucket is publicly accessible.
 * It just means that all valid and authenticated users will have
 * access to the uploaded datasets regardless of who uploaded it originally.
 *
 * Docs: https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js
 */
const accessLevel = "public";
const serverSideEncryption = "aws:kms";

const imageFileTypes: ValidFileTypes = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/svg": ".svg",
  "image/svg+xml": ".svg",
};

async function downloadFile(s3Key: string): Promise<File> {
  const data: any = await Storage.get(s3Key, {
    bucket: EnvConfig.contentBucket,
    download: true,
    level: accessLevel,
    serverSideEncryption,
  });
  if (!data || !data.Body) {
    throw new Error(
      "The query using the provided S3 key, returned no results."
    );
  }
  return data.Body as File;
}

async function uploadFile(rawFile: File, fileS3Key: string) {
  console.log(EnvConfig.contentBucket);
  await Storage.put(fileS3Key, rawFile, {
    bucket: EnvConfig.contentBucket,
    level: accessLevel,
    contentDisposition: `attachment; filename="${rawFile.name}"`,
    contentType: rawFile.type,
    serverSideEncryption,
  });
}

async function uploadImage(rawFile: File): Promise<string> {
  const mimeType = rawFile.type;
  const extension = imageFileTypes[mimeType as keyof ValidFileTypes];

  if (!extension) {
    throw new Error("File type is not supported");
  }

  const fileS3Key = uuidv4().concat(extension);
  await uploadFile(rawFile, fileS3Key);

  return fileS3Key;
}

const StorageService = {
  downloadFile,
  uploadImage,
  imageFileTypes,
};

export default StorageService;
