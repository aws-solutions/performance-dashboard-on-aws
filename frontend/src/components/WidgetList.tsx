import React from "react";
import { Widget } from "../models";
import "./WidgetList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  onClick: Function;
  widgets: Array<Widget>;
}

function WidgetList(props: Props) {
  return (
    <div>
      {props.widgets && props.widgets.length ? (
        <div>
          <h3 className="margin-bottom-0">Dashboard content</h3>
          <p className="margin-top-2px">
            Build the dashboard by adding charts, tables, metrics and text as
            content.
          </p>
          <div className="grid-row radius-lg padding-top-1 margin-left-1 margin-bottom-2 text-base">
            <div className="grid-col flex-1">Order</div>
            <div className="grid-col flex-6">
              <div className="margin-left-3">Name</div>
            </div>
            <div className="grid-col flex-5">
              <div className="margin-left-4">Content type</div>
            </div>
          </div>
          {props.widgets.map((widget, index) => {
            return (
              <div
                key={index}
                className="grid-row radius-lg border-base border"
              >
                <div className="grid-row grid-col flex-1 padding-1">
                  <div className="grid-col flex-4 text-center display-flex flex-align-center flex-justify-center">
                    <FontAwesomeIcon icon="grip-lines-vertical" />
                  </div>
                  <div className="grid-col flex-4 text-center display-flex flex-align-center flex-justify-center">
                    {index + 1}
                  </div>
                  <div className="grid-col flex-4 grid-row flex-column text-center">
                    <div className="grid-col flex-6">
                      <FontAwesomeIcon icon="caret-up" />
                    </div>
                    <div className="grid-col flex-6">
                      <FontAwesomeIcon icon="caret-down" />
                    </div>
                  </div>
                </div>
                <div className="border-base border"></div>
                <div className="grid-col flex-11 grid-row padding-1 margin-y-1">
                  <div
                    className="grid-col flex-7 text-no-wrap overflow-hidden text-overflow-ellipsis usa-tooltip text-bold"
                    data-position="bottom"
                    title={widget.name}
                  >
                    <div className="margin-left-1">{widget.name}</div>
                  </div>
                  <div className="grid-col flex-2 text-italic">
                    {widget.widgetType}
                  </div>
                  <div className="grid-col flex-3 text-no-wrap overflow-hidden text-overflow-ellipsis text-right">
                    <a className="usa-link margin-right-2" href="/">
                      Edit
                    </a>
                    <a className="usa-link" href="/">
                      Delete
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="text-center margin-top-2">
            <button
              className="usa-button usa-button--base margin-top-1"
              onClick={() => {
                if (props.onClick) {
                  props.onClick();
                }
              }}
            >
              + Add content
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center radius-lg padding-5 margin-y-3 border-base border-dashed bg-base-lightest border">
          <p>
            This dashboard is empty. Build the dashboard by adding <br />
            charts, tables, metrics and text as content.
          </p>
          <div className="text-center margin-top-4">
            <button
              className="usa-button usa-button--base margin-top-1"
              onClick={() => {
                if (props.onClick) {
                  props.onClick();
                }
              }}
            >
              + Add content
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetList;
