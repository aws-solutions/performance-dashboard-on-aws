import React from "react";
import { render } from "@testing-library/react";
import { WidgetType, TableWidget } from "../../models";
import TableWidgetComponent from "../TableWidget";

jest.mock("../../hooks");

const table: TableWidget = {
  id: "123",
  name: "Bananas table",
  dashboardId: "abc",
  updatedAt: new Date(),
  widgetType: WidgetType.Table,
  order: 0,
  showTitle: true,
  content: {
    title: "Bananas table",
    summary: "This is a banana table",
    summaryBelow: false,
    datasetId: "0000",
    s3Key: {
      json: "123.json",
      raw: "123.csv",
    },
  },
};

test("renders a table with title", async () => {
  const { getByText } = render(<TableWidgetComponent widget={table} />);
  expect(getByText("Bananas table")).toBeInTheDocument();
});
