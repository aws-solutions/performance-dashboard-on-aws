import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  DragUpdate,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { Widget, WidgetType } from "../models";
import WidgetTreeItem from "./WidgetTreeItem";
import OrderingService, { WidgetTreeData } from "../services/OrderingService";
import { useTranslation } from "react-i18next";
import SecondaryActionBar from "./SecondaryActionBar";
import Button from "./Button";

interface Props {
  onClick: Function;
  onDelete: (widget: Widget) => void;
  onDuplicate: (widget: Widget) => void;
  onDrag: (widgets: Widget[]) => void;
  onMoveUp?: Function;
  onMoveDown?: Function;
  widgets: Array<Widget>;
}

function WidgetTree(props: Props) {
  const { t } = useTranslation();
  const droppableId = "widget-tree";
  const [tree, setTree] = useState<WidgetTreeData>({
    map: {},
    nodes: [],
  });
  const [isDropDisabled, setIsDropDisabled] = useState(false);

  const onDragUpdate = (update: DragUpdate) => {
    if (
      update.source.droppableId === droppableId &&
      update.destination &&
      update.destination.droppableId === droppableId
    ) {
      const startNode = tree.map[update.source.index];
      const endNode = tree.map[update.destination.index];
      const isDisabled =
        startNode &&
        endNode &&
        !!endNode.section &&
        startNode.widget?.widgetType === WidgetType.Section &&
        endNode.section !== startNode.id;
      if (isDisabled !== isDropDisabled) {
        setIsDropDisabled(isDisabled);
      }
    } else {
      setIsDropDisabled(false);
    }
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    setIsDropDisabled(false);
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const widgets = OrderingService.mutateTree(
      tree,
      source.index,
      destination.index
    );
    if (widgets) {
      setTree(OrderingService.buildTree(widgets));
      props.onDrag(widgets);
    }
  };

  useEffect(() => {
    const newNodes = OrderingService.buildTree(props.widgets);
    setTree(newNodes);
  }, [props.widgets]);

  return (
    <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
      {
        <Droppable droppableId={droppableId} isDropDisabled={false}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="padding-top-2 padding-bottom-2"
              role="list"
              aria-label={t("ContentItems")}
            >
              <hr className="margin-top-2 border-base-lightest" />
              <h2 className="margin-bottom-2 margin-top-2">
                {t("ContentItems")}
              </h2>
              {tree.nodes.map((node) => {
                return (
                  <WidgetTreeItem
                    key={node.id}
                    node={node}
                    isDropDisabled={isDropDisabled}
                    onDuplicate={props.onDuplicate}
                    onDelete={props.onDelete}
                  />
                );
              })}
              {provided.placeholder}
              {!props.widgets || props.widgets.length === 0 ? (
                <SecondaryActionBar className="text-center padding-5 margin-y-2">
                  <div>
                    <p>
                      {t("NoContentItems")} <br />
                      {t("ChartsTablesMore")}
                    </p>
                    <div className="text-center margin-top-4">
                      <Button
                        className="margin-top-1"
                        variant="base"
                        onClick={() => {
                          if (props.onClick) {
                            props.onClick();
                          }
                        }}
                      >
                        {t("PlusAddContentItem")}
                      </Button>
                    </div>
                  </div>
                </SecondaryActionBar>
              ) : (
                <div className="text-center margin-top-2">
                  <button
                    className="usa-button usa-button--base margin-top-1"
                    onClick={() => {
                      if (props.onClick) {
                        props.onClick();
                      }
                    }}
                  >
                    {t("PlusAddContentItem")}
                  </button>
                </div>
              )}
            </div>
          )}
        </Droppable>
      }
    </DragDropContext>
  );
}

export default WidgetTree;
