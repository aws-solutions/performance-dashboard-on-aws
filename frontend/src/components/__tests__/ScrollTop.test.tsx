import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ScrollTop from "../ScrollTop";

test("renders a button to scroll to top", async () => {
  const { getByRole } = render(<ScrollTop />);
  expect(getByRole("button")).toBeInTheDocument();
});

test("renders a button to scroll to top", async () => {
  window.scrollTo = jest.fn();
  const { getByRole } = render(<ScrollTop />);
  fireEvent.click(getByRole("button"));
  expect(window.scrollTo).toBeCalledWith(0, 0);
});
