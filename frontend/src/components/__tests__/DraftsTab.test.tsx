import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DraftsTab from "../DraftsTab";
import { Dashboard } from "../../models";

jest.mock("../../hooks");

const dashboards: Array<Dashboard> = [
  {
    id: "abc",
    name: "Dashboard One",
    version: 1,
    parentDashboardId: "abc",
    topicAreaId: "123456789",
    topicAreaName: "Topic Area Bananas",
    createdBy: "test user",
    state: "Draft",
    updatedAt: new Date(),
    widgets: [],
  },
  {
    id: "xyz",
    name: "Dashboard Two",
    version: 1,
    parentDashboardId: "xyz",
    topicAreaId: "987654321",
    topicAreaName: "Topic Area Grapes",
    createdBy: "test user",
    state: "Draft",
    updatedAt: new Date(),
    widgets: [],
  },
];

test("renders a button to delete", async () => {
  const { getByRole } = render(
    <DraftsTab dashboards={[]} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );
  const button = getByRole("button", { name: "Delete" });
  expect(button).toBeInTheDocument();
});

test("renders a button to publish", async () => {
  const { getByRole } = render(
    <DraftsTab dashboards={[]} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );
  const button = getByRole("button", { name: "Publish" });
  expect(button).toBeInTheDocument();
});

test("renders a button to create dashboard", async () => {
  const { getByRole } = render(
    <DraftsTab dashboards={[]} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );
  const button = getByRole("button", { name: "Create dashboard" });
  expect(button).toBeInTheDocument();
});

test("renders a dashboard table", async () => {
  const { getByRole } = render(
    <DraftsTab dashboards={dashboards} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );

  const dashboard1 = getByRole("link", { name: "Dashboard One" });
  expect(dashboard1).toBeInTheDocument();

  const dashboard2 = getByRole("link", { name: "Dashboard Two" });
  expect(dashboard2).toBeInTheDocument();
});

test("filters dashboards based on search input", async () => {
  const { getByLabelText, getByRole } = render(
    <DraftsTab dashboards={dashboards} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );

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
