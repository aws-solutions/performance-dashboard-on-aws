import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TablePreview from "../TablePreview";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

library.add(faCaretUp, faCaretDown);

test("renders the title and summary of the table preview component", async () => {
  const { getByText } = render(
    <TablePreview
      title="test title"
      summary="test summary"
      headers={["test"]}
    />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
  expect(getByText("test summary")).toBeInTheDocument();
});

test("table preview should match snapshot", async () => {
  const wrapper = render(
    <TablePreview
      title="test title"
      summary="test summary"
      headers={["test"]}
    />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("table should not crash when a column header is an empty string", async () => {
  const wrapper = render(
    <TablePreview
      title="test title"
      summary="test summary"
      headers={["", "something"]}
      data={[{ "": "foo", something: "bar" }]}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByText("foo")).toBeInTheDocument();
  expect(screen.getByText("bar")).toBeInTheDocument();
  expect(screen.getByText("something")).toBeInTheDocument();
});
