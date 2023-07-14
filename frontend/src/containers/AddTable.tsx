/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import {
    ColumnDataType,
    CurrencyDataType,
    LocationState,
    NumberDataType,
    Dataset,
    DatasetType,
    WidgetType,
} from "../models";
import BackendService from "../services/BackendService";
import {
    useDashboard,
    useFullPreview,
    useChangeBackgroundColor,
    useScrollUp,
    useDatasets,
} from "../hooks";
import StorageService from "../services/StorageService";
import ParsingFileService from "../services/ParsingFileService";
import DatasetParsingService from "../services/DatasetParsingService";
import Breadcrumbs from "../components/Breadcrumbs";
import StepIndicator from "../components/StepIndicator";
import ChooseData from "../components/ChooseData";
import CheckData from "../components/CheckData";
import Visualize from "../components/VisualizeTable";
import ColumnsMetadataService from "../services/ColumnsMetadataService";
import UtilsService from "../services/UtilsService";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
import Alert from "../components/Alert";

interface FormValues {
    title: string;
    summary: string;
    showTitle: boolean;
    summaryBelow: boolean;
    datasetType: string;
    sortData: string;
    significantDigitLabels: boolean;
    displayWithPages: boolean;
}

interface PathParams {
    dashboardId: string;
}

function AddTable() {
    const history = useHistory<LocationState>();
    const { state } = history.location;
    const { t } = useTranslation();
    const { dashboardId } = useParams<PathParams>();
    const { dashboard, loading } = useDashboard(dashboardId);
    const { dynamicDatasets } = useDatasets();
    const { register, errors, handleSubmit, reset, watch } = useForm<FormValues>();
    const [currentJson, setCurrentJson] = useState<Array<any>>(
        state && state.json ? state.json : [],
    );
    const [dynamicJson, setDynamicJson] = useState<Array<any>>([]);
    const [staticJson] = useState<Array<any>>(state && state.json ? state.json : []);
    const [csvJson, setCsvJson] = useState<Array<any>>([]);
    const [filteredJson, setFilteredJson] = useState<Array<any>>(currentJson);
    const [dynamicDataset, setDynamicDataset] = useState<Dataset | undefined>(undefined);
    const [staticDataset] = useState<Dataset | undefined>(
        state && state.staticDataset ? state.staticDataset : undefined,
    );
    const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(undefined);
    const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
    const [fileLoading, setFileLoading] = useState(false);
    const [datasetLoading, setDatasetLoading] = useState(false);
    const [creatingWidget, setCreatingWidget] = useState(false);
    const [showNoDatasetTypeAlert, setShowNoDatasetTypeAlert] = useState(false);
    const [datasetType, setDatasetType] = useState<DatasetType | undefined>(
        state && state.json ? DatasetType.StaticDataset : undefined,
    );
    const [step, setStep] = useState<number>(state && state.json ? 1 : 0);
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set<string>());
    const [sortByColumn, setSortByColumn] = useState<string | undefined>(undefined);
    const [sortByDesc, setSortByDesc] = useState<boolean | undefined>(undefined);
    const previewPanelId = "preview-table-panel";
    const { fullPreview, fullPreviewButton } = useFullPreview(previewPanelId);
    const [dataTypes, setDataTypes] = useState<Map<string, ColumnDataType>>(
        new Map<string, ColumnDataType>(),
    );
    const [numberTypes, setNumberTypes] = useState<Map<string, NumberDataType>>(
        new Map<string, NumberDataType>(),
    );
    const [currencyTypes, setCurrencyTypes] = useState<Map<string, CurrencyDataType>>(
        new Map<string, CurrencyDataType>(),
    );
    const [oldStep, setOldStep] = useState<number>(-1);

    const title = watch("title");
    const showTitle = watch("showTitle");
    const summary = watch("summary");
    const summaryBelow = watch("summaryBelow");
    const significantDigitLabels = watch("significantDigitLabels");
    const displayWithPages = watch("displayWithPages");

    const initializeColumnsMetadata = () => {
        setHiddenColumns(new Set<string>());
        setDataTypes(new Map<string, ColumnDataType>());
        setNumberTypes(new Map<string, NumberDataType>());
        setCurrencyTypes(new Map<string, CurrencyDataType>());
        setSortByColumn(undefined);
        setSortByDesc(false);
    };

    useMemo(() => {
        const newFilteredJson = DatasetParsingService.getFilteredJson(currentJson, hiddenColumns);
        setFilteredJson(newFilteredJson);
    }, [currentJson, hiddenColumns]);

    const uploadDataset = async (): Promise<Dataset> => {
        if (!csvFile) {
            throw new Error(t("CSVFileNotSpecified"));
        }

        setFileLoading(true);
        const uploadResponse = await StorageService.uploadDataset(
            csvFile,
            JSON.stringify(currentJson),
            t,
        );

        const newDataset = await BackendService.createDataset(csvFile.name, {
            raw: uploadResponse.s3Keys.raw,
            json: uploadResponse.s3Keys.json,
        });

        setFileLoading(false);
        return newDataset;
    };

    const onSubmit = async (values: FormValues) => {
        try {
            let newDataset;
            if (csvFile) {
                newDataset = await uploadDataset();
            }

            setCreatingWidget(true);
            await BackendService.createWidget(
                dashboardId,
                values.title,
                WidgetType.Table,
                values.showTitle,
                {
                    title: values.title,
                    summary: values.summary,
                    summaryBelow: values.summaryBelow,
                    datasetType: datasetType,
                    significantDigitLabels: values.significantDigitLabels,
                    displayWithPages: values.displayWithPages,
                    datasetId: newDataset
                        ? newDataset.id
                        : UtilsService.getDatasetPropertyByDatasetType(
                              datasetType,
                              "id",
                              dynamicDataset,
                              staticDataset,
                          ),
                    s3Key: newDataset
                        ? newDataset.s3Key
                        : UtilsService.getDatasetPropertyByDatasetType(
                              datasetType,
                              "s3Key",
                              dynamicDataset,
                              staticDataset,
                          ),
                    fileName: csvFile
                        ? csvFile.name
                        : UtilsService.getDatasetPropertyByDatasetType(
                              datasetType,
                              "fileName",
                              dynamicDataset,
                              staticDataset,
                          ),
                    sortByColumn,
                    sortByDesc,
                    columnsMetadata: ColumnsMetadataService.getColumnsMetadata(
                        hiddenColumns,
                        dataTypes,
                        numberTypes,
                        currencyTypes,
                    ),
                },
            );
            setCreatingWidget(false);

            history.push(`/admin/dashboard/edit/${dashboardId}`, {
                alert: {
                    type: "success",
                    message: t("AddTableScreen.AddTableSuccess", {
                        title: values.title,
                    }),
                },
            });
        } catch (err) {
            console.log(t("AddContentFailure"), err);
            setCreatingWidget(false);
        }
    };

    const onCancel = () => {
        history.push(`/admin/dashboard/edit/${dashboardId}`);
    };

    const advanceStep = () => {
        setStep(step + 1);
        document.getElementById("Home")?.focus();
    };

    const backStep = () => {
        setStep(step - 1);
        document.getElementById("Home")?.focus();
    };

    const goBack = () => {
        history.push(`/admin/dashboard/${dashboardId}/add-content`);
        document.getElementById("Home")?.focus();
    };

    const selectDynamicDataset = async (selectedDataset: Dataset) => {
        setDatasetLoading(true);

        if (selectedDataset && selectedDataset.s3Key && selectedDataset.s3Key.json) {
            const jsonFile = selectedDataset.s3Key.json;

            initializeColumnsMetadata();
            const dataset = await StorageService.downloadJson(jsonFile);
            setDynamicJson(dataset);
            setCurrentJson(dataset);
            setDynamicDataset(dynamicDatasets.find((d) => d.s3Key.json === jsonFile));
        }

        setDatasetLoading(false);
    };

    const browseDatasets = () => {
        history.push({
            pathname: `/admin/dashboard/${dashboardId}/choose-static-dataset`,
            state: {
                redirectUrl: `/admin/dashboard/${dashboardId}/add-table/`,
                crumbLabel: t("AddTableScreen.AddTable"),
            },
        });
    };

    const onFileProcessed = (data: File) => {
        if (!data) {
            return;
        }
        setDatasetLoading(true);
        ParsingFileService.parseFile(data, false, (errors: any, results: any) => {
            initializeColumnsMetadata();
            if (errors !== null && errors.length) {
                setCsvErrors(errors);
                setCsvJson([]);
                setCurrentJson([]);
            } else {
                setShowNoDatasetTypeAlert(false);
                setCsvErrors(undefined);
                const csvJson = DatasetParsingService.createHeaderRowJson(results);
                setCsvJson(csvJson);
                setCurrentJson(csvJson);
            }
            setDatasetLoading(false);
        });
        setCsvFile(data);
    };

    const handleChange = async (event: React.FormEvent<HTMLFieldSetElement>) => {
        const target = event.target as HTMLInputElement;
        if (target.name === "datasetType") {
            const datasetType = target.value as DatasetType;
            setDatasetType(datasetType);
            initializeColumnsMetadata();
            await UtilsService.timeout(0);
            if (datasetType === DatasetType.DynamicDataset) {
                setCurrentJson(dynamicJson);
            }
            if (datasetType === DatasetType.StaticDataset) {
                if (csvJson && csvJson.length) {
                    setCurrentJson(csvJson);
                } else {
                    setCurrentJson(staticJson);
                }
            }
        }
    };

    useEffect(() => {
        if (datasetType) {
            reset({
                datasetType,
            });
        }
    }, []);

    const crumbs = [
        {
            label: t("Dashboards"),
            url: "/admin/dashboards",
        },
        {
            label: dashboard?.name,
            url: `/admin/dashboard/edit/${dashboardId}`,
        },
    ];

    if (!loading) {
        crumbs.push({
            label: t("AddTableScreen.AddTable"),
            url: "",
        });
    }

    const segments = [
        {
            label: t("AddTableScreen.ChooseData"),
        },
        {
            label: t("AddTableScreen.CheckData"),
        },
        {
            label: t("AddTableScreen.Visualize"),
        },
    ];
    const configHeader = (
        <div>
            <h1
                id="addTableFormHeader"
                className="margin-top-0"
                aria-label={t("AddTableScreen.AddTableLabel", {
                    step: segments[step].label.toLowerCase(),
                })}
            >
                {t("AddTableScreen.AddTable")}
            </h1>
            <StepIndicator
                current={step}
                segments={segments}
                showStepChart={true}
                showStepText={false}
            />
        </div>
    );

    useChangeBackgroundColor();
    useScrollUp(oldStep, step, setOldStep);

    return (
        <>
            <Breadcrumbs crumbs={crumbs} />

            <div className="grid-row">
                <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="addTableFormHeader">
                    <div className="grid-col-12"></div>

                    <div hidden={step !== 0}>
                        <PrimaryActionBar>
                            {configHeader}
                            <div className="margin-y-3" hidden={!showNoDatasetTypeAlert}>
                                <Alert
                                    type="error"
                                    message={t("AddTableScreen.ChooseDataset")}
                                    slim
                                />
                            </div>
                            <ChooseData
                                selectDynamicDataset={selectDynamicDataset}
                                dynamicDatasets={dynamicDatasets}
                                datasetType={datasetType}
                                onFileProcessed={onFileProcessed}
                                handleChange={handleChange}
                                backStep={goBack}
                                advanceStep={advanceStep}
                                fileLoading={fileLoading}
                                browseDatasets={browseDatasets}
                                hasErrors={!currentJson.length}
                                csvErrors={csvErrors}
                                csvFile={csvFile}
                                onCancel={onCancel}
                                register={register}
                                widgetType={t("ChooseDataDescriptionTable")}
                                staticFileName={undefined}
                                dynamicFileName={undefined}
                                setShowNoDatasetTypeAlert={setShowNoDatasetTypeAlert}
                            />
                        </PrimaryActionBar>
                    </div>

                    <div hidden={step !== 1}>
                        <PrimaryActionBar>
                            {configHeader}
                            <CheckData
                                data={currentJson}
                                advanceStep={advanceStep}
                                backStep={backStep}
                                hiddenColumns={hiddenColumns}
                                setHiddenColumns={setHiddenColumns}
                                onCancel={onCancel}
                                dataTypes={dataTypes}
                                setDataTypes={setDataTypes}
                                numberTypes={numberTypes}
                                setNumberTypes={setNumberTypes}
                                currencyTypes={currencyTypes}
                                setCurrencyTypes={setCurrencyTypes}
                                sortByColumn={sortByColumn}
                                sortByDesc={sortByDesc}
                                setSortByColumn={setSortByColumn}
                                setSortByDesc={setSortByDesc}
                                reset={reset}
                                widgetType={t("CheckDataDescriptionTable")}
                            />
                        </PrimaryActionBar>
                    </div>

                    <div hidden={step !== 2}>
                        <Visualize
                            widgetId="add-new-table"
                            errors={errors}
                            register={register}
                            json={filteredJson}
                            originalJson={currentJson}
                            headers={currentJson.length ? Object.keys(currentJson[0]) : []}
                            csvJson={csvJson}
                            datasetLoading={datasetLoading}
                            datasetType={datasetType}
                            onCancel={onCancel}
                            backStep={backStep}
                            advanceStep={advanceStep}
                            fileLoading={fileLoading}
                            processingWidget={creatingWidget}
                            fullPreviewButton={fullPreviewButton}
                            fullPreview={fullPreview}
                            previewPanelId={previewPanelId}
                            submitButtonLabel={t("AddTableScreen.AddTable")}
                            sortByColumn={sortByColumn}
                            sortByDesc={sortByDesc}
                            setSortByColumn={setSortByColumn}
                            setSortByDesc={setSortByDesc}
                            title={title}
                            showTitle={showTitle}
                            significantDigitLabels={significantDigitLabels}
                            displayWithPages={displayWithPages}
                            summary={summary}
                            summaryBelow={summaryBelow}
                            columnsMetadata={ColumnsMetadataService.getColumnsMetadata(
                                hiddenColumns,
                                dataTypes,
                                numberTypes,
                                currencyTypes,
                            )}
                            configHeader={configHeader}
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddTable;
