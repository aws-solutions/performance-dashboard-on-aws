import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TablePreview from "../TablePreview";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

library.add(faCaretUp, faCaretDown);

test("renders the table title", async () => {
  render(
    <TablePreview
      title="test title"
      summary="test summary"
      headers={["test"]}
      summaryBelow={false}
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
    <TablePreview
      title="test title"
      summary="test summary"
      headers={["test"]}
      summaryBelow={true}
    />,
    { wrapper: MemoryRouter }
  );
  const summary = screen.getByText("test summary");
  expect(summary).toBeInTheDocument();
  expect(summary.closest("div")).toHaveClass("tableSummaryBelow");
});

test("table preview should match snapshot", async () => {
  const wrapper = render(
    <TablePreview
      title="test title"
      summary="test summary"
      headers={["test"]}
      summaryBelow={false}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("table should not crash when a column header is an empty string", async () => {
  render(
    <TablePreview
      title="test title"
      summary="test summary"
      headers={["", "something"]}
      data={[{ "": "foo", something: "bar" }]}
      summaryBelow={false}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByText("foo")).toBeInTheDocument();
  expect(screen.getByText("bar")).toBeInTheDocument();
  expect(screen.getByText("something")).toBeInTheDocument();
});
