import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import Search from "../Search";

test("renders a small search input", () => {
  const wrapper = render(<Search id="search" size="small" />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a big input", () => {
  const wrapper = render(<Search id="search" size="big" />);
  expect(wrapper.container).toMatchSnapshot();
});

test("calls onSubmit when user presses search button", async () => {
  const onSearch = jest.fn();
  const { getByRole } = render(
    <Search id="search" onSubmit={onSearch} size="small" />
  );
  await act(async () => {
    fireEvent.click(getByRole("button"));
  });
  expect(onSearch).toBeCalled();
});
