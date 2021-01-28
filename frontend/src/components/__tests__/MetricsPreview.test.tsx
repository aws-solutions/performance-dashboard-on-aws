import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MetricsPreview from "../MetricsPreview";

test("renders the title and summary of the metrics preview component", async () => {
  const { getByText } = render(
    <MetricsPreview title="test title" metrics={[]} metricPerRow={3} />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
});

test("metrics preview should match snapshot", async () => {
  const wrapper = render(
    <MetricsPreview
      title="test title"
      metrics={[{ title: "test title", value: 1 }]}
      metricPerRow={3}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
