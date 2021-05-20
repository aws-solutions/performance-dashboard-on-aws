import React, { createRef, useCallback } from "react";
import { Metric } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLinesVertical,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import "./MetricsList.css";
import ContentItem from "./ContentItem";
import AlertContainer from "../containers/AlertContainer";
import { useTranslation } from "react-i18next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

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

  const onDrag = (index: number, newIndex: number) => {
    if (props.onDrag) {
      props.onDrag(index, newIndex);
    }
  };

  const onDrop = () => {
    if (props.onDrop) {
      props.onDrop();
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
      const next = index - 1;
      ref = next === 0 ? caretDownRefs[0] : caretUpRefs[next];
    } else {
      const next = index + 1;
      const last = props.metrics.length - 1;
      ref = next === last ? caretUpRefs[last] : caretDownRefs[next];
    }

    if (ref.current) {
      ref.current.focus();
    }
  };

  const moveMetric = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragItem = props.metrics[dragIndex];
      if (dragItem) {
        onDrag(dragIndex, hoverIndex);
      }
    },
    [props.metrics]
  );

  return (
    <div className="display-block">
      <h4 className="margin-bottom-0">{t("Metrics")}</h4>
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
          <AlertContainer />
          <DndProvider
            backend={window.innerWidth < 1024 ? TouchBackend : HTML5Backend}
            options={{ enableMouseEvents: true }}
          >
            {props.metrics.map((metric, index) => {
              return (
                <ContentItem
                  className="grid-row margin-y-1"
                  key={metric.title + metric.value}
                  index={index}
                  id={index}
                  moveItem={moveMetric}
                  onDrop={onDrop}
                  itemType="metric"
                >
                  <div className="grid-row grid-col flex-2 padding-1">
                    <div className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center">
                      <FontAwesomeIcon icon={faGripLinesVertical} size="1x" />
                    </div>
                    <div className="grid-col flex-5 text-center display-flex flex-align-center flex-justify-center font-sans-md">
                      {index + 1}
                    </div>
                    <div className="grid-col flex-4 grid-row flex-column text-center">
                      <div className="grid-col flex-6">
                        {index > 0 && (
                          <Button
                            variant="unstyled"
                            type="button"
                            className="margin-top-0-important text-base-darker hover:text-base-darkest active:text-base-darkest"
                            ariaLabel={`Move ${metric.title} up`}
                            onClick={() => onMoveUp(index)}
                            ref={caretUpRefs[index]}
                          >
                            <FontAwesomeIcon
                              id={`${metric.title}-move-up`}
                              size="xs"
                              icon={faArrowUp}
                            />
                          </Button>
                        )}
                      </div>
                      <div className="grid-col flex-6">
                        {index < props.metrics.length - 1 && (
                          <Button
                            variant="unstyled"
                            type="button"
                            className="margin-top-0-important text-base-darker hover:text-base-darkest active:text-base-darkest"
                            ariaLabel={`Move ${metric.title} down`}
                            onClick={() => onMoveDown(index)}
                            ref={caretDownRefs[index]}
                          >
                            <FontAwesomeIcon
                              id={`${metric.title}-move-down`}
                              size="xs"
                              icon={faArrowDown}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-base-lighter border-left"></div>
                  <div className="grid-col flex-10 grid-row padding-1 margin-y-1">
                    <div
                      className="grid-col flex-8 font-important usa-tooltip text-bold"
                      data-position="bottom"
                      title={metric.title}
                    >
                      <div
                        style={{ marginTop: "2px" }}
                        className="margin-left-1 text-no-wrap overflow-hidden text-overflow-ellipsis"
                      >
                        {metric.title}
                      </div>
                    </div>
                    <div className="grid-col grid-row flex-4">
                      <div className="grid-col flex-6 text-right margin-right-1">
                        <Button
                          variant="unstyled"
                          type="button"
                          className="margin-left-1 margin-top-0-important text-base-dark hover:text-base-darker active:text-base-darkest"
                          onClick={() => onEdit(metric, index)}
                          ariaLabel={`Edit ${metric.title}`}
                        >
                          {t("Edit")}
                        </Button>
                      </div>
                      <div className="grid-col flex-6">
                        <Button
                          variant="unstyled"
                          type="button"
                          className="margin-right-2 margin-top-0-important text-base-dark hover:text-base-darker active:text-base-darkest"
                          onClick={() => onDelete(metric)}
                          ariaLabel={`Delete ${metric.title}`}
                        >
                          {t("Delete")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </ContentItem>
              );
            })}
          </DndProvider>
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
