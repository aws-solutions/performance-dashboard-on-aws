import React from "react";
import { render } from "@testing-library/react";
import ContentItem from "../ContentItem";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

test("renders a content item", async () => {
  const wrapper = render(
    <DndProvider backend={HTML5Backend}>
      <ContentItem
        className="margin-y-1"
        id="test"
        index={0}
        moveWidget={() => {}}
        onDrop={() => {}}
      >
        <p>Test</p>
      </ContentItem>
    </DndProvider>
  );
  expect(wrapper.container).toMatchSnapshot();
});
