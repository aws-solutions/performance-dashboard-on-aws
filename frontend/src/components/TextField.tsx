import React from "react";
import Link from "./Link";

interface Props {
  name: string;
  id: string;
  label: string;
  hint?: string;
  showMarkdownLink?: boolean;
  register?: Function;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  onChange?: Function;
  multiline?: boolean;
  rows?: number;
}

function TextField(props: Props) {
  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <div className={formGroupClassName}>
      <label htmlFor={props.id} className="usa-label text-bold">
        {props.label}
      </label>
      <div className="usa-hint">
        {props.hint}
        {props.showMarkdownLink ? (
          <>
            {". "}
            <Link target="_blank" to={"/admin/markdown"}>
              View Markdown Syntax
            </Link>
          </>
        ) : (
          ""
        )}
      </div>
      {props.error && (
        <span
          className="usa-error-message"
          id="input-error-message"
          role="alert"
        >
          {props.error}
        </span>
      )}
      {props.multiline ? (
        <textarea
          id={props.id}
          name={props.name}
          className="usa-textarea"
          defaultValue={props.defaultValue}
          onChange={handleChange}
          rows={props.rows || 10}
          style={{ height: "auto" }}
          ref={props.register && props.register({ required: props.required })}
        />
      ) : (
        <input
          id={props.id}
          className="usa-input"
          name={props.name}
          type="text"
          defaultValue={props.defaultValue}
          ref={props.register && props.register({ required: props.required })}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

export default TextField;
