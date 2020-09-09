import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Dashboard } from "../../models";
import DashboardsTable from "../DashboardsTable";

test("renders an empty table", async () => {
  const wrapper = render(<DashboardsTable dashboards={[]} />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a table with dashboards", async () => {
  const dashboards: Array<Dashboard> = [
    {
      id: "abc",
      name: "USWDS",
      topicAreaId: "123",
      topicAreaName: "Public Safety",
      createdBy: "johndoe",
      updatedAt: new Date("2020-09-09 08:09"),
      widgets: [],
    },
  ];
  const wrapper = render(<DashboardsTable dashboards={dashboards} />, {
    wrapper: MemoryRouter,
  });
  expect(wrapper.container).toMatchSnapshot();
});

test("onSelect function is called when user selects dashboard", async () => {
  const dashboard: Dashboard = {
    id: "abc",
    name: "USWDS",
    topicAreaId: "123",
    topicAreaName: "Public Safety",
    createdBy: "johndoe",
    widgets: [],
  };

  const onSelect = jest.fn();
  const { getByLabelText } = render(
    <DashboardsTable onSelect={onSelect} dashboards={[dashboard]} />,
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
