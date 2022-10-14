import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BarChartWidget from "../BarChartWidget";

test("renders the chart title", async () => {
  render(
    <BarChartWidget
      id="bar-chart"
      title="test title"
      downloadTitle="test title"
      summary="test summary"
      bars={["test"]}
      data={[{ col: "column name", test: 1 }]}
      summaryBelow={false}
      columnsMetadata={[]}
      significantDigitLabels={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(screen.getByText("test title")).toBeInTheDocument();
});

test("renders chart summary above the chart", async () => {
  render(
    <BarChartWidget
      id="bar-chart"
      title="test title"
      downloadTitle="test title"
      summary="test summary"
      bars={["test"]}
      data={[{ col: "column name", test: 1 }]}
      summaryBelow={false}
      columnsMetadata={[]}
      significantDigitLabels={false}
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("chartSummaryAbove");
});

test("renders chart summary below the chart", async () => {
  render(
    <BarChartWidget
      id="bar-chart"
      title="test title"
      downloadTitle="test title"
      summary="test summary"
      bars={["test"]}
      data={[{ col: "column name", test: 1 }]}
      summaryBelow={true}
      columnsMetadata={[]}
      significantDigitLabels={false}
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("chartSummaryBelow");
});
