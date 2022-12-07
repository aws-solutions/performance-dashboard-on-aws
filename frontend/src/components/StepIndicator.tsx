/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import "./StepIndicator.css";
import { useTranslation } from "react-i18next";

interface Props {
    current: number;
    segments: Array<{
        label: string;
    }>;
    showStepChart: boolean;
    showStepText: boolean;
}

function StepIndicator(props: Props) {
    const { t } = useTranslation();
    if (props.current >= props.segments.length || props.current < 0) {
        return null;
    }

    const stepChart = (
        <ol className="usa-step-indicator__segments" aria-label={t("Progress")}>
            {props.segments.map((segment, index) => {
                return (
                    <Segment
                        key={index}
                        current={props.current === index}
                        complete={index < props.current}
                        label={segment.label}
                    />
                );
            })}
        </ol>
    );

    const stepText = (
        <div className="usa-step-indicator__header">
            <h2 className="usa-step-indicator__heading">
                <span className="usa-step-indicator__heading-counter">
                    <span className="usa-sr-only">{t("Step")}</span>
                    <span className="usa-step-indicator__current-step bg-base-dark">
                        {props.current + 1}
                    </span>
                    <span className="usa-step-indicator__total-steps text-base-dark margin-left-2px">
                        {t("Of")} {props.segments.length}
                    </span>
                </span>
                <span className="usa-step-indicator__heading-text">
                    {props.current < props.segments.length && props.segments[props.current].label}
                </span>
            </h2>
        </div>
    );

    return (
        <div
            className="usa-step-indicator usa-step-indicator--counters-sm"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={props.segments.length}
            aria-valuenow={props.current + 1}
            aria-valuetext={t("StepIndicatorLabel", {
                current: props.current + 1,
                total: props.segments.length,
                title: props.segments[props.current].label,
            })}
        >
            {props.showStepChart ? stepChart : ""}
            {props.showStepText ? stepText : ""}
        </div>
    );
}

interface SegmentProps {
    current?: boolean;
    complete?: boolean;
    label: string;
}

function Segment(props: SegmentProps) {
    const { t } = useTranslation();
    if (props.current) {
        return (
            <li
                className="usa-step-indicator__segment usa-step-indicator__segment--current"
                aria-current="step"
            >
                <span className="usa-step-indicator__segment-label">
                    <div className="text-base-dark">{props.label}</div>
                </span>
            </li>
        );
    }

    if (props.complete) {
        return (
            <li className="usa-step-indicator__segment usa-step-indicator__segment--complete">
                <span className="usa-step-indicator__segment-label">
                    <div className="text-base-dark">{props.label}</div>{" "}
                    <span className="usa-sr-only">{t("Completed")}</span>
                </span>
            </li>
        );
    }

    return (
        <li className="usa-step-indicator__segment">
            <span className="usa-step-indicator__segment-label">
                <div className="text-base-dark">{props.label}</div>{" "}
                <span className="usa-sr-only">{t("NotCompleted")}</span>
            </span>
        </li>
    );
}

export default StepIndicator;
