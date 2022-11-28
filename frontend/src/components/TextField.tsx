/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

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
  onBlur?: Function;
  onFocus?: Function;
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

  const handleBlur = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  const handleFocus = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const className = `${props.multiline ? "usa-textarea" : "usa-input"}${
    props.className ? " " + props.className : ""
  }`;

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
      {props.multiline ? (
        <textarea
          id={props.id}
          aria-describedby={`${props.id}-description`}
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
          aria-describedby={`${props.id}-description`}
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
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      )}
    </div>
  );
}

export default TextField;
