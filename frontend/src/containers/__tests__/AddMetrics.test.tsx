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
import AddMetrics from "../AddMetrics";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");

beforeEach(() => {
  BackendService.createWidget = jest.fn();
  BackendService.createDataset = jest.fn().mockReturnValue({ id: "123" });
  StorageService.uploadMetric = jest.fn().mockReturnValue({
    s3Keys: {
      raw: "abc.json",
      json: "abc.json",
    },
  });
});

test("renders title and subtitles", async () => {
  render(<AddMetrics />, {
    wrapper: MemoryRouter,
  });
  expect(
    await screen.findByRole("heading", { name: "Add metrics" })
  ).toBeInTheDocument();
});

test("renders a textfield for metrics title", async () => {
  render(<AddMetrics />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Metrics title*")).toBeInTheDocument();
});

test("renders the Metrics title", async () => {
  render(<AddMetrics />, { wrapper: MemoryRouter });
  expect(await screen.findByText("Metrics")).toBeInTheDocument();
});

test("on submit, it does not call createWidget api and upload dataset without a metric added", async () => {
  const { getByRole, getAllByText, getByLabelText, getByTestId } = render(
    <AddMetrics />,
    {
      wrapper: MemoryRouter,
    }
  );

  const continueButton = getByRole("button", { name: "Continue" });

  const radioButton = getByTestId("createNewRadioButton");

  await waitFor(() => {
    continueButton.removeAttribute("disabled");
    fireEvent.click(radioButton);
  });

  await act(async () => {
    fireEvent.click(continueButton);
  });

  const submitButton = getAllByText("Add metrics")[3];

  fireEvent.input(getByLabelText("Metrics title*"), {
    target: {
      value: "Test Metrics",
    },
  });

  await waitFor(() => expect(submitButton).toBeEnabled());
  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.createWidget).not.toHaveBeenCalled();
  expect(StorageService.uploadMetric).not.toHaveBeenCalled();
});
