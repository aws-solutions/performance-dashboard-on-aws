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
import BarChart from "@cloudscape-design/components/bar-chart";
import { useTranslation } from "react-i18next";

type Props = {
    id: string;
    title: string;
    downloadTitle: string;
    summary: string;
    columns: Array<string>;
    data?: Array<any>;
    summaryBelow: boolean;
    isPreview?: boolean;
    hideLegend?: boolean;
    horizontalScroll?: boolean;
    stackedChart?: boolean;
    hideDataLabels?: boolean;
    setWidthPercent?: (widthPercent: number) => void;
    significantDigitLabels: boolean;
    colors?: {
        primary: string | undefined;
        secondary: string | undefined;
    };
    columnsMetadata: Array<any>;
    showMobilePreview?: boolean;
};

function ColumnChartWidget(props: Props) {
    const { t } = useTranslation();

    const chartRef = useRef(null);
    const [chartLoaded, setChartLoaded] = useState(false);
    const { yAxisLargestValue } = useYAxisMetadata(
        chartRef,
        chartLoaded,
        props.significantDigitLabels,
    );

    const colors = useColors(props.columns.length, props.colors?.primary, props.colors?.secondary);

    const { data, columns, showMobilePreview } = props;

    const columnsMetadataDict = new Map();
    props.columnsMetadata.forEach((el) => columnsMetadataDict.set(el.columnName, el));

    /**
     * Calculate the width percent out of the total width
     * depending on the container. Width: (largestHeader + 1) *
     * headersCount * pixelsByCharacter + marginLeft + marginRight
     */
    const widthPercent = UtilsService.computeChartWidgetWidthPercent({
        ...props,
        headers: props.columns,
    });

    useEffect(() => {
        if (props.setWidthPercent) {
            props.setWidthPercent(widthPercent);
        }
    }, [props, widthPercent]);

    const dataSeries = (data: any[]): any[] => {
        const result = props.columns.slice(1).map((column, index) => {
            return {
                data: data.map((row) => {
                    return {
                        x: row[columns[0]],
                        y: row[column],
                    };
                }),
                title: column,
                type: "bar",
                color: colors[index],
                valueFormatter: (tick: any) => {
                    // Check if there is metadata for this column
                    let columnMetadata;
                    if (props.columnsMetadata) {
                        columnMetadata = props.columnsMetadata.find(
                            (cm) => cm.columnName === column,
                        );
                    }

                    return TickFormatter.format(
                        Number(tick),
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
                <div>
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
                                    yAxisLargestValue,
                                    props.significantDigitLabels,
                                    "",
                                    "",
                                );
                            },
                        }}
                        height={300}
                        ariaLabel={props.title}
                        hideFilter
                        xScaleType="categorical"
                        stackedBars={props.stackedChart}
                    />
                </div>
            )}
            <div>
                <DataTable
                    rows={data || []}
                    columns={columns}
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

export default ColumnChartWidget;
