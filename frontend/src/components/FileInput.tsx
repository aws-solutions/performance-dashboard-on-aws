import React from "react";
import Spinner from "./Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import "./FileInput.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  let content = (
    <div className="usa-file-input__instructions" aria-hidden="true">
      <span className="usa-file-input__drag-text">t("DragFileHere") </span>
      <span className="usa-file-input__choose">t("ChooseFromFolder")</span>
    </div>
  );

  if (props.loading) {
    content = (
      <Spinner
        className="usa-file-input__instructions"
        label= {t("UploadingFile")}
      />
    );
  } else if (props.fileName) {
    content = (
      <div>
        <div className="usa-file-input__preview-heading">
          t("SelectedFile"){" "}
          <span className="usa-file-input__choose">t("ChangeFile")</span>
        </div>
        <div className="usa-file-input__preview" aria-hidden="true">
          <div className="usa-file-input__preview-image">
            <div className="fileIcon" id="fileIconDiv">
              <FontAwesomeIcon icon={faFile} size="lg" />
            </div>
          </div>
          <div></div>
          <label className="usa-label margin-top-0" htmlFor="fileIconDiv">
            {props.fileName}
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
          t("InvalidFileFormat")
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
