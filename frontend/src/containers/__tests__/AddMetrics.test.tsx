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
  expect(await screen.findByText("Configure metrics")).toBeInTheDocument();
  expect(await screen.findByText("Step 2 of 2")).toBeInTheDocument();
});

test("renders a textfield for metrics title", async () => {
  render(<AddMetrics />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Metrics title")).toBeInTheDocument();
});

test("renders the Metrics title", async () => {
  render(<AddMetrics />, { wrapper: MemoryRouter });
  expect(await screen.findByText("Metrics")).toBeInTheDocument();
});

test("on submit, it calls createWidget api and uploads dataset", async () => {
  const { getByRole, getByText, getByLabelText } = render(<AddMetrics />, {
    wrapper: MemoryRouter,
  });

  const submitButton = getByRole("button", { name: "Add metrics" });

  fireEvent.input(getByLabelText("Metrics title"), {
    target: {
      value: "Test Metrics",
    },
  });

  await waitFor(() => expect(submitButton).toBeEnabled());
  await waitFor(() => {
    expect(getByText("Preview")).toBeInTheDocument();
  });

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.createWidget).toHaveBeenCalled();
  expect(StorageService.uploadMetric).toHaveBeenCalled();
});
