/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { useColors, useYAxisMetadata } from "../hooks";
import UtilsService from "../services/UtilsService";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import ShareButton from "./ShareButton";
import LineChart from "@cloudscape-design/components/line-chart";
import "./LineChartWidget.module.scss";
import { ScaleType } from "@cloudscape-design/components/mixed-line-bar-chart/interfaces";

type Props = {
    id: string;
    title: string;
    downloadTitle: string;
    summary: string;
    lines: Array<string>;
    data?: Array<any>;
    summaryBelow: boolean;
    horizontalScroll?: boolean;
    setWidthPercent?: (widthPercent: number) => void;
    isPreview?: boolean;
    significantDigitLabels: boolean;
    colors?: {
        primary: string | undefined;
        secondary: string | undefined;
    };
    columnsMetadata: Array<any>;
    showMobilePreview?: boolean;
};

function LineChartWidget(props: Props) {
    const chartRef = useRef(null);
    const [chartLoaded, setChartLoaded] = useState(false);
    const { yAxisLargestValue } = useYAxisMetadata(
        chartRef,
        chartLoaded,
        props.significantDigitLabels,
    );

    const colors = useColors(props.lines.length, props.colors?.primary, props.colors?.secondary);

    const { data, lines, showMobilePreview } = props;

    const dataSeries = (data: any[]): any[] => {
        const result = props.lines.slice(1).map((line, index) => {
            return {
                data: data.map((row, index) => {
                    return {
                        x: index,
                        y: row[line],
                    };
                }),
                title: line,
                type: "line",
                color: colors[index],
                valueFormatter: (value: any) => {
                    // Check if there is metadata for this column
                    let columnMetadata;
                    if (props.columnsMetadata) {
                        columnMetadata = props.columnsMetadata.find((cm) => cm.columnName === line);
                    }

                    return TickFormatter.format(
                        Number(value),
                        yAxisLargestValue,
                        props.significantDigitLabels,
                        "",
                        "",
                        columnMetadata,
                    );
                },
            };
        });
        return result;
    };

    const getXScaleType = (data: any[]): ScaleType => {
        return data.length < 5 ? "categorical" : "linear";
    };

    /**
     * Calculate the width percent out of the total width
     * depending on the container. Width: (largestHeader + 1) *
     * headersCount * pixelsByCharacter + marginLeft + marginRight
     */
    const widthPercent = UtilsService.computeChartWidgetWidthPercent({
        ...props,
        headers: props.lines,
    });

    useEffect(() => {
        if (props.setWidthPercent) {
            props.setWidthPercent(widthPercent);
        }
    }, [props, widthPercent]);

    return (
        <div
            aria-label={props.title}
            tabIndex={-1}
            className={`overflow-x-hidden overflow-y-hidden${
                widthPercent > 100 && props.horizontalScroll ? " scroll-shadow" : ""
            } ${props.title ? "" : "padding-top-2"}`}
        >
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
                <div aria-hidden="true">
                    <LineChart
                        height={300}
                        series={dataSeries(data)}
                        i18nStrings={{
                            detailPopoverDismissAriaLabel: "Dismiss",
                            legendAriaLabel: "Legend",
                            chartAriaRoleDescription: props.summary,
                            yTickFormatter: (tick: any) => {
                                return TickFormatter.format(
                                    Number(tick),
                                    yAxisLargestValue,
                                    props.significantDigitLabels,
                                    "",
                                    "",
                                );
                            },
                            xTickFormatter: (tick: any) => {
                                return data[tick][props.lines[0]];
                            },
                        }}
                        xScaleType={getXScaleType(data)}
                        ariaLabel={props.title}
                        hideFilter
                    />
                </div>
            )}
            <div>
                <DataTable
                    rows={data || []}
                    columns={lines}
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
}

export default LineChartWidget;
