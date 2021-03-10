import React from "react";
import { render } from "@testing-library/react";
import Header from "../Header";

test("renders a header", async () => {
  const wrapper = render(
    <Header>
      <p>Test</p>
    </Header>
  );
  expect(wrapper.container).toMatchSnapshot();
});
