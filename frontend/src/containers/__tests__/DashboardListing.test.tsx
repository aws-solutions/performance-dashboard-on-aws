import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardListing from "../DashboardListing";

jest.mock("../../hooks");

test("renders a button to create dashboard", async () => {
  const { getByRole } = render(<DashboardListing />, { wrapper: MemoryRouter });
  const button = getByRole("button", { name: "Create dashboard" });
  expect(button).toBeInTheDocument();
});

test("renders a dashboard table", async () => {
  const { findByText } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });

  // Dummy dashboards coming from "hooks/__mocks__"
  const dashboard1 = await findByText("Dashboard One");
  expect(dashboard1).toBeInTheDocument();

  const dashboard2 = await findByText("Dashboard Two");
  expect(dashboard2).toBeInTheDocument();
});
