import React from "react";
import { render } from "@testing-library/react";
import PrimaryActionBar from "../PrimaryActionBar";

test("renders a primary action bar", async () => {
  const wrapper = render(
    <PrimaryActionBar className="bg-red">
      <p>Test</p>
    </PrimaryActionBar>
  );
  expect(wrapper.container).toMatchSnapshot();
});
