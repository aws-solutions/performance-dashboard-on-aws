import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactUs from "../ContactUs";

test("renders the component", async () => {
  const wrapper = render(<ContactUs />, { wrapper: MemoryRouter });
  expect(wrapper.container).toMatchSnapshot();
});
