/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  DragStart,
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
  widgets: Array<Widget>;
}

function WidgetTree(props: Props) {
  const { t } = useTranslation();
  const droppableId = "widget-tree";
  const [tree, setTree] = useState<WidgetTreeData>();
  const [isDropDisabled, setIsDropDisabled] = useState(false);

  const onDragStarted = (start: DragStart, provided: ResponderProvided) => {
    if (!tree) {
      return;
    }
    const source = tree.map[start.source.index];
    provided.announce(
      t("WidgetTree.ItemLifted", {
        label: source?.label,
        name: source?.widget?.name,
      })
    );
  };

  const onDragUpdate = (update: DragUpdate, provided: ResponderProvided) => {
    if (!tree) {
      return;
    }

    const source = tree.map[update.source.index];
    if (
      update.source.droppableId === droppableId &&
      update.destination &&
      update.destination.droppableId === droppableId
    ) {
      const destination = tree.map[update.destination.index];
      provided.announce(
        t("WidgetTree.ItemMoved", {
          sourceLabel: source?.label,
          sourceName: source?.widget?.name,
          destinationLabel: destination?.label,
          destinationName: destination?.widget?.name,
        })
      );
      const isDisabled =
        source &&
        destination &&
        !!destination.section &&
        source.widget?.widgetType === WidgetType.Section &&
        destination.section !== source.id;
      if (isDisabled !== isDropDisabled) {
        setIsDropDisabled(isDisabled);
      }
    } else {
      provided.announce(
        t("WidgetTree.OutsideTheDroppableAreaError", {
          label: source?.label,
          name: source?.widget?.name,
        })
      );
      setIsDropDisabled(false);
    }
  };

  const moveWidget = (sourceIndex: number, destinationIndex: number): void => {
    if (!tree) {
      return;
    }
    if (sourceIndex < 0) {
      sourceIndex = 0;
    }
    if (destinationIndex >= tree.nodes.length) {
      destinationIndex = tree.nodes.length - 1;
    }

    const widgets = OrderingService.moveWidget(
      tree,
      sourceIndex,
      destinationIndex
    );
    if (widgets) {
      setTree(OrderingService.buildTree(widgets));
      props.onDrag(widgets);
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
    const sourceItem = tree?.map[source.index];
    const destinationItem = tree?.map[destination.index];
    moveWidget(source.index, destination.index);

    provided.announce(
      t("WidgetTree.ItemDropped", {
        sourceLabel: sourceItem?.label,
        sourceName: sourceItem?.widget?.name,
        destinationLabel: destinationItem?.label,
        destinationName: destinationItem?.widget?.name,
      })
    );
  };

  useEffect(() => {
    const newNodes = OrderingService.buildTree(props.widgets);
    setTree(newNodes);
  }, [props.widgets]);

  return (
    <DragDropContext
      onDragStart={onDragStarted}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
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
              {tree?.nodes.map((node) => {
                return (
                  <WidgetTreeItem
                    key={node.id}
                    node={node}
                    isDropDisabled={isDropDisabled}
                    onDuplicate={props.onDuplicate}
                    onDelete={props.onDelete}
                    onMove={moveWidget}
                    canMoveUp={node.dragIndex > 0}
                    canMoveDown={node.dragIndex < tree.length - 1}
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
                        ariaLabel={t("PlusAddContentItem")}
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
                    aria-label={t("PlusAddContentItem")}
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
