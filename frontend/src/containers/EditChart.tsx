import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { parse, ParseResult } from "papaparse";
import {
  ChartType,
  ColumnDataType,
  Dataset,
  DatasetType,
  LocationState,
} from "../models";
import { useWidget, useDashboard, useDatasets, useFullPreview } from "../hooks";

import StorageService from "../services/StorageService";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import VisualizeChart from "../components/VisualizeChart";
import ChooseData from "../components/ChooseData";
import CheckData from "../components/CheckData";
import Spinner from "../components/Spinner";
import UtilsService from "../services/UtilsService";
import "./EditChart.css";

interface FormValues {
  title: string;
  summary: string;
  chartType: string;
  showTitle: boolean;
  dynamicDatasets: string;
  staticDatasets: string;
  summaryBelow: boolean;
  datasetType: string;
  sortData: string;
  horizontalScroll?: boolean;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditChart() {
  const history = useHistory<LocationState>();
  const { state } = history.location;

  const { dashboardId, widgetId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { dynamicDatasets, staticDatasets, loadingDatasets } = useDatasets();
  const {
    register,
    errors,
    handleSubmit,
    reset,
    watch,
  } = useForm<FormValues>();
  const [dynamicDataset, setDynamicDataset] = useState<Dataset | undefined>(
    undefined
  );
  const [staticDataset, setStaticDataset] = useState<Dataset | undefined>(
    undefined
  );
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [fileLoading, setFileLoading] = useState(false);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [editingWidget, setEditingWidget] = useState(false);
  const [step, setStep] = useState<number>(state && state.json ? 1 : 2);
  const {
    widget,
    datasetType,
    currentJson,
    dynamicJson,
    staticJson,
    csvJson,
    setDynamicJson,
    setCsvJson,
  } = useWidget(dashboardId, widgetId);
  const { fullPreviewButton, fullPreview } = useFullPreview();

  const [selectedHeaders, setSelectedHeaders] = useState<Set<string>>(
    new Set<string>()
  );
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
    new Set<string>()
  );
  const [sortByColumn, setSortByColumn] = useState<string | undefined>(
    undefined
  );
  const [sortByDesc, setSortByDesc] = useState<boolean | undefined>(undefined);
  const [dataTypes, setDataTypes] = useState<Map<string, ColumnDataType>>(
    new Map<string, ColumnDataType>()
  );

  const title = watch("title");
  const showTitle = watch("showTitle");
  const summary = watch("summary");
  const summaryBelow = watch("summaryBelow");
  const chartType = watch("chartType");
  const horizontalScroll = watch("horizontalScroll");

  const [displayedJson, setDisplayedJson] = useState<any[]>([]);
  const [filteredJson, setFilteredJson] = useState<any[]>([]);
  const [displayedDatasetType, setDisplayedDatasetType] = useState<
    DatasetType | undefined
  >();

  useMemo(() => {
    let headers = displayedJson.length
      ? (Object.keys(displayedJson[0]) as Array<string>)
      : [];
    headers = headers.filter((h) => !hiddenColumns.has(h));
    const newFilteredJson = new Array<any>();
    for (const row of displayedJson) {
      const filteredRow = headers.reduce((obj: any, key: any) => {
        obj[key] = row[key];
        return obj;
      }, {});
      if (filteredRow !== {}) {
        newFilteredJson.push(filteredRow);
      }
    }
    setFilteredJson(newFilteredJson);
  }, [displayedJson, hiddenColumns]);

  useEffect(() => {
    if (
      widget &&
      dynamicDatasets &&
      staticDatasets &&
      currentJson &&
      datasetType
    ) {
      const title = widget.content.title;
      const showTitle = widget.showTitle;
      const summary = widget.content.summary;
      const summaryBelow = widget.content.summaryBelow;
      const chartType = widget.content.chartType;
      const horizontalScroll = widget.content.horizontalScroll;

      reset({
        title,
        showTitle,
        datasetType: displayedDatasetType
          ? displayedDatasetType
          : state && state.json
          ? DatasetType.StaticDataset
          : datasetType,
        summary,
        summaryBelow,
        chartType,
        horizontalScroll,
        dynamicDatasets:
          widget.content.datasetType === DatasetType.DynamicDataset
            ? widget.content.s3Key.json
            : "",
        staticDatasets:
          widget.content.datasetType === DatasetType.StaticDataset
            ? widget.content.s3Key.json
            : "",
        sortData: widget.content.sortByColumn
          ? `${widget.content.sortByColumn}###${
              widget.content.sortByDesc ? "desc" : "asc"
            }`
          : "",
      });

      if (!displayedDatasetType) {
        setDisplayedDatasetType(
          state && state.json && state.staticDataset
            ? DatasetType.StaticDataset
            : datasetType
        );
      }

      if (!displayedJson.length) {
        setDisplayedJson(state && state.json ? state.json : currentJson);
      }

      if (!dynamicDataset) {
        setDynamicDataset(
          dynamicDatasets.find(
            (d) => d.s3Key.json === widget.content.s3Key.json
          )
        );
      }
      if (!staticDataset) {
        setStaticDataset(
          state && state.staticDataset
            ? state.staticDataset
            : staticDatasets.find(
                (d) => d.s3Key.json === widget.content.s3Key.json
              )
        );
      }

      // Initialize fields related to columns metadata
      if (widget.content.columnsMetadata) {
        const columnsMetadata = widget.content.columnsMetadata;

        const hidden = new Set<string>();
        columnsMetadata
          .filter((column: any) => column.hidden)
          .forEach((column: any) => hidden.add(column.columnName));

        const dataTypes = new Map<string, ColumnDataType>();
        columnsMetadata
          .filter((column: any) => !!column.dataType)
          .forEach((column: any) =>
            dataTypes.set(column.columnName, column.dataType)
          );

        const headers = new Set<string>();
        columnsMetadata.forEach((column: any) =>
          headers.add(column.columnName)
        );

        setSelectedHeaders(headers);
        setHiddenColumns(hidden);
        setDataTypes(dataTypes);
        setSortByColumn(widget.content.sortByColumn);
        setSortByDesc(widget.content.sortByDesc || false);
      }
    }
  }, [
    widget,
    dynamicDatasets,
    staticDatasets,
    reset,
    state,
    currentJson,
    displayedJson,
    datasetType,
  ]);

  const onFileProcessed = useCallback(
    async (data: File) => {
      if (!data) {
        return;
      }
      setDatasetLoading(true);
      parse(data, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        comments: "#",
        encoding: "ISO-8859-1",
        complete: function (results: ParseResult<object>) {
          if (results.errors.length) {
            setCsvErrors(results.errors);
            setCsvJson([]);
            setDisplayedJson([]);
          } else {
            setCsvErrors(undefined);
            setCsvJson(results.data);
            setDisplayedJson(results.data);
          }
          setDatasetLoading(false);
        },
      });
      setCsvFile(data);
    },
    [setDisplayedJson, setCsvJson]
  );

  const uploadDataset = async (): Promise<Dataset | null> => {
    if (!csvFile) {
      // User did not select a new dataset.
      // No need to upload anything.
      return null;
    }

    if (!csvFile.lastModified) {
      return {
        id: widget?.content.datasetId,
        fileName: csvFile.name,
        s3Key: widget?.content.s3Key,
      };
    }

    setFileLoading(true);
    const uploadResponse = await StorageService.uploadDataset(
      csvFile,
      JSON.stringify(displayedJson)
    );

    const newDataset = await BackendService.createDataset(csvFile.name, {
      raw: uploadResponse.s3Keys.raw,
      json: uploadResponse.s3Keys.json,
    });

    setFileLoading(false);
    return newDataset;
  };

  const onSubmit = async (values: FormValues) => {
    if (!widget) {
      return;
    }

    try {
      let newDataset;
      if (csvFile) {
        newDataset = await uploadDataset();
      }

      setEditingWidget(true);
      await BackendService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        values.showTitle,
        {
          title: values.title,
          summary: values.summary,
          summaryBelow: values.summaryBelow,
          chartType: values.chartType,
          ...(values.chartType === ChartType.LineChart && {
            horizontalScroll: values.horizontalScroll,
          }),
          datasetType: displayedDatasetType,
          datasetId: newDataset
            ? newDataset.id
            : displayedDatasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.id
            : staticDataset?.id,
          s3Key: newDataset
            ? newDataset.s3Key
            : displayedDatasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.s3Key
            : staticDataset?.s3Key,
          fileName: csvFile
            ? csvFile.name
            : displayedDatasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.fileName
            : staticDataset?.fileName,
          sortByColumn,
          sortByDesc,
          columnsMetadata: Array.from(selectedHeaders).map((header) => {
            return {
              columnName: header,
              hidden: hiddenColumns.has(header),
              dataType: dataTypes.has(header)
                ? dataTypes.get(header)
                : undefined,
            };
          }),
        },
        widget.updatedAt
      );

      setEditingWidget(false);
      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" ${UtilsService.getChartTypeLabel(
            values.chartType
          ).toLowerCase()} has been successfully edited`,
        },
      });
    } catch (err) {
      console.log("Failed to edit content item", err);
      setEditingWidget(false);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleChange = async (event: React.FormEvent<HTMLFieldSetElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.name === "datasetType") {
      setDatasetLoading(true);
      const datasetType = target.value as DatasetType;
      setDisplayedDatasetType(datasetType);
      await UtilsService.timeout(0);
      if (datasetType === DatasetType.DynamicDataset) {
        setDisplayedJson(dynamicJson);
      }
      if (datasetType === DatasetType.StaticDataset) {
        setDisplayedJson(staticJson);
      }
      if (datasetType === DatasetType.CsvFileUpload) {
        setDisplayedJson(csvJson);
      }
      setDatasetLoading(false);
    }
  };

  const advanceStep = () => {
    setStep(step + 1);
  };

  const backStep = () => {
    setStep(step - 1);
  };

  const browseDatasets = () => {
    history.push({
      pathname: `/admin/dashboard/${dashboardId}/choose-static-dataset`,
      state: {
        redirectUrl: `/admin/dashboard/${dashboardId}/edit-chart/${widgetId}`,
        crumbLabel: "Edit chart",
      },
    });
  };

  const selectDynamicDataset = async (selectedDataset: Dataset) => {
    setDatasetLoading(true);

    if (
      selectedDataset &&
      selectedDataset.s3Key &&
      selectedDataset.s3Key.json
    ) {
      const jsonFile = selectedDataset.s3Key.json;

      const dataset = await StorageService.downloadJson(jsonFile);
      setDynamicDataset(dynamicDatasets.find((d) => d.s3Key.json === jsonFile));
      setDynamicJson(dataset);
      setDisplayedJson(dataset);
    } else {
      setDynamicDataset(undefined);
      setDynamicJson([]);
      setDisplayedJson([]);
    }

    setDatasetLoading(false);
  };

  const crumbs = [
    {
      label: "Dashboards",
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/edit/${dashboardId}`,
    },
  ];

  if (!loading && widget) {
    crumbs.push({
      label: "Edit chart",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1 hidden={fullPreview}>Edit chart</h1>

      {loading ||
      loadingDatasets ||
      !widget ||
      !displayedDatasetType ||
      !filteredJson ||
      fileLoading ||
      editingWidget ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <div className="grid-row width-desktop">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div hidden={fullPreview} className="grid-col-12">
              <ul className="usa-button-group usa-button-group--segmented">
                <li className="usa-button-group__item">
                  <button
                    className={
                      step !== 0
                        ? "usa-button usa-button--outline"
                        : "usa-button"
                    }
                    type="button"
                    onClick={() => setStep(0)}
                  >
                    Choose data
                  </button>
                </li>
                <li className="usa-button-group__item">
                  <button
                    className={
                      step !== 1
                        ? "usa-button usa-button--outline"
                        : "usa-button"
                    }
                    type="button"
                    onClick={() => setStep(1)}
                  >
                    Check data
                  </button>
                </li>
                <li className="usa-button-group__item">
                  <button
                    className={
                      step !== 2
                        ? "usa-button usa-button--outline"
                        : "usa-button"
                    }
                    type="button"
                    onClick={() => setStep(2)}
                  >
                    Visualize
                  </button>
                </li>
              </ul>
            </div>
            <div hidden={step !== 0}>
              <ChooseData
                selectDynamicDataset={selectDynamicDataset}
                dynamicDatasets={dynamicDatasets}
                datasetType={displayedDatasetType}
                onFileProcessed={onFileProcessed}
                handleChange={handleChange}
                advanceStep={advanceStep}
                fileLoading={fileLoading}
                browseDatasets={browseDatasets}
                continueButtonDisabled={!currentJson.length}
                csvErrors={csvErrors}
                csvFile={csvFile}
                onCancel={onCancel}
                register={register}
                widgetType="chart"
              />
            </div>
            <div hidden={step !== 1}>
              <CheckData
                data={currentJson}
                advanceStep={advanceStep}
                backStep={backStep}
                selectedHeaders={selectedHeaders}
                setSelectedHeaders={setSelectedHeaders}
                hiddenColumns={hiddenColumns}
                setHiddenColumns={setHiddenColumns}
                onCancel={onCancel}
                register={register}
                dataTypes={dataTypes}
                setDataTypes={setDataTypes}
              />
            </div>
            <div hidden={step !== 2}>
              <VisualizeChart
                errors={errors}
                register={register}
                json={filteredJson}
                csvJson={csvJson}
                datasetLoading={datasetLoading}
                datasetType={displayedDatasetType}
                onCancel={onCancel}
                backStep={backStep}
                advanceStep={advanceStep}
                fileLoading={fileLoading}
                processingWidget={editingWidget}
                title={title}
                summary={summary}
                chartType={chartType as ChartType}
                summaryBelow={summaryBelow}
                showTitle={showTitle}
                fullPreviewButton={fullPreviewButton}
                fullPreview={fullPreview}
                submitButtonLabel="Save"
                sortByColumn={sortByColumn}
                sortByDesc={sortByDesc}
                setSortByColumn={setSortByColumn}
                setSortByDesc={setSortByDesc}
                horizontalScroll={horizontalScroll}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default EditChart;
