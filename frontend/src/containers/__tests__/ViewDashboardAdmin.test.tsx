import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewDashboardAdmin from "../ViewDashboardAdmin";

jest.mock("../../hooks");

test("renders dashboard version", () => {
  const { getByText } = render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Version 1")).toBeInTheDocument();
});

test("renders show version notes button", async () => {
  const { getByRole } = render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });
  const viewButton = getByRole("button", {
    name: "Show version notes",
  });
  expect(viewButton).toBeInTheDocument();
});

test("renders dashboard title", () => {
  const { getByRole } = render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByRole("heading", { name: "My AWS Dashboard" })
  ).toBeInTheDocument();
});

test("renders dashboard topic area", () => {
  const { getByText } = render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Bananas")).toBeInTheDocument();
});

test("renders dashboard description", () => {
  const { getByText } = render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });
  expect(getByText("Some description")).toBeInTheDocument();
});

test("renders a back link to homepage", async () => {
  const { getByRole } = render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("link", { name: "Dashboards" })).toBeInTheDocument();
});

test("renders an update button", async () => {
  const { getByRole } = render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("button", { name: "Update" })).toBeInTheDocument();
});

test("renders an archive button", async () => {
  const { getByRole } = render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });
  expect(getByRole("button", { name: "Archive" })).toBeInTheDocument();
});
