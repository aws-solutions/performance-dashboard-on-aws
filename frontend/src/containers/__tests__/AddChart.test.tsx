import React from "react";
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import AddChart from "../AddChart";
import papaparse from "papaparse";
import { createMemoryHistory } from "history";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");
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
    await screen.findByRole("heading", { name: "Add chart - choose data" })
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
  expect(await screen.findByLabelText("Chart title*")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<AddChart />, { wrapper: MemoryRouter });

  const radioButton = await screen.getByTestId("staticDatasetRadioButton");
  fireEvent.click(radioButton);

  expect(await screen.findByLabelText("Static datasets")).toBeInTheDocument();
});

test("renders table for dynamic dataset", async () => {
  render(<AddChart />, { wrapper: MemoryRouter });

  const radioButton = await screen.getByTestId("dynamicDatasetRadioButton");
  await act(async () => {
    fireEvent.click(radioButton);
  });

  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByText("abc")).toBeInTheDocument();
});

test("on submit, it calls createWidget api and uploads dataset", async () => {
  const parseSpy = jest.spyOn(papaparse, "parse");
  const { getByRole, getByText, getByLabelText, getAllByText, getByTestId } =
    render(<AddChart />, {
      wrapper: MemoryRouter,
    });

  let continueButton = getByRole("button", { name: "Continue" });

  const radioButton = getByTestId("staticDatasetRadioButton");

  await waitFor(() => {
    continueButton.removeAttribute("disabled");
    fireEvent.click(radioButton);
  });

  const file = new File(["dummy content"], "test.csv", {
    type: "text/csv",
  });
  const uploadFile = getByLabelText("Static datasets");
  Object.defineProperty(uploadFile, "files", { value: [file] });
  Object.defineProperty(uploadFile, "value", {
    value: file.name,
  });
  fireEvent.change(uploadFile);

  await act(async () => {
    fireEvent.click(continueButton);
  });

  await waitFor(() => {
    expect(
      getByText(
        "Please make sure that the system formats your data correctly." +
          " Select columns to format as numbers, dates, or text. Also select" +
          " columns to hide or show from the chart."
      )
    ).toBeInTheDocument();
  });

  await waitFor(() => {
    continueButton = getAllByText("Continue")[1];
    fireEvent.click(continueButton);
  });

  fireEvent.input(getByLabelText("Chart title*"), {
    target: {
      value: "COVID Cases",
    },
  });

  const submitButton = getAllByText("Add chart")[4];

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

test("cancel link takes you to Edit Dashboard screen", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

  const { findByRole } = render(
    <Router history={history}>
      <AddChart />
    </Router>
  );

  await act(async () => {
    const cancelButton = await findByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
  });

  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});
