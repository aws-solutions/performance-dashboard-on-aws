import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import DatasetCtrl from "../dataset-ctrl";
import DatasetRepository from "../../repositories/dataset-repo";

jest.mock("../../services/auth");
jest.mock("../../repositories/dataset-repo");

const user: User = { userId: "johndoe" };
const repository = mocked(DatasetRepository.prototype);
const res = ({
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any) as Response;

beforeEach(() => {
  DatasetRepository.getInstance = jest.fn().mockReturnValue(repository);
});

describe("createDataset", () => {
  let req: Request;
  beforeEach(() => {
    req = ({
      user,
      body: {
        fileName: "covid-dataset.csv",
        s3Key: {
          raw: "123.csv",
          json: "123.json",
        },
      },
    } as any) as Request;
  });

  it("returns a 400 error when fileName is missing", async () => {
    delete req.body.fileName;
    await DatasetCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `fileName`");
  });

  it("returns a 400 error when s3Key.raw is missing", async () => {
    delete req.body.s3Key.raw;
    await DatasetCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `s3Key`");
  });

  it("returns a 400 error when s3Key.json is missing", async () => {
    delete req.body.s3Key.json;
    await DatasetCtrl.createDataset(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required field `s3Key`");
  });

  it("saves the dataset", async () => {
    await DatasetCtrl.createDataset(req, res);
    expect(repository.saveDataset).toBeCalled();
  });
});
