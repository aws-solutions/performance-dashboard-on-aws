/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, MouseEvent } from "react";
import { ChartType, DatasetType } from "../models";
import { useTranslation } from "react-i18next";
import Alert from "./Alert";
import BarChartWidget from "./BarChartWidget";
import Button from "./Button";
import ColumnChartWidget from "./ColumnChartWidget";
import LineChartWidget from "./LineChartWidget";
import Link from "./Link";
import PartWholeChartWidget from "./PartWholeChartWidget";
import RadioButtons from "./RadioButtons";
import Spinner from "./Spinner";
import TextField from "./TextField";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./Dropdown";
import DatasetParsingService from "../services/DatasetParsingService";
import PrimaryActionBar from "./PrimaryActionBar";
import PieChartWidget from "./PieChartWidget";
import DonutChartWidget from "./DonutChartWidget";
import { useWindowSize } from "../hooks";
import UtilsService from "../services/UtilsService";

interface Props {
    widgetId: string;
    errors: any;
    register: Function;
    json: Array<any>;
    originalJson: Array<any>;
    headers: Array<string>;
    csvJson: Array<any>;
    datasetLoading: boolean;
    datasetType: DatasetType | undefined;
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
    backStep: (event: MouseEvent<HTMLButtonElement>) => void;
    advanceStep: (event: MouseEvent<HTMLButtonElement>) => void;
    fileLoading: boolean;
    processingWidget: boolean;
    fullPreviewButton: JSX.Element;
    previewPanelId: string;
    fullPreview: boolean;
    submitButtonLabel: string;
    sortByColumn?: string;
    sortByDesc?: boolean;
    setSortByColumn: Function;
    setSortByDesc: Function;
    title: string;
    summary: string;
    chartType: ChartType;
    showTitle: boolean;
    summaryBelow: boolean;
    significantDigitLabels: boolean;
    horizontalScroll: boolean;
    stackedChart: boolean;
    dataLabels: boolean;
    computePercentages: boolean;
    showTotal: boolean;
    columnsMetadata: Array<any>;
    configHeader: JSX.Element;
}

function VisualizeChart(props: Props) {
    const { t } = useTranslation();
    const [showAlert, setShowAlert] = useState(true);
    const [widthPercent, setWidthPercent] = useState(0);
    const windowSize = useWindowSize();
    const isMobile = windowSize.width <= 600;

    const handleSortDataChange = (event: React.FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        if (target.value !== "") {
            const sortData = target.value.split("###");
            const header = sortData[0];
            const desc = sortData[1] === "desc";
            props.setSortByColumn(header);
            props.setSortByDesc(desc);
        } else {
            props.setSortByColumn(undefined);
            props.setSortByDesc(undefined);
        }
    };

    return (
        <div className="grid-row">
            <div className="tablet:grid-col-6" hidden={props.fullPreview}>
                <PrimaryActionBar>
                    {props.configHeader}
                    {props.errors.title && (
                        <Alert
                            type="error"
                            message={t("VisualizeChartComponent.ResolveErrors")}
                            slim
                        ></Alert>
                    )}

                    <fieldset className="usa-fieldset">
                        <legend className={`usa-hint ${isMobile ? "grid-col-12" : "grid-col-6"}`}>
                            {t("AddChartScreen.Configure")}
                        </legend>

                        <TextField
                            id="title"
                            name="title"
                            label={t("VisualizeChartComponent.ChartTitle")}
                            hint={t("VisualizeChartComponent.ChartTitleHint")}
                            error={
                                props.errors.title && t("VisualizeChartComponent.ChartTitleError")
                            }
                            required
                            register={props.register}
                        />

                        <div className="usa-checkbox">
                            <input
                                className="usa-checkbox__input"
                                id="display-title"
                                type="checkbox"
                                name="showTitle"
                                defaultChecked={true}
                                ref={props.register()}
                            />
                            <label className="usa-checkbox__label" htmlFor="display-title">
                                {t("AddTextScreen.ShowTitle")}
                            </label>
                        </div>

                        <RadioButtons
                            id="chartType"
                            name="chartType"
                            label={t("VisualizeChartComponent.ChartType")}
                            hint={t("VisualizeChartComponent.ChartTypeHint")}
                            register={props.register}
                            error={
                                props.errors.chartType &&
                                t("VisualizeChartComponent.ChartTypeError")
                            }
                            defaultValue={ChartType.LineChart}
                            required
                            options={[
                                {
                                    value: ChartType.LineChart,
                                    label: t("Line"),
                                },
                                {
                                    value: ChartType.BarChart,
                                    label: t("Bar"),
                                },
                                {
                                    value: ChartType.ColumnChart,
                                    label: t("Column"),
                                },
                                {
                                    value: ChartType.PartWholeChart,
                                    label: t("PartToWhole"),
                                },
                                {
                                    value: ChartType.PieChart,
                                    label: t("Pie"),
                                },
                                {
                                    value: ChartType.DonutChart,
                                    label: t("Donut"),
                                },
                            ]}
                        />
                        <div className="margin-top-3">
                            <Dropdown
                                id="sortData"
                                name="sortData"
                                label={t("SortData")}
                                options={DatasetParsingService.getDatasetSortOptions(
                                    props.originalJson,
                                    props.headers,
                                    t,
                                    props.chartType,
                                )}
                                onChange={handleSortDataChange}
                                defaultValue={UtilsService.getSortData(
                                    props.sortByColumn,
                                    props.sortByDesc,
                                )}
                                register={props.register}
                            />
                        </div>

                        <div>
                            <label className="usa-label text-bold">{t("ChartOptionsLabel")}</label>
                            <div className="usa-hint">{t("ChartOptionsDescription")}</div>
                            <div className="usa-checkbox">
                                <input
                                    className="usa-checkbox__input"
                                    id="significantDigitLabels"
                                    type="checkbox"
                                    name="significantDigitLabels"
                                    defaultChecked={false}
                                    ref={props.register()}
                                />
                                <label
                                    className="usa-checkbox__label"
                                    htmlFor="significantDigitLabels"
                                >
                                    {t("SignificantDigitLabels")}
                                </label>
                            </div>

                            <div
                                className="usa-checkbox"
                                hidden={
                                    props.chartType !== ChartType.BarChart &&
                                    props.chartType !== ChartType.ColumnChart
                                }
                            >
                                <input
                                    className="usa-checkbox__input"
                                    id="stackedChart"
                                    type="checkbox"
                                    name="stackedChart"
                                    defaultChecked={!!props.stackedChart}
                                    ref={props.register()}
                                />
                                <label className="usa-checkbox__label" htmlFor="stackedChart">
                                    {t("VisualizeChartComponent.StackedChart")}
                                </label>
                            </div>

                            <div
                                className="usa-checkbox"
                                hidden={
                                    props.chartType !== ChartType.PieChart &&
                                    props.chartType !== ChartType.DonutChart
                                }
                            >
                                <input
                                    className="usa-checkbox__input"
                                    id="dataLabels"
                                    type="checkbox"
                                    name="dataLabels"
                                    defaultChecked={false}
                                    ref={props.register()}
                                />
                                <label className="usa-checkbox__label" htmlFor="dataLabels">
                                    {t("VisualizeChartComponent.ShowDataLabels")}
                                </label>
                            </div>

                            <div
                                className="usa-checkbox"
                                hidden={
                                    props.chartType !== ChartType.PieChart &&
                                    props.chartType !== ChartType.DonutChart
                                }
                            >
                                <input
                                    className="usa-checkbox__input"
                                    id="computePercentages"
                                    type="checkbox"
                                    name="computePercentages"
                                    defaultChecked={false}
                                    ref={props.register()}
                                />
                                <label className="usa-checkbox__label" htmlFor="computePercentages">
                                    {t("VisualizeChartComponent.ComputePercentages")}
                                </label>
                            </div>

                            <div
                                className="usa-checkbox"
                                hidden={props.chartType !== ChartType.DonutChart}
                            >
                                <input
                                    className="usa-checkbox__input"
                                    id="showTotal"
                                    type="checkbox"
                                    name="showTotal"
                                    defaultChecked={true}
                                    ref={props.register()}
                                />
                                <label className="usa-checkbox__label" htmlFor="showTotal">
                                    {t("VisualizeChartComponent.ShowTotal")}
                                </label>
                            </div>

                            <div
                                className="usa-checkbox"
                                hidden={
                                    (props.chartType !== ChartType.LineChart &&
                                        props.chartType !== ChartType.ColumnChart) ||
                                    widthPercent <= 100
                                }
                            >
                                <input
                                    className="usa-checkbox__input"
                                    id="horizontalScroll"
                                    type="checkbox"
                                    name="horizontalScroll"
                                    defaultChecked={!!props.horizontalScroll}
                                    ref={props.register()}
                                />
                                <label className="usa-checkbox__label" htmlFor="horizontalScroll">
                                    {t("VisualizeChartComponent.DisplayHorizontalScroll")}
                                </label>
                            </div>
                        </div>

                        <TextField
                            id="summary"
                            name="summary"
                            label={t("VisualizeChartComponent.ChartSummary")}
                            hint={
                                <>
                                    {t("VisualizeChartComponent.ChartSummaryHint")}{" "}
                                    <Link target="_blank" to={"/admin/markdown"} external>
                                        {t("AddTextScreen.ViewMarkdownSyntax")}
                                    </Link>
                                </>
                            }
                            register={props.register}
                            multiline
                            rows={5}
                        />

                        <div className="usa-checkbox">
                            <input
                                className="usa-checkbox__input"
                                id="summary-below"
                                type="checkbox"
                                name="summaryBelow"
                                defaultChecked={false}
                                ref={props.register()}
                            />
                            <label className="usa-checkbox__label" htmlFor="summary-below">
                                {t("VisualizeChartComponent.ChartShowSummary")}
                            </label>
                        </div>
                        <br />
                        <br />
                        <hr />
                        <Button
                            variant="outline"
                            type="button"
                            onClick={props.backStep}
                            className="margin-top-1"
                        >
                            {t("BackButton")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !props.json.length || props.fileLoading || props.processingWidget
                            }
                            className="margin-top-1"
                        >
                            {props.submitButtonLabel}
                        </Button>
                        <Button
                            variant="unstyled"
                            className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-1"
                            type="button"
                            onClick={props.onCancel}
                        >
                            {t("Cancel")}
                        </Button>
                    </fieldset>
                </PrimaryActionBar>
            </div>
            <section
                className={props.fullPreview ? "tablet:grid-col-12" : "tablet:grid-col-6"}
                aria-label={t("ContentPreview")}
            >
                <div
                    hidden={!props.json.length}
                    className={`${!props.fullPreview ? "margin-left-4 sticky-preview" : ""}`}
                >
                    {isMobile ? <br /> : props.fullPreviewButton}
                    <div id={props.previewPanelId}>
                        {props.datasetLoading ? (
                            <Spinner
                                className="text-center margin-top-6"
                                label={t("LoadingSpinnerLabel")}
                            />
                        ) : (
                            <>
                                {showAlert &&
                                props.datasetType === DatasetType.StaticDataset &&
                                props.csvJson.length ? (
                                    <Alert
                                        type="info"
                                        message={
                                            <div className="grid-row margin-left-6">
                                                <div className="grid-col-11">
                                                    {t(
                                                        "VisualizeChartComponent.ChartCorrectDisplay",
                                                    )}{" "}
                                                    <Link
                                                        to="/admin/formatting"
                                                        target="_blank"
                                                        external
                                                    >
                                                        {t("LearnHowToFormatCSV")}
                                                    </Link>
                                                </div>
                                                <div className="grid-col-1">
                                                    <div className="margin-1">
                                                        <Button
                                                            variant="unstyled"
                                                            className="margin-0-important text-base-dark hover:text-base-darker active:text-base-darkest"
                                                            onClick={() => setShowAlert(false)}
                                                            type="button"
                                                            ariaLabel={t("GlobalClose")}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTimes}
                                                                size="sm"
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        slim
                                    />
                                ) : (
                                    ""
                                )}
                                {props.chartType === ChartType.LineChart && (
                                    <LineChartWidget
                                        id={props.widgetId}
                                        title={props.showTitle ? props.title : ""}
                                        downloadTitle={props.title}
                                        summary={props.summary}
                                        lines={props.json.length ? Object.keys(props.json[0]) : []}
                                        data={props.json}
                                        summaryBelow={props.summaryBelow}
                                        isPreview={!props.fullPreview}
                                        horizontalScroll={props.horizontalScroll}
                                        setWidthPercent={setWidthPercent}
                                        significantDigitLabels={props.significantDigitLabels}
                                        columnsMetadata={props.columnsMetadata}
                                    />
                                )}
                                {props.chartType === ChartType.ColumnChart && (
                                    <ColumnChartWidget
                                        id={props.widgetId}
                                        title={props.showTitle ? props.title : ""}
                                        downloadTitle={props.title}
                                        summary={props.summary}
                                        columns={
                                            props.json.length ? Object.keys(props.json[0]) : []
                                        }
                                        data={props.json}
                                        summaryBelow={props.summaryBelow}
                                        isPreview={!props.fullPreview}
                                        horizontalScroll={props.horizontalScroll}
                                        stackedChart={props.stackedChart}
                                        setWidthPercent={setWidthPercent}
                                        significantDigitLabels={props.significantDigitLabels}
                                        columnsMetadata={props.columnsMetadata || []}
                                        hideDataLabels={!props.dataLabels}
                                    />
                                )}
                                {props.chartType === ChartType.BarChart && (
                                    <BarChartWidget
                                        id={props.widgetId}
                                        title={props.showTitle ? props.title : ""}
                                        downloadTitle={props.title}
                                        summary={props.summary}
                                        bars={props.json.length ? Object.keys(props.json[0]) : []}
                                        data={props.json}
                                        summaryBelow={props.summaryBelow}
                                        significantDigitLabels={props.significantDigitLabels}
                                        columnsMetadata={props.columnsMetadata || []}
                                        hideDataLabels={!props.dataLabels}
                                        stackedChart={props.stackedChart}
                                    />
                                )}
                                {props.chartType === ChartType.PartWholeChart && (
                                    <PartWholeChartWidget
                                        id={props.widgetId}
                                        title={props.showTitle ? props.title : ""}
                                        downloadTitle={props.title}
                                        summary={props.summary}
                                        parts={props.json.length ? Object.keys(props.json[0]) : []}
                                        data={props.json}
                                        summaryBelow={props.summaryBelow}
                                        significantDigitLabels={props.significantDigitLabels}
                                        columnsMetadata={props.columnsMetadata}
                                    />
                                )}
                                {props.chartType === ChartType.PieChart && (
                                    <PieChartWidget
                                        id={props.widgetId}
                                        title={props.showTitle ? props.title : ""}
                                        downloadTitle={props.title}
                                        summary={props.summary}
                                        parts={props.json.length ? Object.keys(props.json[0]) : []}
                                        data={props.json}
                                        summaryBelow={props.summaryBelow}
                                        significantDigitLabels={props.significantDigitLabels}
                                        hideDataLabels={!props.dataLabels}
                                        isPreview={!props.fullPreview}
                                        columnsMetadata={props.columnsMetadata}
                                        computePercentages={props.computePercentages}
                                    />
                                )}
                                {props.chartType === ChartType.DonutChart && (
                                    <DonutChartWidget
                                        id={props.widgetId}
                                        title={props.showTitle ? props.title : ""}
                                        downloadTitle={props.title}
                                        summary={props.summary}
                                        parts={props.json.length ? Object.keys(props.json[0]) : []}
                                        data={props.json}
                                        summaryBelow={props.summaryBelow}
                                        significantDigitLabels={props.significantDigitLabels}
                                        hideDataLabels={!props.dataLabels}
                                        showTotal={props.showTotal}
                                        isPreview={!props.fullPreview}
                                        columnsMetadata={props.columnsMetadata}
                                        computePercentages={props.computePercentages}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default VisualizeChart;
