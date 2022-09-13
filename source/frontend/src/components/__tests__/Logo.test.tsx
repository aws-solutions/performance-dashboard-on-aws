import React from "react";
import { render } from "@testing-library/react";
import Logo from "../Logo";

test("renders a logo", async () => {
  const wrapper = render(<Logo />);
  expect(wrapper.container).toMatchSnapshot();
});

test("renders the logo with the alt text", () => {
  const wrapper = render(<Logo />);
  const image = wrapper.getByTestId("logoImage");

  expect(image.getAttribute("alt")).toBe("Organization logo");
});
