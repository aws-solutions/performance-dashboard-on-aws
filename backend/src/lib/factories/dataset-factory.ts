import { v4 as uuidv4 } from "uuid";
import { Dataset, DatasetItem } from "../models/dataset";

const DATASET_ITEM_TYPE = "Dataset";

type DatasetInfo = {
  fileName: string;
  createdBy: string;
  s3Key: {
    raw: string;
    json: string;
  };
};

function createNew(info: DatasetInfo): Dataset {
  return {
    id: uuidv4(),
    fileName: info.fileName,
    createdBy: info.createdBy,
    s3Key: {
      raw: info.s3Key.raw,
      json: info.s3Key.json,
    },
  };
}

function toItem(dataset: Dataset): DatasetItem {
  return {
    pk: `${DATASET_ITEM_TYPE}#${dataset.id}`,
    sk: `${DATASET_ITEM_TYPE}#${dataset.id}`,
    type: DATASET_ITEM_TYPE,
    createdBy: dataset.createdBy,
    fileName: dataset.fileName,
    s3Key: dataset.s3Key,
  };
}

export default {
  createNew,
  toItem,
};
