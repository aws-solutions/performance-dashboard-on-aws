import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArchivedDashboard from "../ArchivedDashboard";

jest.mock("../../hooks");

test("renders dashboard title", () => {
  const { getByRole } = render(<ArchivedDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByRole("heading", { name: "My AWS Dashboard" })
  ).toBeInTheDocument();
});

test("renders dashboard topic area", () => {
  const { getByText } = render(<ArchivedDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Bananas")).toBeInTheDocument();
});

test("renders dashboard description", () => {
  const { getByText } = render(<ArchivedDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Some description")).toBeInTheDocument();
});

test("renders a back link to homepage", async () => {
  const { getByRole } = render(<ArchivedDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("link", { name: "Dashboards" })).toBeInTheDocument();
});

test("renders an archive button", async () => {
  const { getByRole } = render(<ArchivedDashboard />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("button", { name: "Re-publish" })).toBeInTheDocument();
});
