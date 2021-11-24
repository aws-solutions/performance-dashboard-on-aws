import React, { createRef, useCallback } from "react";
import { Widget, WidgetType } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLinesVertical,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import "./WidgetList.css";
import Link from "./Link";
import SecondaryActionBar from "./SecondaryActionBar";
import ContentItem from "./ContentItem";
import { useTranslation } from "react-i18next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

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

  const moveWidget = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragItem = props.widgets[dragIndex];
      if (dragItem) {
        onDrag(dragIndex, hoverIndex);
      }
    },
    [props.widgets, onDrag]
  );

  return (
    <div>
      {props.widgets && props.widgets.length ? (
        <div>
          <SecondaryActionBar stickyPosition={160}>
            <h3 className="margin-bottom-0 margin-top-0">
              {t("DashboardContent")}
            </h3>
            <p className="margin-top-2px margin-bottom-0">
              {t("BuildDashboardGuidance")}
            </p>
            <div className="grid-row radius-lg margin-top-4 text-bold font-sans-sm">
              <div className="grid-col flex-1">
                <div className="margin-left-1">{t("Order")}</div>
              </div>
              <div className="grid-col flex-5">
                <div className="margin-left-2">{t("NameUpperCase")}</div>
              </div>
              <div className="grid-col flex-6">
                <div className="margin-left-6">{t("ContentType")}</div>
              </div>
            </div>
          </SecondaryActionBar>
          <DndProvider
            backend={window.innerWidth < 1024 ? TouchBackend : HTML5Backend}
            options={{ enableMouseEvents: true }}
          >
            {props.widgets.map((widget, index) => {
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
                        <div className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center">
                          <FontAwesomeIcon
                            icon={faGripLinesVertical}
                            size="1x"
                          />
                        </div>
                        <div className="grid-col flex-5 text-center display-flex flex-align-center flex-justify-center font-sans-md">
                          {index + 1}
                        </div>
                        <div className="grid-col flex-4 grid-row flex-column text-center">
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
                          className="grid-col flex-6 usa-tooltip"
                          data-position="bottom"
                          title={widget.name}
                        >
                          <div className="margin-left-1 text-no-wrap overflow-hidden text-overflow-ellipsis text-bold">
                            {widget.name}
                          </div>
                        </div>
                        <div className="grid-col flex-3 text-italic">
                          {t(
                            widget.widgetType === WidgetType.Chart
                              ? widget.content.chartType
                              : widget.widgetType
                          )}
                        </div>
                        <div className="grid-col flex-3 text-right">
                          <Link
                            ariaLabel={t("EditContent", { name: widget.name })}
                            to={`/admin/dashboard/${
                              widget.dashboardId
                            }/edit-${widget.widgetType.toLowerCase()}/${
                              widget.id
                            }`}
                          >
                            {t("Edit")}
                          </Link>
                          <Button
                            variant="unstyled"
                            className="margin-left-2 text-base-dark hover:text-base-darker active:text-base-darkest"
                            onClick={() => onDuplicate(widget)}
                            ariaLabel={t("CopyContent", {
                              name: widget.name,
                            })}
                          >
                            {t("Copy")}
                          </Button>
                          <Button
                            variant="unstyled"
                            className="margin-left-2 text-base-dark hover:text-base-darker active:text-base-darkest"
                            onClick={() => onDelete(widget)}
                            ariaLabel={t("DeleteContent", {
                              name: widget.name,
                            })}
                          >
                            {t("Delete")}
                          </Button>
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
                        .filter((wc) =>
                          widget.content.widgetIds.includes(wc.id)
                        )
                        .map((widget, indexChild) => {
                          return (
                            <ContentItem
                              className="grid-col margin-1"
                              key={widget.id}
                              index={index + indexChild + 1}
                              id={index + indexChild + 1}
                              moveItem={moveWidget}
                              itemType="widget"
                            >
                              <div className="grid-row flex-1">
                                <div className="grid-row grid-col flex-1 padding-1">
                                  <div className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center">
                                    <FontAwesomeIcon
                                      icon={faGripLinesVertical}
                                      size="1x"
                                    />
                                  </div>
                                  <div className="grid-col flex-5 text-center display-flex flex-align-center flex-justify-center font-sans-md">
                                    {index + indexChild + 2}
                                  </div>
                                  <div className="grid-col flex-4 grid-row flex-column text-center">
                                    <div className="grid-col flex-6">
                                      <Button
                                        variant="unstyled"
                                        className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                                        ariaLabel={t("MoveContentItemUp", {
                                          name: widget.name,
                                        })}
                                        onClick={() =>
                                          onMoveUp(index + indexChild + 1)
                                        }
                                        ref={
                                          caretUpRefs[index + indexChild + 1]
                                        }
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
                                        onClick={() =>
                                          onMoveDown(index + indexChild + 1)
                                        }
                                        ref={
                                          caretDownRefs[index + indexChild + 1]
                                        }
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
                                    className="grid-col flex-6 usa-tooltip"
                                    data-position="bottom"
                                    title={widget.name}
                                  >
                                    <div className="margin-left-1 text-no-wrap overflow-hidden text-overflow-ellipsis">
                                      {widget.name}
                                    </div>
                                  </div>
                                  <div className="grid-col flex-3 text-italic">
                                    {t(
                                      widget.widgetType === WidgetType.Chart
                                        ? widget.content.chartType
                                        : widget.widgetType
                                    )}
                                  </div>
                                  <div className="grid-col flex-3 text-right">
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
                                      {t("Edit")}
                                    </Link>
                                    <Button
                                      variant="unstyled"
                                      className="margin-left-2 usa-link"
                                      onClick={() => onDuplicate(widget)}
                                      ariaLabel={t("CopyContent", {
                                        name: widget.name,
                                      })}
                                    >
                                      {t("Copy")}
                                    </Button>
                                    <Button
                                      variant="unstyled"
                                      className="margin-left-2 usa-link"
                                      onClick={() => onDelete(widget)}
                                      ariaLabel={t("DeleteContent", {
                                        name: widget.name,
                                      })}
                                    >
                                      {t("Delete")}
                                    </Button>
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
