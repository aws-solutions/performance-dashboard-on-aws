import React from "react";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  className?: string;
  baseUrl?: string;
}

function FriendlyURLInput(props: Props) {
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(event);
    }
  };

  let formGroupClassName = "usa-form-group";
  if (props.error) {
    formGroupClassName += " usa-form-group--error";
  }

  let className = "usa-input ";
  if (props.className) {
    className += props.className;
  }

  return (
    <div className={formGroupClassName} role="contentinfo">
      <label htmlFor={props.id} className="usa-label text-bold">
        {props.label}
        {props.label && props.required && <span>&#42;</span>}
      </label>
      <div id={`${props.id}-description`} className="usa-hint">
        {props.hint}
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
      <div className="usa-input-group">
        {props.baseUrl && (
          <span className="usa-input-prefix bg-base-lighter padding-1">
            <FontAwesomeIcon icon={faLock} className="margin-right-1" />
            {props.baseUrl}
          </span>
        )}
        <input
          id={props.id}
          aria-describedby={`${props.id}-description`}
          className={className}
          name={props.name}
          type="text"
          defaultValue={props.defaultValue}
          ref={props.register}
          disabled={props.disabled}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default FriendlyURLInput;
