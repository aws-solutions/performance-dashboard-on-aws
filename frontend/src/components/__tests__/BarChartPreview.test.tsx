import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BarChartPreview from "../BarChartPreview";

test("renders the title and summary of the bar chart preview component", async () => {
  const { getByText } = render(
    <BarChartPreview
      title="test title"
      summary="test summary"
      bars={["test"]}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
});
