import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import EditChart from "../EditChart";
import { createMemoryHistory } from "history";
import papaparse from "papaparse";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");
jest.mock("papaparse");

beforeEach(() => {
  BackendService.editWidget = jest.fn();
  BackendService.createDataset = jest.fn().mockReturnValue({ id: "1244" });
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

test("on submit, it calls editWidget api and uploads dataset", async () => {
  const parseSpy = jest.spyOn(papaparse, "parse");
  const { getByRole, getByText, getByLabelText, getAllByText, getByTestId } =
    render(<EditChart />, {
      wrapper: MemoryRouter,
    });

  await act(async () => {
    fireEvent.click(getByRole("tab", { name: "Choose data" }));
  });

  await waitFor(() => {
    expect(
      getByText(
        "Choose an existing dataset or create a new one to populate this chart."
      )
    ).toBeInTheDocument();
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

  const submitButton = getAllByText("Save")[0];

  await waitFor(() => {
    expect(parseSpy).toHaveBeenCalled();
    submitButton.removeAttribute("disabled");
  });

  await waitFor(() => expect(submitButton).toBeEnabled());
  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.editWidget).toHaveBeenCalled();
  expect(StorageService.uploadDataset).toHaveBeenCalled();
  expect(BackendService.createDataset).toHaveBeenCalled();
});

test("cancel link takes you to Edit Dashboard screen", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

  const { findByRole } = render(
    <Router history={history}>
      <EditChart />
    </Router>
  );

  await act(async () => {
    const cancelButton = await findByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
  });

  expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});
