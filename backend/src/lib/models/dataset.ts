/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

export enum SourceType {
    IngestApi = "IngestApi",
    FileUpload = "FileUpload",
}

export enum DatasetSchema {
    None = "None",
    Metrics = "Metrics",
}

export interface Dataset {
    id: string;
    createdBy: string;
    fileName: string;
    s3Key: {
        raw: string;
        json: string;
    };
    updatedAt: Date;
    sourceType: SourceType;
    schema?: DatasetSchema;
}

export type DatasetContent = object[];
export type DatasetList = Dataset[];

export interface DatasetItem {
    pk: string;
    sk: string;
    type: string;
    createdBy: string;
    fileName: string;
    s3Key: {
        raw: string;
        json: string;
    };
    updatedAt: string;
    sourceType: string;
    schema?: string;
}
