import React from "react";
import { render } from "@testing-library/react";
import DropdownMenu from "../DropdownMenu";
import { MenuItem } from "@reach/menu-button";

test("renders a default dropdown menu", async () => {
  const wrapper = render(
    <DropdownMenu buttonText="Example text">
      <MenuItem onSelect={() => {}}> This is a menu item</MenuItem>
    </DropdownMenu>
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders an outlined menu button", async () => {
  const wrapper = render(
    <DropdownMenu buttonText="Example text" variant="outline">
      <MenuItem onSelect={() => {}}> This is a menu item</MenuItem>
    </DropdownMenu>
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a secondary menu button", async () => {
  const wrapper = render(
    <DropdownMenu buttonText="Example text" variant="secondary">
      <MenuItem onSelect={() => {}}> This is a menu item</MenuItem>
    </DropdownMenu>
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders an accent menu button", async () => {
  const wrapper = render(
    <DropdownMenu buttonText="Example text" variant="accent">
      <MenuItem onSelect={() => {}}> This is a menu item</MenuItem>
    </DropdownMenu>
  );
  expect(wrapper.container).toMatchSnapshot();
});

test("renders an unstyled menu button", async () => {
  const wrapper = render(
    <DropdownMenu buttonText="Example text" variant="unstyled">
      <MenuItem onSelect={() => {}}> This is a menu item</MenuItem>
    </DropdownMenu>
  );
  expect(wrapper.container).toMatchSnapshot();
});
