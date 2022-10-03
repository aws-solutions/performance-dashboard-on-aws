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
  StorageService.downloadFile = jest.fn();
});

test("renders title and subtitles", async () => {
  render(<EditChart />, {
    wrapper: MemoryRouter,
  });
  expect(
    await screen.findByRole("heading", { name: "Edit chart" })
  ).toBeInTheDocument();
  expect(await screen.findByText("Data")).toBeInTheDocument();
  expect(
    await screen.findByText(
      "Choose an existing dataset or create a new one to populate this chart."
    )
  ).toBeInTheDocument();
});

test("renders a textfield for chart title", async () => {
  render(<EditChart />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Chart title*")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<EditChart />, { wrapper: MemoryRouter });
  expect(
    await screen.findByRole("tab", { name: "Choose data" })
  ).toBeInTheDocument();
});
