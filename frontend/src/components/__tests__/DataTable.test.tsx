import React from "react";
import {
  ColumnDataType,
  ColumnMetadata,
  CurrencyDataType,
  NumberDataType,
} from "../../models";
import { render, fireEvent, screen } from "@testing-library/react";
import DataTable from "../DataTable";
import userEvent from "@testing-library/user-event";

const columns = ["year", "sales", "revenue"];
const rows = [
  {
    year: 2015,
    sales: 10000,
    revenue: 34,
  },
  {
    year: 2016,
    sales: 45000,
    revenue: 74,
  },
  {
    year: 2017,
    sales: 56000,
    revenue: 23,
  },
];

const columnsMetadata: ColumnMetadata[] = [
  {
    columnName: "year",
    dataType: ColumnDataType.Text,
    hidden: false,
  },
  {
    columnName: "sales",
    dataType: ColumnDataType.Number,
    numberType: NumberDataType.Currency,
    currencyType: CurrencyDataType["Dollar $"],
    hidden: false,
  },
  {
    columnName: "revenue",
    dataType: ColumnDataType.Number,
    numberType: NumberDataType.Percentage,
    hidden: false,
  },
];

const fileName = "test-file-name";

beforeEach(() => {
  render(
    <DataTable
      rows={rows}
      columns={columns}
      columnsMetadata={columnsMetadata}
      fileName={"test-file-name"}
    />
  );
});

test("table should be hidden by default", async () => {
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

test("shows and hides table when button is clicked", async () => {
  const showTableBtn = screen.getByText("Show data table");
  userEvent.click(showTableBtn);
  expect(screen.getByRole("table")).toBeInTheDocument();

  const hideTableBtn = screen.getByText("Hide data table");
  userEvent.click(hideTableBtn);
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

test("displays a table with values properly formatted", async () => {
  const showTableBtn = screen.getByText("Show data table");
  userEvent.click(showTableBtn);

  // Years should be formatted as text as per ColumnMetadata, without comma separators
  expect(screen.getByText("2015")).toBeInTheDocument();
  expect(screen.getByText("2016")).toBeInTheDocument();
  expect(screen.getByText("2017")).toBeInTheDocument();

  // Sales column should be formatted as currency
  expect(screen.getByText("$10,000.00")).toBeInTheDocument();
  expect(screen.getByText("$45,000.00")).toBeInTheDocument();
  expect(screen.getByText("$56,000.00")).toBeInTheDocument();

  // Revenue column should be formatted as percentage
  expect(screen.getByText("34%")).toBeInTheDocument();
  expect(screen.getByText("74%")).toBeInTheDocument();
  expect(screen.getByText("23%")).toBeInTheDocument();
});
