import React from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { Widget, WidgetType } from "../models";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import Link from "./Link";
import { useTranslation } from "react-i18next";
import WidgetTreeActionMenu from "./WidgetTreeActionMenu";

interface WidgetTreeItemContentProps {
  label: string;
  widget: Widget;
  dragHandleProps?: DraggableProvidedDragHandleProps | undefined;
}

const WidgetTreeItemContent = ({
  label,
  widget,
  dragHandleProps,
}: WidgetTreeItemContentProps) => {
  const { t } = useTranslation();

  return (
    <div className="border-base-lighter border-1px shadow-1 z-200 radius-lg bg-white grid-col margin-top-1">
      <div className="grid-row flex-1">
        <div className="grid-row grid-col flex-1 padding-1">
          <div
            className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center margin-left-2 margin-right-1 margin-top-1 margin-bottom-1"
            {...dragHandleProps}
          >
            <FontAwesomeIcon icon={faGripVertical} size="1x" />
          </div>
          <div className="grid-col flex-6 text-center display-flex flex-align-center flex-justify-center font-sans-md margin-left-2 margin-top-1 margin-bottom-1">
            {label}
          </div>
          {/* <div className="grid-col flex-4 grid-row flex-column text-center margin-left-2 margin-right-2">
                    <div className="grid-col flex-6">
                      {index > 0 ? (
                        <Button
                          variant="unstyled"
                          className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                          ariaLabel={t("MoveContentItemUp", {
                            name: widget.name,
                          })}
                          onClick={() => onMoveUp(index)}
                          ref={caretUpRefs[index]}
                        >
                          <FontAwesomeIcon
                            id={`${widget.id}-move-up`}
                            size="xs"
                            icon={faArrowUp}
                          />
                        </Button>
                      ) : (
                        <br />
                      )}
                    </div>
                    <div className="grid-col flex-6">
                      {index < props.widgets.length - 1 &&
                      props.widgets.some((w, i) => !w.section && i > index) ? (
                        <Button
                          variant="unstyled"
                          className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                          ariaLabel={t("MoveContentItemDown", {
                            name: widget.name,
                          })}
                          onClick={() => onMoveDown(index)}
                          ref={caretDownRefs[index]}
                        >
                          <FontAwesomeIcon
                            id={`${widget.id}-move-down`}
                            size="xs"
                            icon={faArrowDown}
                          />
                        </Button>
                      ) : (
                        <br />
                      )}
                    </div>
                  </div> */}
        </div>
        <div className="border-base-lighter border-left"></div>
        <div className="grid-col flex-11 grid-row padding-1 margin-y-1">
          <div
            className="grid-col flex-8 usa-tooltip"
            data-position="bottom"
            title={widget.name}
          >
            <div className="margin-left-1 text-no-wrap overflow-hidden text-overflow-ellipsis text-bold">
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
          <div className="grid-col flex-3 text-italic text-right">
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
  );
};

export default WidgetTreeItemContent;
