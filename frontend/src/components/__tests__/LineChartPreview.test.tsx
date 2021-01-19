import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LineChartPreview from "../LineChartPreview";

test("renders the title and summary of the line chart preview component", async () => {
  const { getByText } = render(
    <LineChartPreview
      title="test title"
      summary="test summary"
      lines={["test"]}
      summaryBelow={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
  expect(getByText("test summary").nextSibling).toHaveClass(
    "recharts-responsive-container"
  );
});

test("renders the line chart preview component with the summary below the chart", async () => {
  const { getByText } = render(
    <LineChartPreview
      title="test title"
      summary="test summary"
      lines={["test"]}
      summaryBelow={true}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
  expect(getByText("test summary").previousSibling).toHaveClass(
    "recharts-responsive-container"
  );
});
