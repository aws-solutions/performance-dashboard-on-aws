import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PartWholeChartPreview from "../PartWholeChartPreview";

jest.mock("../../hooks");

test("renders the title and summary of part whole chart preview component", async () => {
  const { getByText } = render(
    <PartWholeChartPreview
      title="test title"
      summary="test summary"
      parts={["test"]}
      summaryBelow={false}
      data={[{}]}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
  expect(getByText("test summary").nextSibling).toHaveClass(
    "recharts-responsive-container"
  );
});

test("renders the part whole chart preview component with the summary below the chart", async () => {
  const { getByText } = render(
    <PartWholeChartPreview
      title="test title"
      summary="test summary"
      parts={["test"]}
      summaryBelow={true}
      data={[{}]}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
  expect(getByText("test summary").previousSibling).toHaveClass(
    "recharts-responsive-container"
  );
});
