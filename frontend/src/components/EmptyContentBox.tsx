import React from "react";

interface Props {
  onClick?: Function;
}

function EmptyContentBox(props: Props) {
  return (
    <div className="text-center radius-lg padding-5 margin-y-3 border-base border-dashed bg-base-lightest border">
      <p>
        This dashboard is empty. Build the dashboard by adding <br />
        charts, tables, metrics and text as content.
      </p>
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
  );
}

export default EmptyContentBox;
