import React from "react";

interface Props {
  id: string;
  name: string;
  label: string;
  hint?: string;
}

/**
 * This is a dummy component for now. It doesn't have any functionality,
 * Need to revisit this and implement for real.
 */
function FileInput(props: Props) {
  return (
    <div className="usa-form-group">
      <label className="usa-label text-bold" htmlFor={props.id}>
        {props.label}
      </label>
      <div className="usa-hint">{props.hint}</div>
      <div className="usa-file-input">
        <div className="usa-file-input__target">
          <div className="usa-file-input__instructions" aria-hidden="true">
            <span className="usa-file-input__drag-text">
              Drag file here or{" "}
            </span>
            <span className="usa-file-input__choose">choose from folder</span>
          </div>
          <div className="usa-file-input__box"></div>
          <input
            id={props.id}
            className="usa-file-input__input"
            type="file"
            name={props.name}
          />
        </div>
      </div>
    </div>
  );
}

export default FileInput;
