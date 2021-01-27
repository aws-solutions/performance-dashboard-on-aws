import React, { useEffect, useRef } from "react";
// @ts-ignore
import datePicker from "uswds/src/js/components/date-picker";

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
  rows?: number;
  className?: string;
}

function DatePicker(props: Props) {
  const formGroupRef = useRef(null);
  useEffect(() => {
    // initialize
    if (formGroupRef.current) {
      datePicker.init(formGroupRef.current);
    }
  }, [formGroupRef]);

  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(event);
    }
  };

  const className = `usa-input${props.className ? " " + props.className : ""}`;

  return (
    <div className={formGroupClassName} ref={formGroupRef}>
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

      <div className="usa-date-picker" data-default-value={props.defaultValue}>
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
      </div>
    </div>
  );
}

export default DatePicker;
