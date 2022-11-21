/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
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
  widgets: [
    {
      id: "0828b98e",
      dashboardId: "123",
      name: "Column chart: Average class size",
      widgetType: "Chart",
      order: 5,
      updatedAt: "2022-09-13T05:27:20.333Z",
      showTitle: true,
      section: "",
      content: {
        summary: "A column chart ...",
        fileName: "Average class size.csv",
        sortByDesc: false,
        title: "Column chart: Average class size",
        significantDigitLabels: false,
        dataLabels: false,
        s3Key: {
          raw: "672f377a-1def-4308-ab80-a2b15b0d91a9.csv",
          json: "9ac17541-9ba5-4fac-af5c-401f33893195.json",
        },
        summaryBelow: false,
        horizontalScroll: false,
        showTotal: true,
        chartType: "ColumnChart",
        datasetId: "a8bec0ec-9fcb-4ef1-ba11-2e027cdb44a8",
        computePercentages: false,
        datasetType: "StaticDataset",
        columnsMetadata: [],
      },
    },
    {
      id: "ebf83d58-c226-4f82-aad6-7a18d32ac931",
      dashboardId: "a2eb7bec-a8fc-4055-9d49-669dd178e540",
      name: "Sections: Grouping related content items together ",
      widgetType: "Section",
      order: 6,
      updatedAt: "2022-09-13T05:27:20.333Z",
      showTitle: true,
      section: "",
      content: {
        summary: "A section ...",
        horizontally: false,
        title: "Sections: Grouping related content items together ",
        showWithTabs: true,
        widgetIds: ["3cd7a776-3240-4155-b479-60e49aaae1ce"],
      },
    },
    {
      id: "3cd7a776-3240-4155-b479-60e49aaae1ce",
      dashboardId: "a2eb7bec-a8fc-4055-9d49-669dd178e540",
      name: "Donut chart: Devices used to access service",
      widgetType: "Chart",
      order: 7,
      updatedAt: "2022-09-13T05:27:20.333Z",
      showTitle: true,
      section: "ebf83d58-c226-4f82-aad6-7a18d32ac931",
      content: {
        summary: "A donut chart...",
        fileName: "Devices used to access service.csv",
        sortByDesc: false,
        title: "Donut chart: Devices used to access service",
        significantDigitLabels: false,
        dataLabels: false,
        s3Key: {
          raw: "b1dc2e7f-aa52-472b-8fa5-d06a3830d764.csv",
          json: "29716b9c-6f30-4c80-a4a2-3f12bd5d6e71.json",
        },
        summaryBelow: false,
        showTotal: false,
        chartType: "DonutChart",
        datasetId: "fde387fd-ea63-4565-88d3-b28c4474912b",
        computePercentages: false,
        datasetType: "StaticDataset",
        columnsMetadata: [
          {
            numberType: "Percentage",
            hidden: false,
            columnName: "Usage",
            dataType: "Number",
          },
        ],
      },
    },
  ],
};

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe("general dashboard details", () => {
  beforeEach(() => {
    render(<ViewDashboardAdmin />, {
      wrapper: MemoryRouter,
    });
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

  test("renders the publish modal", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    });

    expect(
      screen.getByRole("button", { name: "Publish dashboard" })
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
    expect(
      screen.getByRole("button", { name: "Published dashboard actions" })
    ).toBeInTheDocument();
  });

  test("renders an update button", async () => {
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  test("renders show version notes checkbox", async () => {
    const viewCheckbox = screen.getByText("Show version notes");
    fireEvent.input(viewCheckbox, {
      target: {
        checked: true,
      },
    });
    expect(viewCheckbox).toBeInTheDocument();
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
      screen.getByRole("button", { name: "Archived dashboard actions" })
    ).toBeInTheDocument();
  });

  test("renders the re-publish modal", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Re-publish" }));
    });

    const message = await screen.findByText(
      "Are you sure you want to re-publish this dashboard?"
    );
    expect(message).toBeInTheDocument();
  });
});

describe("dashboard in draft in mobile", () => {
  beforeEach(() => {
    // Override the useDashboard mock to return a dashboard in Draft
    const draft = { ...dummyDashboard, state: DashboardState.Draft };
    (hooks.useDashboard as any) = jest.fn().mockReturnValue({
      loading: false,
      dashboard: draft,
    });
    (hooks.useWindowSize as any) = jest.fn().mockReturnValue({
      width: 400,
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

  test("renders the publish modal", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    });

    expect(
      screen.getByRole("button", { name: "Publish dashboard" })
    ).toBeInTheDocument();
  });
});

describe("dashboard published in mobile", () => {
  beforeEach(() => {
    // Override the useDashboard mock to return a dashboard in Published state
    const published = { ...dummyDashboard, state: DashboardState.Published };
    (hooks.useDashboard as any) = jest.fn().mockReturnValue({
      loading: false,
      dashboard: published,
    });
    (hooks.useWindowSize as any) = jest.fn().mockReturnValue({
      width: 400,
    });

    render(<ViewDashboardAdmin />, {
      wrapper: MemoryRouter,
    });
  });

  test("renders an archive button", async () => {
    expect(
      screen.getByRole("button", { name: "Published dashboard actions" })
    ).toBeInTheDocument();
  });

  test("renders an update button", async () => {
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  test("renders show version notes checkbox", async () => {
    const viewCheckbox = screen.getByText("Show version notes");
    fireEvent.input(viewCheckbox, {
      target: {
        checked: true,
      },
    });
    expect(viewCheckbox).toBeInTheDocument();
  });
});

describe("dashboard archived in mobile", () => {
  beforeEach(() => {
    // Override the useDashboard mock to return a dashboard in Archived state
    const archived = { ...dummyDashboard, state: DashboardState.Archived };
    (hooks.useDashboard as any) = jest.fn().mockReturnValue({
      loading: false,
      dashboard: archived,
    });
    (hooks.useWindowSize as any) = jest.fn().mockReturnValue({
      width: 400,
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
      screen.getByRole("button", { name: "Archived dashboard actions" })
    ).toBeInTheDocument();
  });

  test("renders the re-publish modal", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Re-publish" }));
    });

    const message = await screen.findByText(
      "Are you sure you want to re-publish this dashboard?"
    );
    expect(message).toBeInTheDocument();
  });
});

test("renders the update modal", async () => {
  const published = { ...dummyDashboard, state: DashboardState.Published };
  (hooks.useDashboard as any) = jest.fn().mockReturnValue({
    loading: false,
    dashboard: published,
  });
  (hooks.useDashboardVersions as any) = jest.fn().mockReturnValue({
    loading: false,
    versions: [
      { id: "af0dc34f", version: 1, state: "Inactive" },
      {
        id: "40db73f9",
        version: 2,
        state: "Published",
        friendlyURL: "hello-world",
      },
    ],
  });
  (hooks.useWindowSize as any) = jest.fn().mockReturnValue({
    width: 800,
  });

  render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
  });

  expect(
    screen.getByRole("button", { name: "Create draft" })
  ).toBeInTheDocument();
});

test("renders the update modal in mobile", async () => {
  const published = { ...dummyDashboard, state: DashboardState.Published };
  (hooks.useWindowSize as any) = jest.fn().mockReturnValue({
    width: 400,
  });
  (hooks.useDashboard as any) = jest.fn().mockReturnValue({
    loading: false,
    dashboard: published,
  });
  (hooks.useDashboardVersions as any) = jest.fn().mockReturnValue({
    loading: false,
    versions: [
      { id: "af0dc34f", version: 1, state: "Inactive" },
      {
        id: "40db73f9",
        version: 2,
        state: "Published",
        friendlyURL: "hello-world",
      },
    ],
  });

  render(<ViewDashboardAdmin />, {
    wrapper: MemoryRouter,
  });

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
  });

  expect(
    screen.getByRole("button", { name: "Create draft" })
  ).toBeInTheDocument();
});
