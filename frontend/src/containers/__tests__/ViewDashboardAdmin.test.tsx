/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen, act, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { DashboardState } from "../../models";
import ViewDashboardAdmin from "../ViewDashboardAdmin";
import * as hooks from "../../hooks";
import BackendService from "../../services/BackendService";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

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

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Close" }));
    });

    expect(screen.queryByText("Publish dashboard")).not.toBeInTheDocument();
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
  BackendService.createDraft = jest.fn().mockReturnValue({
    id: undefined,
  });

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

  fireEvent.click(screen.getByRole("button", { name: "Update" }));

  const createDrafButton = screen.getByRole("button", { name: "Create draft" });
  expect(createDrafButton).toBeInTheDocument();

  fireEvent.click(createDrafButton);

  expect(BackendService.createDraft).toHaveBeenCalled();
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

describe("Update Modal", () => {
  beforeEach(async () => {
    BackendService.createDraft = jest.fn().mockReturnValue({
      id: undefined,
    });

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

    fireEvent.click(screen.getByRole("button", { name: "Update" }));
  });

  test("renders the modal", async () => {
    const createDraftButton = screen.getByRole("button", {
      name: "Create draft",
    });
    expect(createDraftButton).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
  });

  test("do click on 'Create draft' button submits the draft to the backend service", async () => {
    const createDraftButton = screen.getByRole("button", {
      name: "Create draft",
    });

    fireEvent.click(createDraftButton);

    expect(BackendService.createDraft).toHaveBeenCalled();
  });

  test("do click on 'Cancel' do not submit the draft to the backend service", async () => {
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    fireEvent.click(cancelButton);

    expect(BackendService.createDraft).toHaveBeenCalledTimes(0);
  });
});

describe("Archive Modal", () => {
  beforeEach(async () => {
    BackendService.archive = jest.fn().mockReturnValue({
      id: undefined,
    });

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

    fireEvent.click(
      screen.getByRole("button", { name: "Published dashboard actions" })
    );

    const menuItem = screen.getByLabelText("Archive published dashboard");

    userEvent.click(menuItem);
  });

  test("renders the modal", async () => {
    const archiveButton = screen.getByRole("button", { name: "Archive" });
    expect(archiveButton).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
  });

  test("do click on 'Archive' button submits the archive to the backend service", async () => {
    const copyButton = screen.getByRole("button", { name: "Archive" });

    fireEvent.click(copyButton);

    expect(BackendService.archive).toHaveBeenCalled();
  });

  test("do click on 'Cancel' do not submit the archive to the backend service", async () => {
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    fireEvent.click(cancelButton);

    expect(BackendService.archive).toHaveBeenCalledTimes(0);
  });
});

describe("Copy Modal", () => {
  beforeEach(async () => {
    BackendService.copyDashboard = jest.fn().mockReturnValue({
      id: undefined,
    });

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

    fireEvent.click(
      screen.getByRole("button", { name: "Published dashboard actions" })
    );

    const menuItem = screen.getByLabelText("Copy published dashboard");

    userEvent.click(menuItem);
  });

  test("renders the modal", async () => {
    const copyButton = screen.getByRole("button", { name: "Copy" });
    expect(copyButton).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
  });

  test("do click on 'Copy' button submits the copy to the backend service", async () => {
    const copyButton = screen.getByRole("button", { name: "Copy" });

    fireEvent.click(copyButton);

    expect(BackendService.copyDashboard).toHaveBeenCalled();
  });

  test("do click on 'Cancel' do not submit the copy to the backend service", async () => {
    //Cancel Button inside Copy Modal
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    //do click on Cancel button
    fireEvent.click(cancelButton);

    expect(BackendService.copyDashboard).toHaveBeenCalledTimes(0);
  });
});

describe("Re-publish Modal", () => {
  beforeEach(async () => {
    BackendService.publishDashboard = jest.fn().mockReturnValue({
      id: undefined,
    });

    const archived = { ...dummyDashboard, state: DashboardState.Archived };
    (hooks.useDashboard as any) = jest.fn().mockReturnValue({
      loading: false,
      dashboard: archived,
    });
    (hooks.useDashboardVersions as any) = jest.fn().mockReturnValue({
      loading: false,
      versions: [
        { id: "af0dc34f", version: 1, state: "Inactive" },
        {
          id: "40db73f9",
          version: 2,
          state: "Archived",
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

    fireEvent.click(screen.getByRole("button", { name: "Re-publish" }));
  });

  test("renders the modal", async () => {
    const dialog = screen.getByRole("dialog");
    const rePublishButton = within(dialog).getByRole("button", {
      name: "Re-publish",
    });
    expect(rePublishButton).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
  });

  test("do click on 'Re-publish' button submits the publish action to the backend service", async () => {
    const dialog = screen.getByRole("dialog");
    const rePublishButton = within(dialog).getByRole("button", {
      name: "Re-publish",
    });

    fireEvent.click(rePublishButton);

    expect(BackendService.publishDashboard).toHaveBeenCalled();
  });

  test("do click on 'Cancel' do not submit the publish action to the backend service", async () => {
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    fireEvent.click(cancelButton);

    expect(BackendService.publishDashboard).toHaveBeenCalledTimes(0);
  });
});

test("do click on 'View History' menu item navigates to dashboard history", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

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

  render(
    <Router history={history}>
      <ViewDashboardAdmin />
    </Router>
  );

  //do click on the actions menu
  fireEvent.click(
    screen.getByRole("button", { name: "Published dashboard actions" })
  );

  // find the Copy menu item
  const copyMenuItem = screen.getByLabelText(
    "View published dashboard's history"
  );
  expect(copyMenuItem).toBeInTheDocument();

  //do click on the Copy menu item.
  userEvent.click(copyMenuItem);

  expect(history.push).toHaveBeenCalledWith(
    `/admin/dashboard/${dummyDashboard.id}/history`
  );
});

test("when selecting a diferent version the ui navigates to selected version", async () => {
  const history = createMemoryHistory();
  jest.spyOn(history, "push");

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

  render(
    <Router history={history}>
      <ViewDashboardAdmin />
    </Router>
  );

  const versionToSelect = { id: "af0dc34f", version: 1, state: "Inactive" };

  userEvent.selectOptions(screen.getByRole("combobox"), [
    `${versionToSelect.version}`,
  ]);

  expect(history.push).toHaveBeenCalledWith(
    `/admin/dashboard/${versionToSelect.id}`
  );
});
