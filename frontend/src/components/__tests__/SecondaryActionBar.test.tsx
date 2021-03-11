import React from "react";
import { render } from "@testing-library/react";
import SecondaryActionBar from "../SecondaryActionBar";

test("renders a secondary action bar", async () => {
  const wrapper = render(
    <SecondaryActionBar stickyPosition={75}>
      <p>Test</p>
    </SecondaryActionBar>
  );
  expect(wrapper.container).toMatchSnapshot();
});
