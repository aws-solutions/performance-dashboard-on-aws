import React, { ReactNode, useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";

interface Props {
  children: ReactNode;
  className?: string;
  id: any;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  itemType: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ContentItem = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: props.itemType,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      props.moveItem(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: props.itemType,
    item: { index: props.index, id: props.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.9 : 1;

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${
        isDragging ? "usa-focus " : ""
      }border-base-lighter border-1px shadow-1 z-200 radius-lg bg-white ${
        props.className
      }`}
      style={{ opacity, cursor: "pointer" }}
    >
      {props.children}
    </div>
  );
};

export default ContentItem;
