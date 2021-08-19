import React from "react";
import { render } from "@testing-library/react";
import Logo from "../Logo";

jest.mock("../../hooks");

test("renders a logo", async () => {
  const wrapper = render(<Logo />);
  expect(wrapper.container).toMatchSnapshot();
});
