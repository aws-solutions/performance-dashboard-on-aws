import React from "react";
import { render } from "@testing-library/react";
import ContentItem from "../ContentItem";

test("renders a content item", async () => {
  const wrapper = render(
    <ContentItem>
      <p>Test</p>
    </ContentItem>
  );
  expect(wrapper.container).toMatchSnapshot();
});
