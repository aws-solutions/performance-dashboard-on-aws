/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { createRef } from "react";
import { Metric } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faEllipsisV,
  faTrash,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import "./MetricsList.css";
import { useTranslation } from "react-i18next";
import DropdownMenu from "./DropdownMenu";
import { MenuItem } from "@reach/menu-button";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";

interface Props {
  onClick: Function;
  onEdit?: Function;
  onDelete?: Function;
  onMoveUp?: Function;
  onMoveDown?: Function;
  metrics: Array<Metric>;
  register?: Function;
  defaultChecked?: boolean;
  allowAddMetric: boolean;
  onDrag?: Function;
  onDrop?: Function;
}

function MetricsList(props: Props) {
  const caretUpRefs = props.metrics.map(() => createRef<HTMLButtonElement>());
  const caretDownRefs = props.metrics.map(() => createRef<HTMLButtonElement>());
  const { t } = useTranslation();

  const onDelete = (metric: Metric) => {
    if (props.onDelete) {
      props.onDelete(metric);
    }
  };

  const onEdit = (metric: Metric, position: number) => {
    if (props.onEdit) {
      props.onEdit(metric, position);
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

  const setNextFocus = (index: number, direction: "Up" | "Down") => {
    let ref;
    /**
     * When moving a metric up or down, the focus should follow the
     * metric to its new position in the list. Determining the new
     * position depends on whether the metric is moving up or down
     * and if the metric has reached a boundary (i.e. beginning or
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
      const secondLast = props.metrics.length - 2;
      ref =
        index === secondLast ? caretUpRefs[secondLast] : caretDownRefs[index];
    }

    if (ref.current) {
      ref.current.focus();
    }
  };

  function ActionMenu(metric: Metric) {
    return (
      <DropdownMenu
        buttonText=""
        icon={faEllipsisV}
        variant="unstyled"
        ariaLabel={t("Actions")}
        className="margin-1"
      >
        <MenuItem onSelect={() => {}}>
          <Button
            variant="unstyled"
            ariaLabel={t("DeleteContent", {
              name: metric.title,
            })}
            onClick={() => onDelete(metric)}
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

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
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
    if (props.onDrag) {
      props.onDrag(source.index, destination.index);
    }
  };

  return (
    <div className="display-block" role="group" aria-label={t("Metrics")}>
      <label className="margin-bottom-0 margin-top-2 usa-label text-bold">
        {t("Metrics")}
        <span>&#42;</span>
      </label>
      <p className="margin-top-2px usa-hint">{t("MetricsGuidance")}</p>
      <div className="usa-checkbox margin-bottom-2">
        <input
          className="usa-checkbox__input"
          id="oneMetricPerRow"
          type="checkbox"
          name="oneMetricPerRow"
          ref={props.register && props.register()}
          defaultChecked={props.defaultChecked}
        />
        <label className="usa-checkbox__label" htmlFor="oneMetricPerRow">
          {t("MetricsOnePerRow")}
        </label>
      </div>
      {props.metrics && props.metrics.length ? (
        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="metrics-list">
              {(provided) => {
                return (
                  <div
                    role="list"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="padding-top-2 padding-bottom-2"
                  >
                    {props.metrics.map((metric, index) => {
                      return (
                        <Draggable
                          draggableId={index.toString()}
                          index={index}
                          key={index}
                        >
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                role="listitem"
                                aria-label={(index + 1)?.toString()}
                                className={`${
                                  snapshot.isDragging ? "usa-focus " : ""
                                }border-base-lighter border-1px shadow-1 z-200 radius-lg bg-white grid-row margin-y-1`}
                              >
                                <div className="grid-row grid-col flex-2 padding-1">
                                  <div
                                    className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center margin-left-1"
                                    {...provided.dragHandleProps}
                                  >
                                    <FontAwesomeIcon
                                      icon={faGripVertical}
                                      size="xs"
                                    />
                                  </div>
                                  <div className="grid-col flex-6 text-center display-flex flex-align-center flex-justify-center font-sans-md margin-left-1">
                                    {index + 1}
                                  </div>
                                  <div className="grid-col flex-4 grid-row flex-column text-center margin-left-1 margin-right-1">
                                    <div className="grid-col flex-6">
                                      {index > 0 ? (
                                        <Button
                                          variant="unstyled"
                                          type="button"
                                          className="margin-top-0-important text-base-darker hover:text-base-darkest active:text-base-darkest"
                                          ariaLabel={t("ARIA.MoveUp", {
                                            metric: metric.title,
                                          })}
                                          onClick={() => onMoveUp(index)}
                                          ref={caretUpRefs[index]}
                                        >
                                          <FontAwesomeIcon
                                            id={`${metric.title}-move-up`}
                                            size="xs"
                                            icon={faArrowUp}
                                          />
                                        </Button>
                                      ) : (
                                        <br />
                                      )}
                                    </div>
                                    <div className="grid-col flex-6">
                                      {index < props.metrics.length - 1 ? (
                                        <Button
                                          variant="unstyled"
                                          type="button"
                                          className="margin-top-0-important text-base-darker hover:text-base-darkest active:text-base-darkest"
                                          ariaLabel={t("ARIA.MoveDown", {
                                            metric: metric.title,
                                          })}
                                          onClick={() => onMoveDown(index)}
                                          ref={caretDownRefs[index]}
                                        >
                                          <FontAwesomeIcon
                                            id={`${metric.title}-move-down`}
                                            size="xs"
                                            icon={faArrowDown}
                                          />
                                        </Button>
                                      ) : (
                                        <br />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="border-base-lighter border-left"></div>
                                <div className="grid-col flex-10 grid-row margin-y-1">
                                  <div
                                    className="grid-col flex-11 usa-tooltip"
                                    data-position="bottom"
                                    title={metric.title}
                                  >
                                    <div className="margin-left-1 text-no-wrap overflow-hidden text-overflow-ellipsis">
                                      <Button
                                        variant="unstyled"
                                        type="button"
                                        className="margin-left-1 margin-top-0-important text-base-dark hover:text-base-darker active:text-base-darkest text-bold"
                                        onClick={() => onEdit(metric, index)}
                                        ariaLabel={`Edit ${metric.title}`}
                                      >
                                        {metric.title}
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="grid-col flex-1 text-right">
                                    {ActionMenu(metric)}
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>

          {props.allowAddMetric && (
            <div className="text-center margin-top-2">
              <Button
                variant="outline"
                type="button"
                className="margin-top-0-important"
                onClick={() => {
                  if (props.onClick) {
                    props.onClick();
                  }
                }}
              >
                {t("MetricsAdd")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center radius-lg padding-3 margin-y-1 border-base border-dashed bg-base-lightest border">
          <p>{t("MetricsZero")}</p>
          <div className="text-center">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (props.onClick) {
                  props.onClick();
                }
              }}
            >
              {t("MetricsAdd")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricsList;
