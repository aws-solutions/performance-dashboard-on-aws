import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewDashboard from "../ViewDashboard";

jest.mock("../../hooks");

const { ResizeObserver } = window;

beforeEach(() => {
  //@ts-ignore
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

test("renders dashboard title", () => {
  const { getByRole } = render(<ViewDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByRole("heading", { name: "My AWS Dashboard" })
  ).toBeInTheDocument();
});

test("renders dashboard topic area", () => {
  const { getByText } = render(<ViewDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Bananas")).toBeInTheDocument();
});

test("renders dashboard description", () => {
  const { getByText } = render(<ViewDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Some description")).toBeInTheDocument();
});

test("renders a back link to homepage", async () => {
  const { getByRole } = render(<ViewDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("link", { name: "All Dashboards" }));
});
