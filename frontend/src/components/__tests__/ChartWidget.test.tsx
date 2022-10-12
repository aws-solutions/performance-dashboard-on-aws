import React from "react";
import { render } from "@testing-library/react";
import { ChartType, WidgetType, ChartWidget } from "../../models";
import ChartWidgetComponent from "../ChartWidget";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../hooks");

const { ResizeObserver } = window;

beforeEach(() => {
  //@ts-ignore
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

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
    significantDigitLabels: false,
    dataLabels: false,
    showTotal: true,
    computePercentages: false,
  },
};

test("renders a chart with title", async () => {
  const { getByText } = render(
    <MemoryRouter>
      <ChartWidgetComponent widget={chart} />
    </MemoryRouter>
  );
  expect(getByText("Bananas chart")).toBeInTheDocument();
});
