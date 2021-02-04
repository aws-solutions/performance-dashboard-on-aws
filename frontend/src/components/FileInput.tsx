import React from "react";
import Spinner from "./Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import "./FileInput.css";

interface Props {
  id: string;
  name: string;
  label: string;
  register?: Function;
  disabled?: boolean;
  fileName?: string;
  hint?: string | React.ReactNode;
  accept?: string;
  errors?: Array<object>;
  loading?: boolean;
  onFileProcessed?: Function;
}

function FileInput(props: Props) {
  let content = (
    <div className="usa-file-input__instructions" aria-hidden="true">
      <span className="usa-file-input__drag-text">Drag file here or </span>
      <span className="usa-file-input__choose">choose from folder</span>
    </div>
  );

  if (props.loading) {
    content = (
      <Spinner
        className="usa-file-input__instructions"
        label="Uploading file"
      />
    );
  } else if (props.fileName) {
    content = (
      <div>
        <div className="usa-file-input__preview-heading">
          Selected file{" "}
          <span className="usa-file-input__choose">Change file</span>
        </div>
        <div className="usa-file-input__preview" aria-hidden="true">
          <div className="usa-file-input__preview-image">
            <div className="fileIcon" id="fileIconDiv">
              <FontAwesomeIcon icon={faFile} size="lg" />
            </div>
          </div>
          <div></div>
          <label className="usa-label" htmlFor="fileIconDiv" id="fileIconLabel">
            Test.png
          </label>
        </div>
        <div className="usa-file-input__box"></div>
      </div>
    );
  }

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
          Invalid file format
        </span>
      )}
      <div
        className={`usa-file-input${
          props.disabled ? " usa-file-input--disabled" : ""
        }`}
      >
        <div
          className={`${
            props.errors && props.errors.length
              ? "usa-form-group--error margin-left-1px "
              : ""
          }usa-file-input__target`}
        >
          {content}
          <div className="usa-file-input__box"></div>
          <input
            id={props.id}
            className="usa-file-input__input"
            type="file"
            name={props.name}
            accept={props.accept}
            disabled={props.disabled}
            ref={props.register && props.register()}
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
