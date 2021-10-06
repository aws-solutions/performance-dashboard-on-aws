import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TableWidget from "../TableWidget";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

library.add(faCaretUp, faCaretDown);

test("renders the table title", async () => {
  render(
    <TableWidget
      title="test title"
      summary="test summary"
      data={[
        {
          id: "1",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      summaryBelow={false}
      columnsMetadata={[]}
      significantDigitLabels={false}
      displayWithPages={false}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByText("test title")).toBeInTheDocument();

  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("tableSummaryAbove");
});

test("renders the summary below the chart", async () => {
  render(
    <TableWidget
      title="test title"
      summary="test summary"
      data={[
        {
          id: "1",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      summaryBelow={true}
      columnsMetadata={[]}
      significantDigitLabels={false}
      displayWithPages={false}
    />,
    { wrapper: MemoryRouter }
  );
  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("tableSummaryBelow");
});

test("table preview should match snapshot", async () => {
  const wrapper = render(
    <TableWidget
      title="test title"
      summary="test summary"
      data={[
        {
          id: "1",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      summaryBelow={false}
      columnsMetadata={[]}
      significantDigitLabels={false}
      displayWithPages={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("table should not crash when a column header is an empty string", async () => {
  render(
    <TableWidget
      title="test title"
      summary="test summary"
      data={[
        {
          id: "",
          name: "Banana",
          updatedAt: "2021-11-11",
        },
        {
          id: "2",
          name: "Chocolate",
          updatedAt: "2020-11-11",
        },
        {
          id: "3",
          name: "Vanilla",
          updatedAt: "2019-11-11",
        },
      ]}
      summaryBelow={false}
      columnsMetadata={[]}
      significantDigitLabels={false}
      displayWithPages={false}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByText("Banana")).toBeInTheDocument();
  expect(screen.getByText("Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Vanilla")).toBeInTheDocument();
});
