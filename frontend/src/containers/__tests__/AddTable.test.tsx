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
import AddTable from "../AddTable";
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
  render(<AddTable />, {
    wrapper: MemoryRouter,
  });
  expect(
    await screen.findByRole("heading", { name: "Add table" })
  ).toBeInTheDocument();
  expect(await screen.findByText("Data")).toBeInTheDocument();
  expect(
    await screen.findByText(
      "Choose an existing dataset or create a new one to populate this table."
    )
  ).toBeInTheDocument();
});

test("renders a textfield for table title", async () => {
  render(<AddTable />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Table title*")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<AddTable />, { wrapper: MemoryRouter });

  const radioButton = await screen.getByTestId("staticDatasetRadioButton");
  fireEvent.click(radioButton);

  expect(await screen.findByLabelText("Static datasets*")).toBeInTheDocument();
});

test("on submit, it calls createWidget api and uploads dataset", async () => {
  const parseSpy = jest.spyOn(papaparse, "parse");
  const { getByRole, getAllByText, getByLabelText, getByTestId } = render(
    <AddTable />,
    {
      wrapper: MemoryRouter,
    }
  );

  const continueButton = getByRole("button", { name: "Continue" });
  const radioButton = getByTestId("staticDatasetRadioButton");

  await waitFor(() => {
    continueButton.removeAttribute("disabled");
    fireEvent.click(radioButton);
  });

  const file = new File(["dummy content"], "test.csv", {
    type: "text/csv",
  });
  const uploadFile = getByLabelText("Static datasets*");
  Object.defineProperty(uploadFile, "files", { value: [file] });
  Object.defineProperty(uploadFile, "value", {
    value: file.name,
  });
  fireEvent.change(uploadFile);

  await act(async () => {
    fireEvent.click(continueButton);
  });

  fireEvent.input(getByLabelText("Table title*"), {
    target: {
      value: "COVID Cases",
    },
  });

  const submitButton = getAllByText("Add table")[4];

  await waitFor(() => {
    expect(parseSpy).toHaveBeenCalled();
    submitButton.removeAttribute("disabled");
  });

  await waitFor(() => expect(submitButton).toBeEnabled());
  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.createWidget).toHaveBeenCalled();
  expect(StorageService.uploadDataset).toHaveBeenCalled();
  expect(BackendService.createDataset).toHaveBeenCalled();
});
