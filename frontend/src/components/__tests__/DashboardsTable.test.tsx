import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Dashboard, DashboardState } from "../../models";
import DashboardsTable from "../DashboardsTable";

const dashboard: Dashboard = {
  id: "abc",
  name: "USWDS",
  version: 1,
  parentDashboardId: "abc",
  topicAreaId: "123",
  topicAreaName: "Public Safety",
  createdBy: "johndoe",
  state: DashboardState.Draft,
  updatedAt: new Date("2020-09-09 08:09"),
  widgets: [],
};

test("renders an empty table", async () => {
  const wrapper = render(
    <DashboardsTable dashboardsState={DashboardState.Draft} dashboards={[]} />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a table with dashboards", async () => {
  const dashboards = [dashboard];
  const wrapper = render(
    <DashboardsTable
      dashboardsState={DashboardState.Draft}
      dashboards={dashboards}
    />,
    {
      wrapper: MemoryRouter,
    }
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("onSelect function is called when user selects dashboard", async () => {
  const onSelect = jest.fn();
  const { getByLabelText } = render(
    <DashboardsTable
      dashboardsState={DashboardState.Draft}
      onSelect={onSelect}
      dashboards={[dashboard]}
    />,
    {
      wrapper: MemoryRouter,
    }
  );

  await act(async () => {
    const checkbox = getByLabelText("USWDS");
    fireEvent.click(checkbox);
  });

  expect(onSelect).toBeCalledWith(expect.arrayContaining([dashboard]));
});
