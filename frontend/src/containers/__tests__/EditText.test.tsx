import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditText from "../EditText";

jest.mock("../../services/BackendService");
jest.mock("../../hooks");

beforeEach(() => {
  BackendService.editWidget = jest.fn();
});

test("renders title", async () => {
  const { getByRole } = render(<EditText />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Edit text" })).toBeInTheDocument();
});

test("renders a text input for title", async () => {
  const { getByLabelText } = render(<EditText />, { wrapper: MemoryRouter });
  expect(getByLabelText("Text title")).toBeInTheDocument();
});

test("renders a text input for content", async () => {
  const { getByLabelText } = render(<EditText />, { wrapper: MemoryRouter });
  expect(getByLabelText("Text")).toBeInTheDocument();
});

test("renders the expand preview button", async () => {
  const { getByRole } = render(<EditText />, { wrapper: MemoryRouter });
  expect(getByRole("button", { name: "Expand preview" })).toBeInTheDocument();
});
