import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BadgerService from "../../services/BadgerService";
import StorageService from "../../services/StorageService";
import EditChart from "../EditChart";

jest.mock("../../services/BadgerService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");
jest.mock("papaparse");

beforeEach(() => {
  BadgerService.editWidget = jest.fn();
  StorageService.uploadDataset = jest.fn().mockReturnValue({
    s3Keys: {
      raw: "abc.csv",
      json: "abc.json",
    },
  });
  StorageService.downloadDataset = jest.fn();
});

test("renders title", async () => {
  const { getByText } = render(<EditChart />, { wrapper: MemoryRouter });
  expect(getByText("Edit content item")).toBeInTheDocument();
});

test("renders a textfield for chart title", async () => {
  const { getByLabelText } = render(<EditChart />, { wrapper: MemoryRouter });
  expect(getByLabelText("Chart title")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  const { getByLabelText } = render(<EditChart />, { wrapper: MemoryRouter });
  expect(getByLabelText("File upload")).toBeInTheDocument();
});
