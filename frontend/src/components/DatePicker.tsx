import React from "react";
import DatePicker1 from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  name: string;
  id: string;
  label: string;
  hint?: string | React.ReactNode;
  validate?: Function;
  disabled?: boolean;
  defaultValue?: string;
  error?: string;
  className?: string;
  date: Date | null;
  setDate: Function;
  dateFormat: string;
}

function DatePicker(props: Props) {
  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  const className = `usa-input${props.className ? " " + props.className : ""}`;

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

      <div>
        <DatePicker1
          selected={props.date}
          dateFormat={props.dateFormat}
          onChange={(date) => {
            props.setDate(date);
          }}
          className={className}
        />
      </div>
    </div>
  );
}

export default DatePicker;
