import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardListing from "../DashboardListing";

test("renders a button to create dashboard", async () => {
  const { getByRole } = render(<DashboardListing />, { wrapper: MemoryRouter });
  const button = await getByRole("button");
  expect(button).toHaveTextContent("Create dashboard");
});
