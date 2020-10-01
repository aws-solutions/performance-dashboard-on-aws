import React from "react";

interface Props {
  title?: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  slim?: boolean;
}

function Alert(props: Props) {
  let className = "usa-alert usa-alert--".concat(props.type);
  if (props.slim) {
    className += " usa-alert--slim";
  }

  return (
    <div className={className}>
      <div className="usa-alert__body">
        {props.title && !props.slim && (
          <h3 className="usa-alert__heading">{props.title}</h3>
        )}
        <p className="usa-alert__text">{props.message}</p>
      </div>
    </div>
  );
}

export default Alert;
