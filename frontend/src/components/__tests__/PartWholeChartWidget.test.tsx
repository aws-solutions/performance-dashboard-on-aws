import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PartWholeChartWidget from "../PartWholeChartWidget";

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

test("renders the chart title", async () => {
  render(
    <PartWholeChartWidget
      id="part-chart"
      title="test title"
      downloadTitle="test title"
      summary="test summary"
      parts={["test"]}
      summaryBelow={false}
      data={[{}]}
      significantDigitLabels={false}
      columnsMetadata={[]}
    />,
    { wrapper: MemoryRouter }
  );
  expect(screen.getByText("test title")).toBeInTheDocument();
});

test("renders the summary above the chart", async () => {
  render(
    <PartWholeChartWidget
      id="part-chart"
      title="test title"
      downloadTitle="test title"
      summary="test summary"
      parts={["test"]}
      summaryBelow={false}
      data={[{}]}
      significantDigitLabels={false}
      columnsMetadata={[]}
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("chartSummaryAbove");
});

test("renders the summary below the chart", async () => {
  render(
    <PartWholeChartWidget
      id="part-chart"
      title="test title"
      downloadTitle="test title"
      summary="test summary"
      parts={["test"]}
      summaryBelow={true}
      data={[{}]}
      significantDigitLabels={false}
      columnsMetadata={[]}
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("chartSummaryBelow");
});
