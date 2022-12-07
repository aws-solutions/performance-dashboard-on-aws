/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
// @ts-ignore
import comboBox from "uswds/src/js/components/combo-box";
import "./Combobox.css";
import { useTranslation } from "react-i18next";

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
    labelClassName?: string;
}

function Combobox(props: Props) {
    const { t } = useTranslation();
    const formGroupRef = useRef(null);
    useEffect(() => {
        // initialize
        if (formGroupRef.current) {
            comboBox.init(formGroupRef.current);
        }
    }, [formGroupRef]);

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
        <div className={formGroupClassName} ref={formGroupRef}>
            <label
                className={`usa-label margin-top-1${
                    props.labelClassName ? " " + props.labelClassName : ""
                }`}
                htmlFor={props.id}
            >
                {props.label}
                {props.label && props.required && <span>&#42;</span>}
            </label>
            {props.error && (
                <span className="usa-error-message" id="input-error-message" role="alert">
                    {props.error}
                </span>
            )}
            <div className="usa-combo-box" data-default-value={props.defaultValue}>
                <select
                    className="usa-select"
                    name={props.name}
                    id={props.id}
                    onChange={handleChange}
                    defaultValue={props.defaultValue}
                    ref={props.register && props.register({ required: props.required })}
                >
                    <option key="" value="">
                        {t("SelectAnOption")}
                    </option>
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
