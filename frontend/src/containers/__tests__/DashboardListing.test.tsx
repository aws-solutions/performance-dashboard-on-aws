import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardListing from "../DashboardListing";

jest.mock("../../hooks");

test("renders a button to create dashboard", async () => {
  const { getByRole } = render(<DashboardListing />, { wrapper: MemoryRouter });
  const button = getByRole("button", { name: "Create dashboard" });
  expect(button).toBeInTheDocument();
});

test("renders a dashboard table", async () => {
  const { findByText, getByRole } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });

  // Dummy dashboards coming from "hooks/__mocks__"
  const dashboard1 = getByRole("link", { name: "Dashboard One" });
  expect(dashboard1).toBeInTheDocument();

  const dashboard2 = getByRole("link", { name: "Dashboard One" });
  expect(dashboard2).toBeInTheDocument();
});

test("filters dashboards based on search input", async () => {
  const { getByLabelText, getByRole } = render(<DashboardListing />, {
    wrapper: MemoryRouter,
  });

  const dashboard1 = getByRole("link", { name: "Dashboard One" });
  const dashboard2 = getByRole("link", { name: "Dashboard Two" });

  // Make sure both dashboards show up in the table
  expect(dashboard1).toBeInTheDocument();
  expect(dashboard2).toBeInTheDocument();

  // Use search input to filter
  const search = getByLabelText("Search");
  await act(async () => {
    fireEvent.input(search, {
      target: {
        value: "Dashboard two",
      },
    });

    const searchButton = getByRole("button", { name: "Search" });
    fireEvent.click(searchButton);
  });

  // Dashboard one should dissapear
  expect(dashboard1).not.toBeInTheDocument();
  expect(dashboard2).toBeInTheDocument();
});
