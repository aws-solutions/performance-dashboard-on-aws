/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Metric } from "../models";
import MetricsCardGroup from "../components/MetricsCardGroup";
import ShareButton from "./ShareButton";

type Props = {
    id: string;
    title: string;
    metrics: Array<Metric>;
    metricPerRow: number;
    significantDigitLabels: boolean;
    metricsCenterAlign: boolean;
};

const MetricsWidget = ({
    id,
    title,
    metrics,
    metricPerRow,
    significantDigitLabels,
    metricsCenterAlign,
}: Props) => {
    return (
        <div aria-label={title} tabIndex={-1} className={title ? "" : "padding-top-2"}>
            {title && (
                <h2 className="margin-top-3">
                    {title}
                    <ShareButton id={`${id}a`} title={title} className="margin-left-1" />
                </h2>
            )}
            {metrics.length ? (
                <div>
                    <MetricsCardGroup
                        metrics={metrics}
                        metricPerRow={metricPerRow}
                        significantDigitLabels={significantDigitLabels}
                        metricsCenterAlign={metricsCenterAlign}
                    />
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default MetricsWidget;
