import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardListing from "../DashboardListing";

jest.mock("../../services/BadgerService");
import BadgerService from "../../services/BadgerService";

test("renders a button to create dashboard", async () => {
  const { getByRole } = render(<DashboardListing />, { wrapper: MemoryRouter });
  const button = getByRole("button");
  expect(button).toHaveTextContent("Create dashboard");
});
