import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MetricsWidget from "../MetricsWidget";

test("renders the title and summary of the metrics preview component", async () => {
  const { getByText } = render(
    <MetricsWidget
      title="test title"
      metrics={[]}
      metricPerRow={3}
      significantDigitLabels={true}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
});

test("metrics preview should match snapshot", async () => {
  const wrapper = render(
    <MetricsWidget
      title="test title"
      metrics={[{ title: "test title", value: 1 }]}
      metricPerRow={3}
      significantDigitLabels={true}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
