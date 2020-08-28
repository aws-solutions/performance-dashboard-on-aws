import React from "react";

interface Props {
  id: string;
  name: string;
  label: string;
  chartTitle: string;
  fileName?: string;
  hint?: string;
  accept?: string;
  errors?: Array<object>;
  onFileProcessed?: Function;
}

function FileInput(props: Props) {
  return (
    <div
      className={`usa-form-group${
        props.errors && props.errors.length ? " usa-form-group--error" : ""
      }`}
    >
      <label className="usa-label text-bold" htmlFor={props.id}>
        {props.label}
      </label>
      <div className="usa-hint">{props.hint}</div>
      {props.errors && props.errors.length && (
        <span
          className="usa-error-message"
          id="file-input-error-alert"
          role="alert"
        >
          Invalid CSV file
        </span>
      )}
      <div
        className={`usa-file-input${
          props.chartTitle ? "" : " usa-file-input--disabled"
        }`}
      >
        <div
          className={`${
            props.errors && props.errors.length
              ? "usa-form-group--error margin-left-1px "
              : ""
          }usa-file-input__target`}
        >
          {props.fileName ? (
            <div className="usa-file-input__instructions" aria-hidden="true">
              {props.fileName}
            </div>
          ) : (
            <div className="usa-file-input__instructions" aria-hidden="true">
              <span className="usa-file-input__drag-text">
                Drag file here or{" "}
              </span>
              <span className="usa-file-input__choose">choose from folder</span>
            </div>
          )}
          <div className="usa-file-input__box"></div>
          <input
            id={props.id}
            className="usa-file-input__input"
            type="file"
            name={props.name}
            accept={props.accept}
            disabled={!props.chartTitle}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (props.onFileProcessed) {
                props.onFileProcessed(
                  event.target.files?.length && event.target.files[0]
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FileInput;
