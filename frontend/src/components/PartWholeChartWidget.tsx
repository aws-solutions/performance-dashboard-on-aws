/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { useColors } from "../hooks";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import ShareButton from "./ShareButton";
import BarChart from "@cloudscape-design/components/bar-chart";
import { useTranslation } from "react-i18next";

type Props = {
    id: string;
    title: string;
    downloadTitle: string;
    summary: string;
    parts: Array<string>;
    data?: Array<object>;
    summaryBelow: boolean;
    significantDigitLabels: boolean;
    columnsMetadata: Array<any>;
    colors?: {
        primary: string | undefined;
        secondary: string | undefined;
    };
    showMobilePreview?: boolean;
};

const PartWholeChartWidget = (props: Props) => {
    const { t } = useTranslation();

    const [xAxisLargestValue, setXAxisLargestValue] = useState(0);

    const { data, parts, showMobilePreview } = props;
    useMemo(() => {
        if (data && data.length > 0) {
            let maxTick = -Infinity;
            for (let dataItem of data) {
                const value = dataItem[parts[1] as keyof object];
                maxTick = Math.max(maxTick, value);
            }
            setXAxisLargestValue(maxTick);
        }
    }, [data, parts]);

    const colors = useColors(data?.length ?? 0, props.colors?.primary, props.colors?.secondary);

    const dataSeries = (data: object[]): any[] => {
        const result = data.map((dataItem, index) => {
            return {
                data: [{ x: "", y: dataItem[parts[1] as keyof object] }],
                title: dataItem[parts[0] as keyof object],
                type: "bar",
                color: colors[index],
                valueFormatter: (tick: any) => {
                    return TickFormatter.format(
                        Number(tick),
                        xAxisLargestValue,
                        props.significantDigitLabels,
                        "",
                        "",
                    );
                },
            };
        });
        return result;
    };

    return (
        <div aria-label={props.title} tabIndex={-1} className={props.title ? "" : "padding-top-2"}>
            {props.title && (
                <h2 className={`margin-bottom-${props.summaryBelow ? "4" : "1"}`}>
                    {props.title}
                    <ShareButton
                        id={`${props.id}a`}
                        title={props.title}
                        className="margin-left-1"
                    />
                </h2>
            )}
            {!props.summaryBelow && (
                <MarkdownRender
                    source={props.summary}
                    className="usa-prose margin-top-1 margin-bottom-4 chartSummaryAbove textOrSummary"
                />
            )}
            {data && data.length > 0 && (
                <div className="chart-container">
                    <BarChart
                        series={dataSeries(props.data ?? [])}
                        i18nStrings={{
                            legendAriaLabel: t("ChartAriaLabels.LegendAriaLabel"),
                            chartAriaRoleDescription: props.summary,
                            yTickFormatter: (tick: any) => {
                                return TickFormatter.format(
                                    Number(tick),
                                    xAxisLargestValue,
                                    props.significantDigitLabels,
                                    "",
                                    "",
                                );
                            },
                        }}
                        ariaLabel={props.title}
                        height={80}
                        hideFilter
                        horizontalBars
                        stackedBars
                        xScaleType="categorical"
                    />
                </div>
            )}
            <div>
                <DataTable
                    rows={data || []}
                    columns={parts}
                    fileName={props.downloadTitle}
                    columnsMetadata={props.columnsMetadata}
                    showMobilePreview={showMobilePreview}
                    title={props.title}
                />
            </div>
            {props.summaryBelow && (
                <div>
                    <MarkdownRender
                        source={props.summary}
                        className="usa-prose margin-top-1 margin-bottom-0 chartSummaryBelow textOrSummary"
                    />
                </div>
            )}
        </div>
    );
};

export default PartWholeChartWidget;
