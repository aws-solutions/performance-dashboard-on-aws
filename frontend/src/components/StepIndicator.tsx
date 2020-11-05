import React from "react";
import "./StepIndicator.css";

interface Props {
  current: number;
  segments: Array<{
    label: string;
  }>;
}

function StepIndicator(props: Props) {
  if (props.current >= props.segments.length || props.current < 0) {
    return null;
  }

  return (
    <div
      className="usa-step-indicator usa-step-indicator--counters-sm"
      aria-label="progress"
    >
      <ol className="usa-step-indicator__segments">
        {props.segments.map((segment, index) => {
          return (
            <Segment
              key={index}
              current={props.current === index}
              complete={index < props.current}
              label={segment.label}
            />
          );
        })}
      </ol>
      <div className="usa-step-indicator__header">
        <h2 className="usa-step-indicator__heading">
          <span className="usa-step-indicator__heading-counter">
            <span className="usa-sr-only">Step</span>
            <span className="usa-step-indicator__current-step bg-base-dark">
              {props.current + 1}
            </span>
            <span className="usa-step-indicator__total-steps text-base-dark margin-left-2px">
              of {props.segments.length}
            </span>
          </span>
          <span className="usa-step-indicator__heading-text">
            {props.current < props.segments.length &&
              props.segments[props.current].label}
          </span>
        </h2>
      </div>
    </div>
  );
}

interface SegmentProps {
  current?: boolean;
  complete?: boolean;
  label: string;
}

function Segment(props: SegmentProps) {
  if (props.current) {
    return (
      <li
        className="usa-step-indicator__segment usa-step-indicator__segment--current"
        aria-current="true"
      >
        <span className="usa-step-indicator__segment-label">
          <div className="text-base-dark">{props.label}</div>
        </span>
      </li>
    );
  }

  if (props.complete) {
    return (
      <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
        <span className="usa-step-indicator__segment-label">
          <div className="text-base-dark">{props.label}</div>{" "}
          <span className="usa-sr-only">completed</span>
        </span>
      </li>
    );
  }

  return (
    <li className="usa-step-indicator__segment">
      <span className="usa-step-indicator__segment-label">
        <div className="text-base-dark">{props.label}</div>{" "}
        <span className="usa-sr-only">not completed</span>
      </span>
    </li>
  );
}

export default StepIndicator;
