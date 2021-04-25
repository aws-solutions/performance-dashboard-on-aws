import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DraftsTab from "../DraftsTab";
import { Dashboard } from "../../models";
import userEvent from "@testing-library/user-event";

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

test("renders the dropdown menu", () => {
  const { getByText } = render(
    <DraftsTab dashboards={dashboards} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );
  expect(getByText("Actions")).toBeInTheDocument();
});

test("when no dashboard is selected Actions button is disabled", () => {
  const { getByText } = render(
    <DraftsTab dashboards={dashboards} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );
  expect(getByText("Actions")).toHaveAttribute("disabled");
});

test("when one dashboard is selected both dropdown options are enabled", () => {
  const { getByText, getByRole } = render(
    <DraftsTab dashboards={dashboards} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );

  const checkbox = getByRole("checkbox", { name: "Dashboard One" });
  userEvent.click(checkbox);
  userEvent.click(getByText("Actions"));

  expect(getByText("View history")).not.toHaveAttribute(
    "aria-disabled",
    "true"
  );
  expect(getByText("Delete")).not.toHaveAttribute("aria-disabled", "true");
});

test("when two dashboards are selected only Delete option is enabled", () => {
  const { getByText, getByRole } = render(
    <DraftsTab dashboards={dashboards} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );

  const checkbox1 = getByRole("checkbox", { name: "Dashboard One" });
  userEvent.click(checkbox1);
  const checkbox2 = getByRole("checkbox", { name: "Dashboard Two" });
  userEvent.click(checkbox2);
  userEvent.click(getByText("Actions"));

  expect(getByText("View history")).toHaveAttribute("aria-disabled", "true");
  expect(getByText("Delete")).not.toHaveAttribute("aria-disabled", "true");
});

test("view history navigates to the correct location", () => {
  const { getByText, getByRole } = render(
    <DraftsTab dashboards={dashboards} onDelete={() => {}} />,
    {
      wrapper: MemoryRouter,
    }
  );

  const checkbox = getByRole("checkbox", { name: "Dashboard One" });
  userEvent.click(checkbox);

  userEvent.click(getByText("Actions"));

  expect(getByText("View history").closest("a")).toHaveAttribute(
    "href",
    "/admin/dashboard/abc/history"
  );
});
