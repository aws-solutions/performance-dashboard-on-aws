import React from "react";

interface Props {
  name: string;
  id: string;
  label: string;
  hint?: string;
  register?: Function;
  required?: boolean;
  defaultValue?: string;
  error?: string;
}

function TextField(props: Props) {
  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  return (
    <div className={formGroupClassName}>
      <label htmlFor={props.id} className="usa-label text-bold">
        {props.label}
      </label>
      <div className="usa-hint">{props.hint}</div>
      {props.error && (
        <span
          className="usa-error-message"
          id="input-error-message"
          role="alert"
        >
          {props.error}
        </span>
      )}
      <input
        id={props.id}
        className="usa-input"
        name={props.name}
        type="text"
        defaultValue={props.defaultValue}
        ref={props.register && props.register({ required: props.required })}
      />
    </div>
  );
}

export default TextField;
