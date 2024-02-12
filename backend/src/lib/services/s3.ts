/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import AWSXRay from "aws-xray-sdk";
import {
    DeleteObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
    ServerSideEncryption,
} from "@aws-sdk/client-s3";

class S3Service {
    private readonly client: S3Client;
    private static instance: S3Service;

    private readonly serverSideEncryption = ServerSideEncryption.aws_kms;

    private constructor() {
        AWSXRay.setContextMissingStrategy(() => {});
        this.client = AWSXRay.captureAWSv3Client(new S3Client({}));
    }

    static getInstance() {
        if (!S3Service.instance) {
            S3Service.instance = new S3Service();
        }
        return S3Service.instance;
    }

    async putObject(bucketName: string, jsonS3Key: string, jsonFile: string) {
        const command = new PutObjectCommand({
            Key: jsonS3Key,
            Body: jsonFile,
            Bucket: bucketName,
            ServerSideEncryption: this.serverSideEncryption,
            ContentType: "application/json",
        });
        return await this.client.send(command);
    }

    async objectExists(bucketName: string, key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: bucketName,
                Key: key,
            });
            await this.client.send(command);
            return true;
        } catch (err) {
            return false;
        }
    }

    async deleteObject(bucketName: string, jsonS3Key: string) {
        const command = new DeleteObjectCommand({
            Key: jsonS3Key,
            Bucket: bucketName,
        });
        return await this.client.send(command);
    }
}

export default S3Service;
