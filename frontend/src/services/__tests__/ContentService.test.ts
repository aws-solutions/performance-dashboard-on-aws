import Storage from "@aws-amplify/storage";
import * as uuid from "uuid";
import ContentService from "../ContentService";

jest.mock("@aws-amplify/storage");
jest.mock("uuid");

const imageFile = {
  type: "image/png",
  name: "myphoto.png",
  size: 100,
} as File;

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
    return expect(ContentService.uploadLogo(rawFile)).rejects.toEqual(
      Error("File type is not supported")
    );
  });

  test("uploads image file", async () => {
    await ContentService.uploadLogo(imageFile);
    expect(Storage.put).toBeCalledWith("logo/abc.png", imageFile, {
      level: "public",
      contentType: "image/png",
      contentDisposition: 'attachment; filename="myphoto.png"',
      serverSideEncryption: "aws:kms",
    });
  });

  test("returns the s3Key for the image file", async () => {
    const response = await ContentService.uploadLogo(imageFile);
    expect(response).toEqual("abc.png");
  });
});

describe("download logo", () => {
  test("downloads a image file from S3", async () => {
    Storage.get = jest.fn().mockReturnValue({
      Body: "body",
    });
    await ContentService.downloadLogo("123.json");
    expect(Storage.get).toBeCalledWith("logo/123.json", {
      download: true,
      level: "public",
      serverSideEncryption: "aws:kms",
    });
  });
});
