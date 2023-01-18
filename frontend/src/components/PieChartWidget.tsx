/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useState } from "react";
import { useColors } from "../hooks";
import TickFormatter from "../services/TickFormatter";
import MarkdownRender from "./MarkdownRender";
import DataTable from "./DataTable";
import { ColumnMetadata, NumberDataType } from "../models";
import ShareButton from "./ShareButton";
import PieChart from "@cloudscape-design/components/pie-chart";
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
    colors?: {
        primary: string | undefined;
        secondary: string | undefined;
    };
    columnsMetadata: Array<any>;
    hideDataLabels?: boolean;
    isPreview?: boolean;
    showMobilePreview?: boolean;
    computePercentages?: boolean;
};

const PieChartWidget = (props: Props) => {
    const { t } = useTranslation();

    const [xAxisLargestValue, setXAxisLargestValue] = useState(0);

    const pieParts = useRef<Array<string>>([]);
    let total = useRef<number>(0);

    const { data, parts, showMobilePreview } = props;
    useMemo(() => {
        if (data && data.length > 0) {
            total.current = 0;
            let maxTick = -Infinity;
            for (let dataItem of data) {
                const value = dataItem[parts[1] as keyof object];
                total.current += isNaN(value) ? 0 : Number(value);
                maxTick = Math.max(maxTick, value);
            }
            setXAxisLargestValue(maxTick);
        }
    }, [data, parts]);

    const colors = useColors(
        pieParts.current.length,
        props.colors?.primary,
        props.colors?.secondary,
    );

    const displayedAmount = (value: number | string, columnMetadata: ColumnMetadata): string => {
        const displayedAmount = TickFormatter.format(
            Number(value),
            xAxisLargestValue,
            props.significantDigitLabels,
            "",
            "",
            columnMetadata,
        );
        const computedPercentage = Math.round((Number(value) / total.current) * 100 * 100) / 100;
        const displayedPercentage = TickFormatter.format(
            computedPercentage,
            xAxisLargestValue,
            false,
            NumberDataType.Percentage,
            "",
        );
        return props.computePercentages
            ? `${displayedAmount} (${displayedPercentage})`
            : displayedAmount;
    };

    const dataSeries = (data: object[]): any[] => {
        const result = data.map((dataItem, index) => {
            const key = dataItem[parts[0] as keyof object];
            const value = dataItem[parts[1] as keyof object];
            return {
                title: key,
                value: value,
                color: colors[index],
            };
        });
        return result;
    };

    const displayDataValue = (dataItem: any): string => {
        // Check if there is metadata for this column
        let columnMetadata;
        if (parts && parts.length > 1 && props.columnsMetadata) {
            columnMetadata = props.columnsMetadata.find((cm) => cm.columnName === parts[1]);
        }
        return displayedAmount(dataItem.value, columnMetadata);
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
                    <PieChart
                        data={dataSeries(props.data ?? [])}
                        segmentDescription={(datum) => {
                            if (props.hideDataLabels) {
                                return "";
                            }
                            return displayDataValue(datum);
                        }}
                        detailPopoverContent={(datum) => {
                            return [
                                {
                                    key: datum.title,
                                    value: displayDataValue(datum),
                                },
                            ];
                        }}
                        i18nStrings={{
                            detailPopoverDismissAriaLabel: t(
                                "ChartAriaLabels.DetailPopoverDismissAriaLabel",
                            ),
                            legendAriaLabel: t("ChartAriaLabels.LegendAriaLabel"),
                            chartAriaRoleDescription: props.summary,
                        }}
                        ariaDescription={props.summary}
                        ariaLabel={props.title}
                        size="large"
                        hideFilter
                        hideTitles={props.hideDataLabels}
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

export default PieChartWidget;
