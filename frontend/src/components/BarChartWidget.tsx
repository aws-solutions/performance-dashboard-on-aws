/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useColors } from "../hooks";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import ShareButton from "./ShareButton";
import BarChart from "@cloudscape-design/components/bar-chart";
import styles from "./BarChartWidget.module.scss";
import { useTranslation } from "react-i18next";

type Props = {
    id: string;
    title: string;
    downloadTitle: string;
    summary: string;
    bars: Array<string>;
    data?: Array<any>;
    summaryBelow: boolean;
    hideLegend?: boolean;
    significantDigitLabels: boolean;
    colors?: {
        primary: string | undefined;
        secondary: string | undefined;
    };
    columnsMetadata: Array<any>;
    showMobilePreview?: boolean;
    stackedChart?: boolean;
    height?: number;
};

const BarChartWidget = (props: Props) => {
    const { t } = useTranslation();

    const colors = useColors(props.bars.length, props.colors?.primary, props.colors?.secondary);

    const { data, bars, showMobilePreview } = props;

    const columnsMetadataDict = new Map();
    props.columnsMetadata.forEach((el) => columnsMetadataDict.set(el.columnName, el));

    let xAxisLargestValue = 0;

    const dataSeries = (data: any[]): any[] => {
        const result = props.bars.slice(1).map((bar, index) => {
            return {
                data: data.map((row) => {
                    xAxisLargestValue = Math.max(xAxisLargestValue, row[bar]);
                    return {
                        x: row[bars[0]],
                        y: row[bar],
                    };
                }),
                title: bar,
                type: "bar",
                color: colors[index],
                valueFormatter: (tick: any) => {
                    return TickFormatter.format(
                        Number(tick),
                        xAxisLargestValue,
                        props.significantDigitLabels,
                        "",
                        "",
                        columnsMetadataDict.get(bar),
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
                    className="usa-prose margin-top-0 margin-bottom-4 chartSummaryAbove textOrSummary"
                />
            )}
            {data && data.length > 0 && (
                <div className={`chart-container ${styles.barChart}`}>
                    <BarChart
                        series={dataSeries(data)}
                        i18nStrings={{
                            detailPopoverDismissAriaLabel: t(
                                "ChartAriaLabels.DetailPopoverDismissAriaLabel",
                            ),
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
                        hideFilter
                        xScaleType="categorical"
                        horizontalBars
                        stackedBars={props.stackedChart}
                        hideLegend={props.hideLegend}
                        height={props.height}
                    />
                </div>
            )}
            <div>
                <DataTable
                    rows={data || []}
                    columns={bars}
                    columnsMetadata={props.columnsMetadata}
                    fileName={props.downloadTitle}
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

export default BarChartWidget;
