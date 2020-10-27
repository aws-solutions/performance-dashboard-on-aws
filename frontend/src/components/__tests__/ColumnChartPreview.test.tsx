import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ColumnChartPreview from "../ColumnChartPreview";

test("renders the title and summary of the column chart preview component", async () => {
  const { getByText } = render(
    <ColumnChartPreview
      title="test title"
      summary="test summary"
      columns={["test"]}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
});
