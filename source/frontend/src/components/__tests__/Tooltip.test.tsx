import React from "react";
import { render } from "@testing-library/react";
import Tooltip from "../Tooltip";

test("renders a tooltip at the top (default)", async () => {
  const wrapper = render(<Tooltip id="test" uuid="test" />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a tooltip at the right", async () => {
  const wrapper = render(<Tooltip id="test" uuid="test" place="right" />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a tooltip at the bottom", async () => {
  const wrapper = render(<Tooltip id="test" uuid="test" place="bottom" />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders a tooltip at the left", async () => {
  const wrapper = render(<Tooltip id="test" uuid="test" place="left" />);
  expect(wrapper.container).toMatchSnapshot();
});
