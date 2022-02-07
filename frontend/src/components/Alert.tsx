import React from "react";

interface Props {
  title?: string;
  hideIcon?: boolean;
  message: string | React.ReactNode;
  type: "info" | "warning" | "error" | "success";
  slim?: boolean;
}

function Alert(props: Props) {
  let className = "usa-alert usa-alert--".concat(props.type);
  if (props.slim) {
    className += " usa-alert--slim";
  }

  if (props.hideIcon) {
    className += " usa-alert--no-icon";
  }

  return (
    <div className={className}>
      {typeof props.message === "object" ? (
        props.message
      ) : (
        <div className="usa-alert__body">
          {props.title && !props.slim && (
            <h2 className="usa-alert__heading">{props.title}</h2>
          )}
          <p className="usa-alert__text">{props.message}</p>
        </div>
      )}
    </div>
  );
}

export default Alert;
