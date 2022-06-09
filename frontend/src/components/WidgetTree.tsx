import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { Widget } from "../models";
import WidgetTreeItem from "./WidgetTreeItem";
import OrderingService, { WidgetTreeData } from "../services/OrderingService";

interface Props {
  onClick: Function;
  onDelete?: Function;
  onDuplicate?: Function;
  onMoveUp?: Function;
  onMoveDown?: Function;
  onDrag?: Function;
  widgets: Array<Widget>;
}

function WidgetTree(props: Props) {
  const [tree, setTree] = useState<WidgetTreeData>({
    map: {},
    nodes: [],
  });

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    console.log(result);
    if (result.destination) {
      const widgets = OrderingService.mutateTree(
        tree,
        result.source.index,
        result.destination.index
      );
      if (widgets) {
        setTree(OrderingService.buildTree(widgets));
      }
    }
  };

  useEffect(() => {
    const newNodes = OrderingService.buildTree(props.widgets);
    setTree(newNodes);
  }, [props.widgets]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="padding-top-2 padding-bottom-2"
            >
              {tree.nodes.map((node) => {
                return <WidgetTreeItem key={node.id} {...node} />;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      }
    </DragDropContext>
  );
}

export default WidgetTree;
