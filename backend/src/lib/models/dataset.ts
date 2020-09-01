export interface Dataset {
  id: string;
  createdBy: string;
  fileName: string;
  s3Key: {
    raw: string;
    json: string;
  };
}

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
}
