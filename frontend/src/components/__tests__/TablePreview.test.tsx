import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TablePreview from "../TablePreview";

test("renders the title of the table preview component", async () => {
  const { getByText } = render(
    <TablePreview title="test title" headers={["test"]} />,
    { wrapper: MemoryRouter }
  );
  expect(getByText("test title")).toBeInTheDocument();
});

test("table preview should match snapshot", async () => {
  const wrapper = render(
    <TablePreview title="test title" headers={["test"]} />,
    { wrapper: MemoryRouter }
  );
  expect(wrapper.container).toMatchSnapshot();
});
