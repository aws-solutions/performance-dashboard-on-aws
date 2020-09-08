import React from "react";
import { render } from "@testing-library/react";
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
      widgets: [],
    },
  ];
  const wrapper = render(<DashboardsTable dashboards={dashboards} />, {
    wrapper: MemoryRouter,
  });
  expect(wrapper.container).toMatchSnapshot();
});
