import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ColumnChartPreview from "../ColumnChartPreview";

test("renders the title of the column chart preview component", async () => {
  const { getByText } = render(
    <ColumnChartPreview title="test title" columns={["test"]} />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
});
