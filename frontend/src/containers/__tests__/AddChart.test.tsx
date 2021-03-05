import React from "react";
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import AddChart from "../AddChart";
import papaparse from "papaparse";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("papaparse");

beforeEach(() => {
  BackendService.createWidget = jest.fn();
  BackendService.createDataset = jest.fn().mockReturnValue({ id: "1244" });
  StorageService.uploadDataset = jest.fn().mockReturnValue({
    s3Keys: {
      raw: "abc.csv",
      json: "abc.json",
    },
  });
});

test("renders title and subtitles", async () => {
  render(<AddChart />, {
    wrapper: MemoryRouter,
  });
  expect(
    await screen.findByRole("heading", { name: "Add chart" })
  ).toBeInTheDocument();
  expect(await screen.findByText("Data")).toBeInTheDocument();
  expect(
    await screen.findByText(
      "Choose an existing dataset or create a new one to populate this chart."
    )
  ).toBeInTheDocument();
});

test("renders a textfield for chart title", async () => {
  render(<AddChart />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Chart title")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<AddChart />, { wrapper: MemoryRouter });

  const radioButton = await screen.findByLabelText("Static dataset");
  fireEvent.click(radioButton);

  expect(await screen.findByLabelText("Static datasets")).toBeInTheDocument();
});

test("on submit, it calls createWidget api and uploads dataset", async () => {
  const parseSpy = jest.spyOn(papaparse, "parse");
  const { getByRole, getByText, getByLabelText } = render(<AddChart />, {
    wrapper: MemoryRouter,
  });

  const continueButton = getByRole("button", { name: "Continue" });

  const radioButton = getByLabelText("Static dataset");

  await waitFor(() => {
    continueButton.removeAttribute("disabled");
    fireEvent.click(radioButton);
  });

  await act(async () => {
    fireEvent.click(continueButton);
  });

  fireEvent.change(getByLabelText("Static datasets"), {
    target: {
      files: ["dataset.csv"],
    },
  });

  fireEvent.input(getByLabelText("Chart title"), {
    target: {
      value: "COVID Cases",
    },
  });

  const submitButton = getByRole("button", { name: "Add Chart" });

  await waitFor(() => {
    expect(parseSpy).toHaveBeenCalled();
    submitButton.removeAttribute("disabled");
  });

  await waitFor(() => expect(submitButton).toBeEnabled());
  await waitFor(() => {
    expect(getByText("Preview")).toBeInTheDocument();
  });

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.createWidget).toHaveBeenCalled();
  expect(StorageService.uploadDataset).toHaveBeenCalled();
  expect(BackendService.createDataset).toHaveBeenCalled();
});
