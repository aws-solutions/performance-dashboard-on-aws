import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PartWholeChartPreview from "../PartWholeChartPreview";

test("renders the title of the bar chart preview component", async () => {
  const { getByText } = render(
    <PartWholeChartPreview title="test title" parts={["test"]} />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
});
