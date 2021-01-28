import React from "react";
import { render } from "@testing-library/react";
import { WidgetType, MetricsWidget } from "../../models";
import MetricsWidgetComponent from "../MetricsWidget";

jest.mock("../../hooks");
window.URL.createObjectURL = jest.fn();

const metrics: MetricsWidget = {
  id: "123",
  name: "Test metrics",
  dashboardId: "abc",
  updatedAt: new Date(),
  widgetType: WidgetType.Metrics,
  order: 0,
  showTitle: true,
  content: {
    title: "Test metrics",
    s3Key: {
      raw: "123.json",
      json: "123.json",
    },
    datasetId: "123",
    oneMetricPerRow: false,
  },
};

test("renders an metrics with title", async () => {
  const { getByText } = render(<MetricsWidgetComponent widget={metrics} />);
  expect(getByText("Test metrics")).toBeInTheDocument();
});
