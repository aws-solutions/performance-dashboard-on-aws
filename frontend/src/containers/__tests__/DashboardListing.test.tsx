import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardListing from "../DashboardListing";

jest.mock("../../hooks");

test("renders a button to create dashboard", async () => {
  const { getByRole } = render(<DashboardListing />, { wrapper: MemoryRouter });
  const button = getByRole("link", { name: "Create new dashboard" });
  expect(button).toHaveTextContent("Create new dashboard");
});
