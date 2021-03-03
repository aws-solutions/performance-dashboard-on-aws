import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PartWholeChartWidget from "../PartWholeChartWidget";

test("renders the chart title", async () => {
  render(
    <PartWholeChartWidget
      title="test title"
      summary="test summary"
      parts={["test"]}
      summaryBelow={false}
      data={[{}]}
    />,
    { wrapper: MemoryRouter }
  );
  expect(screen.getByText("test title")).toBeInTheDocument();
});

test("renders the summary above the chart", async () => {
  render(
    <PartWholeChartWidget
      title="test title"
      summary="test summary"
      parts={["test"]}
      summaryBelow={false}
      data={[{}]}
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
      title="test title"
      summary="test summary"
      parts={["test"]}
      summaryBelow={true}
      data={[{}]}
    />,
    { wrapper: MemoryRouter }
  );

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("chartSummaryBelow");
});
