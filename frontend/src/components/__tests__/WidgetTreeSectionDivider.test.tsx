import React from "react";
import { render } from "@testing-library/react";
import WidgetTreeSectionDivider from "../WidgetTreeSectionDivider";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

test("renders the component", async () => {
  const wrapper = render(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="droppable">
        {(provided) => <WidgetTreeSectionDivider id="uuid" dragIndex={0} />}
      </Droppable>
    </DragDropContext>
  );
  expect(wrapper.container).toMatchSnapshot();
});
