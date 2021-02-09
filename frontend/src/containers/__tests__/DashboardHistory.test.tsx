import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardHistory from "../DashboardHistory";

jest.mock("../../hooks");

test("renders the page title", async () => {
  render(<DashboardHistory />, { wrapper: MemoryRouter });
  expect(screen.getByRole("heading", { name: "History" })).toBeInTheDocument();
});

test("renders a table with audit logs", async () => {
  render(<DashboardHistory />, { wrapper: MemoryRouter });
  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();

  // Expected values coming from mocked hooks
  expect(within(table).getAllByText("johndoe")).toHaveLength(2);
  expect(within(table).getAllByText("1")).toHaveLength(2);
  expect(within(table).getByText("Created")).toBeInTheDocument();
  expect(within(table).getByText("Moved to publish queue")).toBeInTheDocument();
});

test("renders a search input", async () => {
  render(<DashboardHistory />, { wrapper: MemoryRouter });
  expect(screen.getByRole("searchbox")).toBeInTheDocument();
});
