import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ColumnChartPreview from "../ColumnChartPreview";

jest.mock("../../hooks");

test("renders the title and summary of the column chart preview component", async () => {
  const { getByText } = render(
    <ColumnChartPreview
      title="test title"
      summary="test summary"
      columns={["test"]}
      data={[{ test: 1 }]}
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

test("renders the title and summary of the column chart preview component with the summary below the chart", async () => {
  const { getByText } = render(
    <ColumnChartPreview
      title="test title"
      summary="test summary"
      columns={["test"]}
      data={[{ test: 1 }]}
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
