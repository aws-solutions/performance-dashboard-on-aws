export enum SourceType {
  IngestApi = "IngestApi",
  FileUpload = "FileUpload",
}

export interface Dataset {
  id: string;
  createdBy: string;
  fileName: string;
  s3Key: {
    raw: string;
    json: string;
  };
  sourceType: SourceType;
}

export type DatasetContent = Array<object>;
export type DatasetList = Array<Dataset>;

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
  sourceType: string;
}
