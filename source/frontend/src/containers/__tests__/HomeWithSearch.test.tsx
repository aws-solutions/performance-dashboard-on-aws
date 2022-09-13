import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeWithSearch from "../HomeWithSearch";

jest.mock("../../hooks");

test("Renders homepage title", async () => {
  const { getByRole } = render(<HomeWithSearch />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("heading", { name: "Search results" })).toBeInTheDocument();
});

test("Renders dashboards list", async () => {
  const { getByText } = render(<HomeWithSearch />, { wrapper: MemoryRouter });
  expect(getByText("Topic Area Bananas")).toBeInTheDocument();
  expect(getByText("Dashboard One")).toBeInTheDocument();
});
