import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BadgerService from "../../services/BadgerService";
import StorageService from "../../services/StorageService";
import AddChart from "../AddChart";
import papaparse from "papaparse";

jest.mock("../../services/BadgerService");
jest.mock("../../services/StorageService");
jest.mock("papaparse");

beforeEach(() => {
  BadgerService.createWidget = jest.fn();
  BadgerService.createDataset = jest.fn().mockReturnValue({ id: "1244" });
  StorageService.uploadDataset = jest.fn().mockReturnValue({
    s3Keys: {
      raw: "abc.csv",
      json: "abc.json",
    },
  });
});

test("renders title and subtitles", async () => {
  const { getByText } = render(<AddChart />, { wrapper: MemoryRouter });
  expect(getByText("Add content")).toBeInTheDocument();
  expect(getByText("Configure chart")).toBeInTheDocument();
  expect(getByText("Step 2 of 2")).toBeInTheDocument();
});

test("renders a textfield for chart title", async () => {
  const { getByLabelText } = render(<AddChart />, { wrapper: MemoryRouter });
  expect(getByLabelText("Chart title")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  const { getByLabelText } = render(<AddChart />, { wrapper: MemoryRouter });
  expect(getByLabelText("File upload")).toBeInTheDocument();
});

test("on submit, it calls createWidget api and uploads dataset", async () => {
  const parseSpy = jest.spyOn(papaparse, "parse");
  const { getByRole, getByText, getByLabelText } = render(<AddChart />, {
    wrapper: MemoryRouter,
  });

  const submitButton = getByRole("button", { name: "Add chart" });

  fireEvent.input(getByLabelText("Chart title"), {
    target: {
      value: "COVID Cases",
    },
  });

  fireEvent.change(getByLabelText("File upload"), {
    target: {
      files: ["dataset.csv"],
    },
  });

  await waitFor(() => {
    expect(parseSpy).toHaveBeenCalled();
    submitButton.removeAttribute("disabled");
  });

  await waitFor(() => expect(submitButton).toBeEnabled());
  await waitFor(() => {
    expect(getByText("Preview")).toBeInTheDocument();
    expect(getByText("COVID Cases")).toBeInTheDocument();
  });

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BadgerService.createWidget).toHaveBeenCalled();
  expect(StorageService.uploadDataset).toHaveBeenCalled();
  expect(BadgerService.createDataset).toHaveBeenCalled();
});
