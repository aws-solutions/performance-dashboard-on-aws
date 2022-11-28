/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import AWSXRay from "aws-xray-sdk";
import S3 from "aws-sdk/clients/s3";

class S3Service {
  private client: S3;
  private static instance: S3Service;

  private serverSideEncryption = "aws:kms";

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

  async putObject(bucketName: string, jsonS3Key: string, jsonFile: string) {
    const params = {
      Key: jsonS3Key,
      Body: jsonFile,
      Bucket: bucketName,
      ServerSideEncryption: this.serverSideEncryption,
      ContentType: "application/json",
    };
    return this.client.putObject(params).promise();
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

  async deleteObject(bucketName: string, jsonS3Key: string) {
    const params = {
      Key: jsonS3Key,
      Bucket: bucketName,
    };
    return this.client.deleteObject(params).promise();
  }
}

export default S3Service;
