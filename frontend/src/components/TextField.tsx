import React from "react";

interface Props {
  name: string;
  id: string;
  label: string;
  hint?: string | React.ReactNode;
  register?: Function;
  required?: boolean;
  validate?: Function;
  disabled?: boolean;
  defaultValue?: string;
  error?: string;
  onChange?: Function;
  multiline?: boolean;
  rows?: number;
  className?: string;
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

  const className = `${props.multiline ? "usa-textarea" : "usa-input"}${
    props.className ? " " + props.className : ""
  }`;

  return (
    <div className={formGroupClassName}>
      <label htmlFor={props.id} className="usa-label text-bold">
        {props.label}
        {props.label && props.required && <span>&#42;</span>}
      </label>
      <div className="usa-hint text-base-dark">{props.hint}</div>
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
          className={className}
          defaultValue={props.defaultValue}
          onChange={handleChange}
          rows={props.rows || 10}
          style={{ height: "auto" }}
          disabled={props.disabled}
          ref={
            props.register &&
            (props.validate
              ? props.register({
                  required: props.required,
                  validate: props.validate,
                })
              : props.register({ required: props.required }))
          }
        />
      ) : (
        <input
          id={props.id}
          className={className}
          name={props.name}
          type="text"
          defaultValue={props.defaultValue}
          ref={
            props.register &&
            (props.validate
              ? props.register({
                  required: props.required,
                  validate: props.validate,
                })
              : props.register({ required: props.required }))
          }
          disabled={props.disabled}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

export default TextField;
