import React, { createRef } from "react";
import { Metric } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import "./MetricsList.css";
import AlertContainer from "../containers/AlertContainer";

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
}

function MetricsList(props: Props) {
  const caretUpRefs = props.metrics.map(() => createRef<HTMLButtonElement>());
  const caretDownRefs = props.metrics.map(() => createRef<HTMLButtonElement>());

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

  return (
    <div>
      <h4 className="margin-bottom-0">Metrics</h4>
      <p className="margin-top-2px usa-hint">
        Add metrics here and reorder them. Multiple metrics will automatically
        scale to fit and wrap according to the order.
      </p>
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
          One metric per row
        </label>
      </div>
      {props.metrics && props.metrics.length ? (
        <div>
          <AlertContainer />
          {props.metrics.map((metric, index) => {
            return (
              <div
                key={index}
                className="grid-row radius-lg border-base border margin-y-1"
              >
                <div className="grid-row grid-col flex-1 padding-1">
                  <div className="grid-col flex-6 text-center display-flex flex-align-center flex-justify-center font-sans-md">
                    {index + 1}
                  </div>
                  <div className="grid-col flex-6 grid-row flex-column text-center">
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
                          <FontAwesomeIcon size="sm" icon={faArrowUp} />
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
                            size="sm"
                            icon={faArrowDown}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-base border"></div>
                <div className="grid-col flex-11 grid-row padding-1 margin-y-1">
                  <div
                    className="grid-col flex-9 font-important usa-tooltip text-bold"
                    data-position="bottom"
                    title={metric.title}
                  >
                    <div className="margin-left-1 text-no-wrap overflow-hidden text-overflow-ellipsis">
                      {metric.title}
                    </div>
                  </div>
                  <div className="grid-col grid-row flex-3">
                    <div className="grid-col flex-6">
                      <Button
                        variant="unstyled"
                        type="button"
                        className="margin-left-1 margin-top-0-important text-base-dark hover:text-base-darker active:text-base-darkest"
                        onClick={() => onEdit(metric, index)}
                        ariaLabel={`Edit ${metric.title}`}
                      >
                        Edit
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
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                + Add metric
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center radius-lg padding-3 margin-y-1 border-base border-dashed bg-base-lightest border">
          <p>No metrics added yet.</p>
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
              + Add metric
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricsList;
