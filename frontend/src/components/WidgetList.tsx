import React, { createRef, useCallback } from "react";
import { Widget, WidgetType } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLines,
  faEllipsisV,
  faArrowUp,
  faArrowDown,
  faTrash,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import "./WidgetList.scss";
import Link from "./Link";
import SecondaryActionBar from "./SecondaryActionBar";
import ContentItem from "./ContentItem";
import { useTranslation } from "react-i18next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import DropdownMenu from "./DropdownMenu";
import { MenuItem } from "@reach/menu-button";

interface Props {
  onClick: Function;
  onDelete?: Function;
  onDuplicate?: Function;
  onMoveUp?: Function;
  onMoveDown?: Function;
  onDrag?: Function;
  widgets: Array<Widget>;
}

function WidgetList(props: Props) {
  const { t } = useTranslation();
  const caretUpRefs = props.widgets.map(() => createRef<HTMLButtonElement>());
  const caretDownRefs = props.widgets.map(() => createRef<HTMLButtonElement>());

  const onDelete = (widget: Widget) => {
    if (props.onDelete) {
      props.onDelete(widget);
    }
  };

  const onDuplicate = (widget: Widget) => {
    if (props.onDuplicate) {
      props.onDuplicate(widget);
    }
  };

  const onMoveDown = (index: number) => {
    if (props.onMoveDown) {
      setNextFocus(index, "Down");
      props.onMoveDown(index);
    }
  };

  const onMoveUp = (index: number) => {
    if (props.onMoveUp) {
      setNextFocus(index, "Up");
      props.onMoveUp(index);
    }
  };

  const onDrag = useCallback(
    (index: number, newIndex: number) => {
      if (props.onDrag) {
        props.onDrag(index, newIndex);
      }
    },
    [props]
  );

  const setNextFocus = (index: number, direction: "Up" | "Down") => {
    let ref;
    /**
     * When moving a widget up or down, the focus should follow the
     * widget to its new position in the list. Determining the new
     * position depends on whether the widget is moving up or down
     * and if the widget has reached a boundary (i.e. beginning or
     * end of the list), in which case the focus should swap to the
     * opposite caret (careUp vs caretDown).
     *
     * We may not need this logic when we implement drag-n-drop
     * because most of the existing libraries already handle browser
     * focus when moving DOM objects.
     */
    if (direction === "Up") {
      ref = index === 1 ? caretDownRefs[1] : caretUpRefs[index];
    } else {
      const secondLast = props.widgets.length - 2;
      ref =
        index === secondLast ? caretUpRefs[secondLast] : caretDownRefs[index];
    }

    if (ref.current) {
      ref.current.focus();
    }
  };

  function ActionMenu(widget: Widget) {
    return (
      <DropdownMenu
        buttonText=""
        icon={faEllipsisV}
        variant="unstyled"
        ariaLabel={t("ActionsContent", {
          name: widget.name,
        })}
      >
        <MenuItem>
          <Button
            variant="unstyled"
            ariaLabel={t("CopyContent", {
              name: widget.name,
            })}
            onClick={() => onDuplicate(widget)}
          >
            <FontAwesomeIcon
              size="xs"
              icon={faCopy}
              className="margin-right-1"
            />
            {t("Copy")}
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            variant="unstyled"
            className="usa-link"
            ariaLabel={t("DeleteContent", {
              name: widget.name,
            })}
            onClick={() => onDelete(widget)}
          >
            <FontAwesomeIcon
              size="xs"
              icon={faTrash}
              className="margin-right-1"
            />
            {t("Delete")}
          </Button>
        </MenuItem>
      </DropdownMenu>
    );
  }

  const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragItem = props.widgets[dragIndex];
    if (dragItem) {
      onDrag(dragIndex, hoverIndex);
    }
  }, (7000)[(props.widgets, onDrag)]);

  let sectionCount: 0;
  return (
    <div>
      {props.widgets && props.widgets.length ? (
        <div>
          <hr className="margin-top-2 border-base-lightest" />
          <h2 className="margin-bottom-2 margin-top-2">{t("ContentItems")}</h2>
          <DndProvider
            backend={window.innerWidth < 1024 ? TouchBackend : HTML5Backend}
            options={{ enableMouseEvents: true }}
          >
            {props.widgets.map((widget, index) => {
              if (index === 0) {
                sectionCount = 0;
              }
              const order = index + 1 - sectionCount;
              return widget.section ? (
                ""
              ) : (
                <div key={widget.id}>
                  <ContentItem
                    className="grid-col margin-top-1"
                    key={widget.id}
                    index={index}
                    id={index}
                    moveItem={moveWidget}
                    itemType="widget"
                  >
                    <div className="grid-row flex-1">
                      <div className="grid-row grid-col flex-1 padding-1">
                        <div className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center margin-left-2 margin-right-1 margin-top-1 margin-bottom-1">
                          <FontAwesomeIcon icon={faGripLines} size="1x" />
                        </div>
                        <div className="grid-col flex-6 text-center display-flex flex-align-center flex-justify-center font-sans-md margin-left-2 margin-top-1 margin-bottom-1">
                          {order}
                        </div>
                        <div className="grid-col flex-4 grid-row flex-column text-center margin-left-2 margin-right-2">
                          <div className="grid-col flex-6">
                            {index > 0 && (
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
                            )}
                          </div>
                          <div className="grid-col flex-6">
                            {index < props.widgets.length - 1 &&
                              props.widgets.some(
                                (w, i) => !w.section && i > index
                              ) && (
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
                              )}
                          </div>
                        </div>
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
                              }/edit-${widget.widgetType.toLowerCase()}/${
                                widget.id
                              }`}
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
                          {ActionMenu(widget)}
                        </div>
                      </div>
                    </div>
                    {widget.widgetType === WidgetType.Section &&
                    (!widget.content.widgetIds ||
                      widget.content.widgetIds.length === 0) ? (
                      <div className="grid-row flex-1 bg-base-lightest flex-align-center flex-justify-center">
                        <div className="margin-4 flex-align-center">
                          {t("MoveInOut")}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </ContentItem>
                  {widget.widgetType === WidgetType.Section &&
                  widget.content.widgetIds &&
                  widget.content.widgetIds.length ? (
                    <div className="bg-base-lightest padding-1">
                      {props.widgets
                        .map((wc, arrIndex) => ({
                          widget: wc,
                          arrIndex: arrIndex,
                        }))
                        .filter((current) =>
                          widget.content.widgetIds.includes(current.widget.id)
                        )
                        .map(({ widget, arrIndex }, childIndex) => {
                          sectionCount++;
                          return (
                            <ContentItem
                              className="grid-col margin-top-1 margin-bottom-1 margin-left-2 minus-2-margin"
                              key={widget.id}
                              index={arrIndex}
                              id={arrIndex}
                              moveItem={moveWidget}
                              itemType="widget"
                            >
                              <div className="grid-row flex-1">
                                <div className="grid-row grid-col flex-1 padding-1">
                                  <div className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center margin-left-2 margin-right-2 margin-top-1 margin-bottom-1">
                                    <FontAwesomeIcon
                                      icon={faGripLines}
                                      size="1x"
                                    />
                                  </div>
                                  <div className="grid-col flex-6 text-center display-flex flex-align-center flex-justify-center font-sans-md margin-left-2 margin-top-1 margin-bottom-1">
                                    {`${order}.${childIndex + 1}`}
                                  </div>
                                  <div className="grid-col flex-4 grid-row flex-column text-center margin-left-2 margin-right-1">
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
                                  </div>
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
                                        }/edit-${widget.widgetType.toLowerCase()}/${
                                          widget.id
                                        }`}
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
                                    {ActionMenu(widget)}
                                  </div>
                                </div>
                              </div>
                            </ContentItem>
                          );
                        })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </DndProvider>
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
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default WidgetList;
