import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BadgerService from "../../services/BadgerService";
import AddTable from "../AddTable";
import papaparse from "papaparse";

jest.mock("../../services/BadgerService");
jest.mock("papaparse");

test("renders title and subtitles", async () => {
  const { getByText } = render(<AddTable />, { wrapper: MemoryRouter });
  expect(getByText("Add content")).toBeInTheDocument();
  expect(getByText("Configure table")).toBeInTheDocument();
  expect(getByText("Step 2 of 2")).toBeInTheDocument();
});

test("renders a textfield for table title", async () => {
  const { getByLabelText } = render(<AddTable />, { wrapper: MemoryRouter });
  expect(getByLabelText("Table title")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  const { getByLabelText } = render(<AddTable />, { wrapper: MemoryRouter });
  expect(getByLabelText("File upload")).toBeInTheDocument();
});

test("submit calls createWidget api", async () => {
  BadgerService.createWidget = jest.fn();
  const parseSpy = jest.spyOn(papaparse, "parse");
  const { getByRole, getByText, getByLabelText } = render(<AddTable />, {
    wrapper: MemoryRouter,
  });

  const submitButton = getByRole("button", { name: "Add table" });

  fireEvent.input(getByLabelText("Table title"), {
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
  });

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BadgerService.createWidget).toHaveBeenCalled();
});
