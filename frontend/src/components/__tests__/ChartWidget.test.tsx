import React from "react";
import { render } from "@testing-library/react";
import { ChartType, WidgetType, ChartWidget } from "../../models";
import ChartWidgetComponent from "../ChartWidget";

jest.mock("../../hooks");

const chart: ChartWidget = {
  id: "123",
  name: "Bananas chart",
  dashboardId: "abc",
  updatedAt: new Date(),
  widgetType: WidgetType.Chart,
  order: 0,
  showTitle: true,
  content: {
    chartType: ChartType.LineChart,
    title: "Bananas chart",
    datasetId: "0000",
    summary: "test summary",
    s3Key: {
      json: "123.json",
      raw: "123.csv",
    },
    summaryBelow: false,
    columnsMetadata: [],
  },
};

test("renders a chart with title", async () => {
  const { getByText } = render(<ChartWidgetComponent widget={chart} />);
  expect(getByText("Bananas chart")).toBeInTheDocument();
});
