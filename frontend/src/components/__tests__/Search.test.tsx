import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import Search from "../Search";

test("renders a search input", () => {
  const wrapper = render(<Search id="search" />);
  expect(wrapper.container).toMatchSnapshot();
});

test("calls onSubmit when user presses search button", async () => {
  const onSearch = jest.fn();
  const { getByRole } = render(<Search id="search" onSubmit={onSearch} />);
  await act(async () => {
    fireEvent.click(getByRole("button"));
  });
  expect(onSearch).toBeCalled();
});
