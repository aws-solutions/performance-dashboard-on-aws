/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

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
    onChange?: Function;
    className?: string;
}

function RadioButtons(props: Props) {
    let formGroupClassName = "usa-form-group";
    if (props.error) {
        formGroupClassName += " usa-form-group--error";
    }
    if (props.className) {
        formGroupClassName += ` ${props.className}`;
    }

    const handleChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
        if (props.onChange) {
            props.onChange(event);
        }
    };

    return (
        <div className={formGroupClassName}>
            <fieldset className="usa-fieldset" onChange={handleChange}>
                <legend className="usa-sr-only">{props.label}</legend>
                <span className="usa-label text-bold">{props.label}</span>
                <div className="usa-hint">{props.hint}</div>
                {props.error && (
                    <span className="usa-error-message" id="input-error-message" role="alert">
                        {props.error}
                    </span>
                )}
                <div className="margin-top-2 margin-left-2px">
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
                                        props.register &&
                                        props.register({
                                            required: props.required,
                                        })
                                    }
                                />
                                <label className="usa-radio__label" htmlFor={option.value}>
                                    {option.label}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </fieldset>
        </div>
    );
}

export default RadioButtons;
