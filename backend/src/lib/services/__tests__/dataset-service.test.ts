/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { mocked } from "ts-jest/utils";
import { InvalidDatasetContent } from "../../errors";
import DatasetService from "../dataset-service";
import DashboardRepository from "../../repositories/dashboard-repo";
import WidgetRepository from "../../repositories/widget-repo";
import DatasetRepository from "../../repositories/dataset-repo";

jest.mock("../../repositories/dashboard-repo");
jest.mock("../../repositories/widget-repo");
jest.mock("../../repositories/dataset-repo");

let widgetRepo = mocked(WidgetRepository.prototype);
let datasetRepo = mocked(DatasetRepository.prototype);
let dashboardRepo = mocked(DashboardRepository.prototype);

beforeEach(() => {
  WidgetRepository.getInstance = jest.fn().mockReturnValue(widgetRepo);
  DatasetRepository.getInstance = jest.fn().mockReturnValue(datasetRepo);
  DashboardRepository.getInstance = jest.fn().mockReturnValue(dashboardRepo);
});

describe("parse", () => {
  test("should return the parsed data with a valid JSON array", () => {
    const data = [{ year: 2012, amount: 100 }];
    const dataset = DatasetService.parse(data);
    expect(dataset).toEqual(data);
  });

  test("should throw an error when data is an array of strings", () => {
    expect(() => {
      DatasetService.parse(["an array", "of strings", "is not valid"]);
    }).toThrow(InvalidDatasetContent);
  });

  test("should throw an error when data is an array of numbers", () => {
    expect(() => {
      DatasetService.parse([1, 2, 3]);
    }).toThrow(InvalidDatasetContent);
  });

  test("should throw an error when input is a boolean", () => {
    expect(() => {
      DatasetService.parse(true);
    }).toThrow(InvalidDatasetContent);
  });

  test("should throw an error when input is a number", () => {
    expect(() => {
      DatasetService.parse(100);
    }).toThrow(InvalidDatasetContent);
  });

  test("should throw an error when input is an object", () => {
    expect(() => {
      DatasetService.parse({ foo: "bar" });
    }).toThrow(InvalidDatasetContent);
  });
});

describe("updateDataset", () => {
  const newMetadata = { name: "foobar" };
  const newDatasetContent = [{ foo: "bar" }];
  beforeEach(() => {
    widgetRepo.getAssociatedWidgets = jest.fn().mockReturnValue([]);
  });

  test("should update the dataset in dynamodb and S3", async () => {
    await DatasetService.updateDataset("001", newMetadata, newDatasetContent);
    expect(datasetRepo.updateDataset).toBeCalledWith(
      "001",
      newMetadata,
      newDatasetContent
    );
  });

  test("should fetch all the widgets associated to the dataset", async () => {
    await DatasetService.updateDataset("001", newMetadata, newDatasetContent);
    expect(widgetRepo.getAssociatedWidgets).toBeCalledWith("001");
  });

  test("should update all dashboards related to the widgets", async () => {
    const widgets: any = [{ id: "Widget123", dashboardId: "DashboardXYZ" }];
    widgetRepo.getAssociatedWidgets = jest.fn().mockReturnValue(widgets);

    await DatasetService.updateDataset("001", newMetadata, newDatasetContent);
    expect(dashboardRepo.updateAt).toBeCalledWith(
      "DashboardXYZ",
      expect.objectContaining({ userId: "ingestapi" })
    );
  });
});
