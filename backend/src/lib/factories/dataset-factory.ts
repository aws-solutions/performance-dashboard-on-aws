/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { v4 as uuidv4 } from "uuid";
import { Dataset, DatasetItem, SourceType, DatasetSchema } from "../models/dataset";
import { ItemNotFound } from "../errors";

const DATASET_ITEM_TYPE = "Dataset";

interface DatasetInfo {
    fileName: string;
    createdBy: string;
    s3Key: {
        raw: string;
        json: string;
    };
    sourceType: SourceType;
    schema?: string;
}

function createNew(info: DatasetInfo): Dataset {
    const schema = info.schema ? (info.schema as DatasetSchema) : DatasetSchema.None;

    return {
        id: uuidv4(),
        fileName: info.fileName,
        createdBy: info.createdBy,
        s3Key: {
            raw: info.s3Key.raw,
            json: info.s3Key.json,
        },
        updatedAt: new Date(),
        sourceType: info.sourceType,
        schema,
    };
}

function fromItem(item: DatasetItem): Dataset {
    if (!item) {
        throw new ItemNotFound();
    }
    const id = item.pk.substring(8);
    const dataset: Dataset = {
        id,
        fileName: item.fileName,
        createdBy: item.createdBy,
        s3Key: item.s3Key,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        sourceType: item.sourceType ? (item.sourceType as SourceType) : SourceType.FileUpload,
        schema: item.schema ? (item.schema as DatasetSchema) : DatasetSchema.None,
    };
    return dataset;
}

function toItem(dataset: Dataset): DatasetItem {
    return {
        pk: itemId(dataset.id),
        sk: itemId(dataset.id),
        type: DATASET_ITEM_TYPE,
        createdBy: dataset.createdBy,
        fileName: dataset.fileName,
        s3Key: dataset.s3Key,
        updatedAt: dataset.updatedAt ? dataset.updatedAt.toISOString() : new Date().toISOString(),
        sourceType: dataset.sourceType,
        schema: dataset.schema,
    };
}

function itemId(id: string): string {
    return `${DATASET_ITEM_TYPE}#${id}`;
}

export default {
    createNew,
    fromItem,
    toItem,
    itemId,
};
