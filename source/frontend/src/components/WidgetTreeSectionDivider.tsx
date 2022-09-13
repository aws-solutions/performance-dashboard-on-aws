import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface WidgetTreeSectionDividerProps {
  id: string;
  dragIndex: number;
}

const WidgetTreeSectionDivider = ({
  id,
  dragIndex,
}: WidgetTreeSectionDividerProps) => {
  return (
    <Draggable draggableId={id} index={dragIndex}>
      {(provided) => {
        return (
          <div
            className="grid-row flex-1 bg-base-lightest flex-align-center flex-justify-center"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          ></div>
        );
      }}
    </Draggable>
  );
};

export default WidgetTreeSectionDivider;
