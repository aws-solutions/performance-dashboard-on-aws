import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "../Button";

test("renders a default button", async () => {
  const wrapper = render(<Button>Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a base button", async () => {
  const wrapper = render(<Button variant="base">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders an outline button", async () => {
  const wrapper = render(<Button variant="outline">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a secondary button", async () => {
  const wrapper = render(<Button variant="secondary">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders an accent button", async () => {
  const wrapper = render(<Button variant="accent">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders an unstyled button", async () => {
  const wrapper = render(<Button variant="unstyled">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a button with additional classNames", async () => {
  const wrapper = render(<Button className="banana">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a disabled button", async () => {
  const wrapper = render(<Button disabled>Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a submit button", async () => {
  const wrapper = render(<Button type="submit">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a reset button", async () => {
  const wrapper = render(<Button type="reset">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders aria-label attribute in button", async () => {
  const wrapper = render(<Button ariaLabel="For screen readers">Ok</Button>);
  expect(wrapper.container).toMatchSnapshot();
});

test("calls onClick function", async () => {
  const onClick = jest.fn();
  const { getByRole } = render(<Button onClick={onClick}>Ok</Button>);
  fireEvent.click(getByRole("button"));
  expect(onClick).toBeCalled();
});
