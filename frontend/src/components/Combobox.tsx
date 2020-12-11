import React, { useEffect } from "react";
// @ts-ignore
import comboBox from "uswds/src/js/components/combo-box";

interface Props {
  id: string;
  name: string;
  label: string;
  options: Array<{
    value: string;
    content: React.ReactNode;
  }>;
  register?: Function;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  onChange?: Function;
}

function Combobox(props: Props) {
  useEffect(() => {
    // initialize
    comboBox.on();

    // remove event listeners when component un-mounts.
    return () => {
      comboBox.off();
    };
  }, []);

  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  const handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <div className={formGroupClassName}>
      <label className="usa-label" htmlFor={props.id}>
        {props.label}
      </label>
      {props.error && (
        <span
          className="usa-error-message"
          id="input-error-message"
          role="alert"
        >
          {props.error}
        </span>
      )}
      <div className="usa-combo-box">
        <select
          className="usa-select"
          name={props.name}
          id={props.id}
          onChange={handleChange}
          defaultValue={props.defaultValue}
          ref={props.register && props.register({ required: props.required })}
        >
          <option>Select an option</option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.content}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Combobox;
