import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { Widget, WidgetType } from "../models";
import Button from "./Button";
import Link from "./Link";
import WidgetTreeActionMenu from "./WidgetTreeActionMenu";

import styles from "./WidgetTreeSubItem.module.scss";

interface WidgetTreeSubItemProps {
  droppableId: string;
  rowIndex: number;
  childIndex: number;
  widget: Widget;
}

const WidgetTreeSubItem = (props: WidgetTreeSubItemProps) => {
  const { t } = useTranslation();
  const widget = props.widget;
  return (
    <div>
      <Draggable draggableId={props.widget.id} index={props.childIndex}>
        {(provided) => (
          <div
            className="border-base-lighter border-1px shadow-1 z-200 radius-lg bg-white grid-col margin-top-1 margin-bottom-1 margin-left-2 margin-right-neg-05em"
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className="grid-row flex-1">
              <div className="grid-row grid-col flex-1 padding-1">
                <div
                  className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center margin-left-2 margin-right-2 margin-top-1 margin-bottom-1"
                  {...provided.dragHandleProps}
                >
                  <FontAwesomeIcon icon={faGripVertical} size="1x" />
                </div>
                <div className="grid-col flex-6 text-center display-flex flex-align-center flex-justify-center font-sans-md margin-left-2 margin-top-1 margin-bottom-1">
                  {`${props.rowIndex + 1}.${props.childIndex + 1}`}
                </div>
                {/* <div className="grid-col flex-4 grid-row flex-column text-center margin-left-2 margin-right-1">
                  <div className="grid-col flex-6">
                    <Button
                      variant="unstyled"
                      className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                      ariaLabel={t("MoveContentItemUp", {
                        name: widget.name,
                      })}
                      onClick={() => onMoveUp(arrIndex)}
                      ref={caretUpRefs[arrIndex]}
                    >
                      <FontAwesomeIcon
                        id={`${widget.id}-move-up`}
                        size="xs"
                        icon={faArrowUp}
                      />
                    </Button>
                  </div>
                  <div className="grid-col flex-6">
                    <Button
                      variant="unstyled"
                      className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                      ariaLabel={t("MoveContentItemDown", {
                        name: widget.name,
                      })}
                      onClick={() => onMoveDown(arrIndex)}
                      ref={caretDownRefs[arrIndex]}
                    >
                      <FontAwesomeIcon
                        id={`${widget.id}-move-down`}
                        size="xs"
                        icon={faArrowDown}
                      />
                    </Button>
                  </div>
                </div> */}
              </div>
              <div className="border-base-lighter border-left"></div>
              <div className="grid-col flex-11 grid-row padding-1 margin-y-1">
                <div
                  className="grid-col flex-11 usa-tooltip"
                  data-position="bottom"
                  title={widget.name}
                >
                  <div className="margin-left-1 text-base text-no-wrap overflow-hidden text-overflow-ellipsis text-bold">
                    <Link
                      ariaLabel={t("EditContent", {
                        name: widget.name,
                      })}
                      to={`/admin/dashboard/${
                        widget.dashboardId
                      }/edit-${widget.widgetType.toLowerCase()}/${widget.id}`}
                    >
                      {widget.name}
                    </Link>
                  </div>
                </div>
                <div className="grid-col flex-3 text-italic text-right margin-right-2">
                  {`(${t(
                    widget.widgetType === WidgetType.Chart
                      ? widget.content.chartType
                      : widget.widgetType
                  )})`}
                </div>
                <div className="grid-col flex-1 margin-left-2 margin-right-2 text-right">
                  {WidgetTreeActionMenu(widget)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </div>
  );
};

export default WidgetTreeSubItem;
