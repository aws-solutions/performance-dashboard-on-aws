import React from "react";
import { render, within } from "@testing-library/react";
import Tabs from "../Tabs";
import { MemoryRouter } from "react-router-dom";

test("renders the Tabs component", async () => {
  const wrapper = render(
    <Tabs defaultActive="Tab 1">
      <div label="Tab 1">Tab 1</div>
      <div label="Tab 2">Tab 2</div>
    </Tabs>
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders the Tabs component with default tab 2 selected", async () => {
  const wrapper = render(
    <Tabs defaultActive="Tab 2">
      <div label="Tab 1">Tab 1</div>
      <div label="Tab 2">Tab 2</div>
    </Tabs>
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders the tabs", async () => {
  const { getAllByRole } = render(
    <Tabs defaultActive="Tab 2">
      <div label="Tab 1">Tab 1</div>
      <div label="Tab 2">Tab 2</div>
    </Tabs>,
    {
      wrapper: MemoryRouter,
    }
  );

  const listItems = getAllByRole("listitem");
  expect(listItems).toHaveLength(2);

  listItems.forEach((item, index) => {
    const { getByText } = within(item);
    expect(getByText(`Tab ${index + 1}`)).toBeInTheDocument();
  });
});
