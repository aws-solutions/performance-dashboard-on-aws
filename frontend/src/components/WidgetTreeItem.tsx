import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { WidgetType } from "../models";
import { WidgetTreeItemData } from "../services/OrderingService";

import WidgetTreeItemContent from "./WidgetTreeItemContent";
import WidgetTreeSectionDivider from "./WidgetTreeSectionDivider";

import styles from "./WidgetTreeItem.module.scss";

const WidgetTreeItem = (node: WidgetTreeItemData) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = React.useState(false);

  const widget = node.widget;
  return (
    <div>
      {widget && (
        <div>
          <Draggable draggableId={widget.id} index={node.dragIndex}>
            {(provided, snapshot) => {
              if (isDragging !== snapshot.isDragging) {
                setIsDragging(snapshot.isDragging);
              }
              return (
                <div {...provided.draggableProps} ref={provided.innerRef}>
                  <WidgetTreeItemContent
                    label={node.label}
                    widget={widget}
                    dragHandleProps={provided.dragHandleProps}
                  />
                  {snapshot.isDragging &&
                    widget.widgetType === WidgetType.Section && (
                      <div className="bg-base-lightest padding-left-4 padding-top-1 padding-bottom-8">
                        {node.children.length === 1 && (
                          <div className="grid-row flex-1 flex-align-center flex-justify-center">
                            <div className="margin-top-4 margin-bottom-neg-2 margin-bottom-0 flex-align-center">
                              {t("MoveInOut")}
                            </div>
                          </div>
                        )}
                        {node.children
                          .filter((child) => !!child.widget)
                          .map((child) => {
                            return (
                              <WidgetTreeItemContent
                                label={child.label}
                                widget={child.widget}
                              />
                            );
                          })}
                      </div>
                    )}
                </div>
              );
            }}
          </Draggable>
          {widget.widgetType === WidgetType.Section && (
            <div
              className={`bg-base-lightest padding-left-4 padding-top-1 padding-bottom-8 ${
                isDragging ? styles.hide : ""
              }`}
            >
              {node.children.length === 1 && (
                <div className="grid-row flex-1 flex-align-center flex-justify-center">
                  <div className="margin-top-4 margin-bottom-neg-2 margin-bottom-0 flex-align-center">
                    {t("MoveInOut")}
                  </div>
                </div>
              )}
              {node.children.map((child) => {
                return <WidgetTreeItem key={child.id} {...child} />;
              })}
            </div>
          )}
        </div>
      )}
      {!widget && (
        <WidgetTreeSectionDivider id={node.id} dragIndex={node.dragIndex} />
      )}
    </div>
  );
};

export default WidgetTreeItem;
