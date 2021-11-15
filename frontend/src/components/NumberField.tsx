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
  defaultValue?: number;
  error?: string;
  onChange?: Function;
  rows?: number;
  className?: string;
  step?: number;
}

function NumberField(props: Props) {
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

  const className = `usa-input${props.className ? " " + props.className : ""}`;

  return (
    <div className={formGroupClassName}>
      <label htmlFor={props.id} className="usa-label text-bold">
        {props.label}
        {props.label && props.required && <span>&#42;</span>}
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
        className={className}
        name={props.name}
        type="number"
        step={props.step}
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
    </div>
  );
}

export default NumberField;
