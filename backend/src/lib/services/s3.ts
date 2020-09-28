import AWSXRay from "aws-xray-sdk";
import S3 from "aws-sdk/clients/s3";
import { AWSError } from "aws-sdk/lib/error";

class S3Service {
  private client: S3;
  private static instance: S3Service;

  private constructor() {
    this.client = new S3();
    AWSXRay.setContextMissingStrategy(() => {});
    AWSXRay.captureAWSClient(this.client);
  }

  static getInstance() {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service();
    }
    return S3Service.instance;
  }

  async objectExists(bucketName: string, key: string): Promise<boolean> {
    try {
      await this.client
        .headObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default S3Service;
