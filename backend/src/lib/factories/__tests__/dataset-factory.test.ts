import { DatasetItem, SourceType } from "../../models/dataset";
import * as uuid from "uuid";
import DatasetFactory from "../dataset-factory";

jest.mock("uuid");
jest.spyOn(uuid, "v4").mockReturnValue("123");

it("creates a new dataset object", () => {
  const now = new Date();
  jest.useFakeTimers("modern");
  jest.setSystemTime(now);
  const dataset = DatasetFactory.createNew({
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
    sourceType: SourceType.FileUpload,
  });

  expect(dataset).toEqual({
    id: "123",
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
    updatedAt: now,
    sourceType: SourceType.FileUpload,
  });
});

it("converts a dataset into a dynamodb item", () => {
  const now = new Date();
  jest.useFakeTimers("modern");
  jest.setSystemTime(now);
  const dataset = DatasetFactory.createNew({
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
    sourceType: SourceType.FileUpload,
  });

  const item = DatasetFactory.toItem(dataset);
  expect(item).toEqual({
    pk: "Dataset#123",
    sk: "Dataset#123",
    type: "Dataset",
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
    updatedAt: now.toISOString(),
    sourceType: SourceType.FileUpload,
  });
});

it("converts a dynamo item into a dataset", () => {
  const now = new Date();
  jest.useFakeTimers("modern");
  jest.setSystemTime(now);
  const item: DatasetItem = {
    pk: "Dataset#123",
    sk: "Dataset#123",
    type: "Dataset",
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
    updatedAt: now.toISOString(),
    sourceType: SourceType.IngestApi,
  };

  const dataset = DatasetFactory.fromItem(item);
  expect(dataset).toEqual({
    id: "123",
    fileName: "covid.csv",
    createdBy: "johndoe",
    s3Key: {
      raw: "abc.csv",
      json: "abc.json",
    },
    updatedAt: now,
    sourceType: SourceType.IngestApi,
  });
});
