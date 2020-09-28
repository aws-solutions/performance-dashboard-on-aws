import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BarChartPreview from "../BarChartPreview";

test("renders the title of the bar chart preview component", async () => {
  const { getByText } = render(
    <BarChartPreview title="test title" bars={["test"]} />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
});
