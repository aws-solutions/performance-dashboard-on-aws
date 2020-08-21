import React from "react";

interface Props {
  id: string;
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  register?: Function;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
  error?: string;
}

function RadioButtons(props: Props) {
  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  return (
    <div className={formGroupClassName}>
      <legend className="usa-sr-only">{props.label}</legend>
      <span className="usa-label text-bold">{props.label}</span>
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
      <div className="margin-top-2">
        {props.options.map((option) => {
          const selected = props.defaultValue
            ? props.defaultValue === option.value
            : false;
          return (
            <div className="usa-radio" key={option.value}>
              <input
                className="usa-radio__input"
                id={option.value}
                type="radio"
                defaultChecked={selected}
                name={props.name}
                value={option.value}
                ref={
                  props.register && props.register({ required: props.required })
                }
              />
              <label className="usa-radio__label" htmlFor={option.value}>
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RadioButtons;
