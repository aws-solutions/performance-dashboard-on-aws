import React from "react";
import { render } from "@testing-library/react";
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
