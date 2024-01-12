/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { env } from "../env";
import {
    CopyObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { DashboardSnapshot } from "../common";
import {
    readResource,
    readSnapshot as readSnapshotFromResources,
    writeResource,
} from "./fs-service";
import { Readable } from "stream";

const client = new S3Client({});

export const downloadResource = async function (name: string, file: string) {
    const command = new GetObjectCommand({
        Bucket: env.DATASETS_BUCKET,
        Key: `public/${file}`,
    });
    const response = await client.send(command);
    return writeResource(name, file, response.Body as Readable);
};

export const copyResource = async function (name: string, source: string, destination: string) {
    const sourceFile = `${name}/files/${source}`;
    const destinationFile = `public/${destination}`;
    console.log(
        "s3.copyContent call: {}/{} -> {}/{}",
        env.EXAMPLES_BUCKET,
        sourceFile,
        env.DATASETS_BUCKET,
        destinationFile,
    );

    const copyCommand = new CopyObjectCommand({
        Bucket: env.DATASETS_BUCKET,
        Key: destinationFile,
        CopySource: `${env.EXAMPLES_BUCKET}/${sourceFile}`,
    });

    try {
        const copyResponse = await client.send(copyCommand);
        console.log("resource copied: {}", copyResponse);
    } catch (err) {
        console.error(err);
        console.log("uploading from local files");
        const putCommand = new PutObjectCommand({
            Bucket: env.DATASETS_BUCKET,
            Key: destinationFile,
            Body: readResource(name, source),
        });
        const putResponse = await client.send(putCommand);
        console.log("resource uploaded: {}", putResponse);
    }
};

export const readSnapshot = async function (name: string): Promise<DashboardSnapshot> {
    const command = new GetObjectCommand({
        Bucket: env.EXAMPLES_BUCKET,
        Key: `${name}/snapshot.json`,
    });
    try {
        const response = await client.send(command);
        const text = await response.Body?.transformToString();
        if (!text) {
            throw new Error("No data");
        }
        return JSON.parse(text);
    } catch (err) {
        console.log(err);
        console.log(`reading from local resources`);
        return readSnapshotFromResources(name);
    }
};
