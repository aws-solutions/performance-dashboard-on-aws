import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DashboardState } from "../../models";
import ViewDashboardAdmin from "../ViewDashboardAdmin";
import * as hooks from "../../hooks";

jest.mock("../../hooks");

const dummyDashboard = {
  id: "123",
  name: "AWS Dashboard",
  topicAreaId: "abc",
  topicAreaName: "Bananas",
  parentDashboardId: "123",
  description: "Some description",
  updatedAt: "2021-01-19T18:27:00Z",
  updatedBy: "johndoe",
  createdBy: "test user",
  state: DashboardState.Published,
  version: 1,
  widgets: [],
};

describe("general dashboard details", () => {
  beforeEach(() => {
    render(<ViewDashboardAdmin />, {
      wrapper: MemoryRouter,
    });
  });

  test("renders dashboard version", () => {
    expect(screen.getByText("Version 1")).toBeInTheDocument();
  });

  test("renders dashboard title", () => {
    expect(
      screen.getByRole("heading", { name: "My AWS Dashboard" })
    ).toBeInTheDocument();
  });

  test("renders dashboard topic area", () => {
    expect(screen.getByText("Bananas")).toBeInTheDocument();
  });

  test("renders dashboard description", () => {
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  test("renders a back link to homepage", async () => {
    expect(
      screen.getByRole("link", { name: "Dashboards" })
    ).toBeInTheDocument();
  });
});

describe("dashboard in draft", () => {
  beforeEach(() => {
    // Override the useDashboard mock to return a dashboard in Draft
    const draft = { ...dummyDashboard, state: DashboardState.Draft };
    (hooks.useDashboard as any) = jest.fn().mockReturnValue({
      loading: false,
      dashboard: draft,
    });

    render(<ViewDashboardAdmin />, {
      wrapper: MemoryRouter,
    });
  });

  test("renders a close preview button", async () => {
    expect(
      screen.getByRole("button", { name: "Close Preview" })
    ).toBeInTheDocument();
  });

  test("renders a publish button", async () => {
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
  });

  test("renders an information alert", async () => {
    expect(
      screen.getByText(
        "Below is a preview of what the published dashboard will look like. " +
          "If ready to proceed, you can publish the dashboard to make it " +
          "available on the published site."
      )
    ).toBeInTheDocument();
  });
});

describe("dashboard published", () => {
  beforeEach(() => {
    // Override the useDashboard mock to return a dashboard in Published state
    const published = { ...dummyDashboard, state: DashboardState.Published };
    (hooks.useDashboard as any) = jest.fn().mockReturnValue({
      loading: false,
      dashboard: published,
    });

    render(<ViewDashboardAdmin />, {
      wrapper: MemoryRouter,
    });
  });

  test("renders an archive button", async () => {
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
  });

  test("renders an update button", async () => {
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  test("renders show version notes button", async () => {
    const viewButton = screen.getByRole("button", {
      name: "Show version notes",
    });
    expect(viewButton).toBeInTheDocument();
  });
});

describe("dashboard archived", () => {
  beforeEach(() => {
    // Override the useDashboard mock to return a dashboard in Archived state
    const archived = { ...dummyDashboard, state: DashboardState.Archived };
    (hooks.useDashboard as any) = jest.fn().mockReturnValue({
      loading: false,
      dashboard: archived,
    });

    render(<ViewDashboardAdmin />, {
      wrapper: MemoryRouter,
    });
  });

  test("renders a re-publish button", async () => {
    expect(
      screen.getByRole("button", { name: "Re-publish" })
    ).toBeInTheDocument();
  });

  test("renders a view history button", async () => {
    expect(
      screen.getByRole("button", { name: "View history" })
    ).toBeInTheDocument();
  });
});
