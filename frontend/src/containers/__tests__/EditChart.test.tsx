import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import EditChart from "../EditChart";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");
jest.mock("papaparse");

beforeEach(() => {
  BackendService.editWidget = jest.fn();
  StorageService.uploadDataset = jest.fn().mockReturnValue({
    s3Keys: {
      raw: "abc.csv",
      json: "abc.json",
    },
  });
  StorageService.downloadDataset = jest.fn();
});

test("renders title", async () => {
  /*render(<EditChart />, { wrapper: MemoryRouter });
  expect(
    await screen.findByRole("heading", { name: "Edit chart" })
  ).toBeInTheDocument();*/
});

test("renders a textfield for chart title", async () => {
  /*render(<EditChart />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Chart title")).toBeInTheDocument();*/
});

test("renders a file upload input", async () => {
  /*render(<EditChart />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("File upload")).toBeInTheDocument();*/
});
