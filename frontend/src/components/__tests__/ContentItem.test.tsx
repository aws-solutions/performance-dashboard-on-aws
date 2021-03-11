import React from "react";
import { render } from "@testing-library/react";
import ContentItem from "../ContentItem";

test("renders a content item", async () => {
  const wrapper = render(
    <ContentItem className="margin-y-1">
      <p>Test</p>
    </ContentItem>
  );
  expect(wrapper.container).toMatchSnapshot();
});
