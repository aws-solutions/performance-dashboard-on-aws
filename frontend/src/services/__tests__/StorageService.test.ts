/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Storage } from "@aws-amplify/storage";
import * as uuid from "uuid";
import StorageService from "../StorageService";

jest.mock("@aws-amplify/storage");
jest.mock("uuid");

const imageFile = {
  type: "image/png",
  name: "myphoto.png",
  size: 100,
} as File;

const jsonFile = "[1, 2, 3]";
const rawFile = {
  type: "text/csv",
  name: "dataset.csv",
  size: 100,
} as File;

describe("uploadImage", () => {
  beforeEach(() => {
    jest.spyOn(uuid, "v4").mockReturnValue("abc");
  });

  test("throws an error for an invalid image type", () => {
    return expect(StorageService.uploadImage(rawFile)).rejects.toEqual(
      Error("File type is not supported")
    );
  });

  test("uploads image file", async () => {
    await StorageService.uploadImage(imageFile);
    expect(Storage.put).toBeCalledWith("abc.png", imageFile, {
      level: "public",
      contentType: "image/png",
      contentDisposition: 'attachment; filename="myphoto.png"',
      serverSideEncryption: "aws:kms",
      metadata: { fileName: "myphoto.png" },
    });
  });

  test("returns the s3Key for the image file", async () => {
    const response = await StorageService.uploadImage(imageFile);
    expect(response).toEqual("abc.png");
  });
});

describe("uploadDataset", () => {
  beforeEach(() => {
    jest.spyOn(uuid, "v4").mockReturnValue("abc");
  });

  test("throws an error for invalid file type", () => {
    return expect(
      StorageService.uploadDataset(imageFile, jsonFile, (s: string) => {
        return "Raw file is not an accepted format";
      })
    ).rejects.toEqual(Error("Raw file is not an accepted format"));
  });

  test("uploads raw file", async () => {
    await StorageService.uploadDataset(rawFile, jsonFile, () => {});
    expect(Storage.put).toBeCalledWith("abc.csv", rawFile, {
      level: "public",
      contentType: "text/csv",
      contentDisposition: 'attachment; filename="dataset.csv"',
      serverSideEncryption: "aws:kms",
      metadata: { fileName: "dataset.csv" },
    });
  });

  test("uploads json file", async () => {
    await StorageService.uploadDataset(rawFile, jsonFile, () => {});
    expect(Storage.put).toBeCalledWith("abc.json", jsonFile, {
      level: "public",
      contentType: "application/json",
      serverSideEncryption: "aws:kms",
    });
  });

  test("returns the s3Key for the raw and the json files", async () => {
    const response = await StorageService.uploadDataset(
      rawFile,
      jsonFile,
      () => {}
    );
    expect(response.s3Keys.raw).toEqual("abc.csv");
    expect(response.s3Keys.json).toEqual("abc.json");
  });
});

describe("downloadDataset", () => {
  test("download file", async () => {
    try {
      await StorageService.downloadFile("123.csv", () => {});
    } catch (error) {
      expect(Storage.get).toBeCalledWith("123.csv", {
        download: true,
        level: "public",
      });
    }
  });
});

describe("downloadJson", () => {
  test("downloads a JSON file from S3", async () => {
    await StorageService.downloadJson("123.json");
    expect(Storage.get).toBeCalledWith("123.json", {
      download: true,
      level: "public",
    });
  });

  test("returns the parsed file as a JSON array", async () => {
    const blob = new Blob(["[1, 2, 3]"]);
    Storage.get = jest.fn().mockReturnValue({ Body: blob });

    const json = await StorageService.downloadJson("123.json");
    expect(json).toEqual([1, 2, 3]);
  });

  test("returns an empty array when file not found", async () => {
    Storage.get = jest.fn().mockReturnValue({ Body: null });
    const json = await StorageService.downloadJson("123.json");
    expect(json).toEqual([]);
  });

  test("returns an empty array when invalid JSON", async () => {
    const blob = new Blob(["this is invalid json"]);
    Storage.get = jest.fn().mockReturnValue({ Body: blob });
    const json = await StorageService.downloadJson("123.json");
    expect(json).toEqual([]);
  });
});

describe("download logo", () => {
  test("downloads a image file from S3", async () => {
    Storage.get = jest.fn().mockReturnValue({
      Body: "body",
    });
    await StorageService.downloadLogo("123.json", () => {});
    expect(Storage.get).toBeCalledWith("logo/123.json", {
      download: true,
      level: "public",
    });
  });
});
