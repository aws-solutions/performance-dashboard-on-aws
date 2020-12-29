import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardHeader from "../DashboardHeader";

test("renders a dashboard header for a published view", async () => {
  const wrapper = render(
    <DashboardHeader
      name="Dashboard 1"
      topicAreaName="Test Topic Area"
      description="A test descripttion"
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a dashboard header for an unpublished view", async () => {
  const wrapper = render(
    <DashboardHeader
      name="Dashboard 1"
      topicAreaName="Test Topic Area"
      description="A test descripttion"
      unpublished
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a dashboard header for an unpublished view with a link", async () => {
  const wrapper = render(
    <DashboardHeader
      name="Dashboard 1"
      topicAreaName="Test Topic Area"
      description="A test descripttion"
      unpublished
      link="A test link"
    />
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a dashboard header with lastUpdatedDate", async () => {
  const wrapper = render(
    <DashboardHeader
      name="Dashboard 1"
      topicAreaName="Bananas"
      description="A test descripttion"
      lastUpdated={new Date("2020-01-01T00:00:00Z")}
      unpublished
      link="A test link"
    />
  );

  expect(
    screen.getByText("Bananas | Last updated 2019-12-31 16:00")
  ).toBeInTheDocument();
});
