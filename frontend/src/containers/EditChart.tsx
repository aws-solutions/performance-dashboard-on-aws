import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import {
  ChartType,
  ColumnDataType,
  CurrencyDataType,
  Dataset,
  DatasetType,
  LocationState,
  NumberDataType,
} from "../models";
import {
  useWidget,
  useDashboard,
  useDatasets,
  useFullPreview,
  useChangeBackgroundColor,
  useScrollUp,
} from "../hooks";

import StorageService from "../services/StorageService";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import VisualizeChart from "../components/VisualizeChart";
import ChooseData from "../components/ChooseData";
import CheckData from "../components/CheckData";
import Spinner from "../components/Spinner";
import UtilsService from "../services/UtilsService";
import "./EditChart.css";
import ColumnsMetadataService from "../services/ColumnsMetadataService";
import DatasetParsingService from "../services/DatasetParsingService";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
import Alert from "../components/Alert";
import ParsingFileService from "../services/ParsingFileService";
import Utils from "../services/UtilsService";

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
  horizontalScroll: boolean;
  stackedChart: boolean;
  dataLabels: boolean;
  computePercentages: boolean;
  showTotal: boolean;
  significantDigitLabels: boolean;
  staticFileName: string | undefined;
  dynamicFileName: string | undefined;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditChart() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { t } = useTranslation();
  const { dashboardId, widgetId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { dynamicDatasets, staticDatasets, loadingDatasets } = useDatasets();
  const { register, errors, handleSubmit, reset, watch } =
    useForm<FormValues>();
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
  const [showColumnHeaderAlert, setShowColumnHeaderAlert] = useState(false);
  const [showNoDatasetTypeAlert, setShowNoDatasetTypeAlert] = useState(false);
  const [enableContinueButton, setEnableContinueButton] = useState(true);
  const [step, setStep] = useState<number>(state && state.json ? 1 : 2);
  const [oldStep, setOldStep] = useState<number>(-1);
  const [staticFileName, setStaticFileName] = useState<string | undefined>("");
  const [dynamicFileName, setDynamicFileName] = useState<string | undefined>(
    ""
  );
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

  const previewPanelId = "preview-chart-panel";
  const { fullPreviewButton, fullPreview } = useFullPreview(previewPanelId);

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
  const [numberTypes, setNumberTypes] = useState<Map<string, NumberDataType>>(
    new Map<string, NumberDataType>()
  );
  const [currencyTypes, setCurrencyTypes] = useState<
    Map<string, CurrencyDataType>
  >(new Map<string, CurrencyDataType>());

  const title = watch("title");
  const showTitle = watch("showTitle");
  const summary = watch("summary");
  const summaryBelow = watch("summaryBelow");
  const chartType = watch("chartType");
  const horizontalScroll = watch("horizontalScroll");
  const stackedChart = watch("stackedChart");
  const dataLabels = watch("dataLabels");
  const computePercentages = watch("computePercentages");
  const showTotal = watch("showTotal");
  const significantDigitLabels = watch("significantDigitLabels");

  const [displayedJson, setDisplayedJson] = useState<any[]>([]);
  const [filteredJson, setFilteredJson] = useState<any[]>([]);
  const [displayedDatasetType, setDisplayedDatasetType] = useState<
    DatasetType | undefined
  >(undefined);

  const initializeColumnsMetadata = () => {
    setHiddenColumns(new Set<string>());
    setDataTypes(new Map<string, ColumnDataType>());
    setNumberTypes(new Map<string, NumberDataType>());
    setCurrencyTypes(new Map<string, CurrencyDataType>());
    setSortByColumn(undefined);
    setSortByDesc(false);
  };

  useMemo(() => {
    const newFilteredJson = DatasetParsingService.getFilteredJson(
      displayedJson,
      hiddenColumns
    );
    DatasetParsingService.sortFilteredJson(
      newFilteredJson,
      sortByColumn,
      sortByDesc
    );
    setFilteredJson(newFilteredJson);
  }, [displayedJson, hiddenColumns, sortByColumn, sortByDesc]);

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
      const stackedChart = widget.content.stackedChart;
      const dataLabels = widget.content.dataLabels;
      const computePercentages = widget.content.computePercentages;
      const showTotal = widget.content.showTotal;

      if (dynamicDataset) {
        setDynamicFileName(dynamicDataset?.fileName);
      }
      if (staticDataset) {
        setStaticFileName(staticDataset?.fileName);
      }

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
        stackedChart,
        dataLabels,
        computePercentages,
        showTotal,
        significantDigitLabels: widget.content.significantDigitLabels,
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

        if (!displayedJson.length) {
          setDisplayedJson(state && state.json ? state.json : currentJson);
        }

        // Initialize fields related to columns metadata
        if (widget.content.columnsMetadata && (!state || !state.json)) {
          const columnsMetadata = widget.content.columnsMetadata;

          const { hiddenColumns, dataTypes, numberTypes, currencyTypes } =
            ColumnsMetadataService.parseColumnsMetadata(columnsMetadata);

          setHiddenColumns(hiddenColumns);
          setDataTypes(dataTypes);
          setNumberTypes(numberTypes);
          setCurrencyTypes(currencyTypes);
          setSortByColumn(widget.content.sortByColumn);
          setSortByDesc(widget.content.sortByDesc || false);
        }
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
    displayedDatasetType,
    dynamicDataset,
    staticDataset,
  ]);

  const onFileProcessed = useCallback(
    async (data: File) => {
      if (!data) {
        return;
      }
      setDatasetLoading(true);
      ParsingFileService.parseFile(data, true, (errors: any, results: any) => {
        initializeColumnsMetadata();

        let wrongCSV = false;
        const firstRow = results[0];
        for (let columnName in firstRow) {
          if (columnName === "") {
            wrongCSV = true;
            break;
          }
        }

        if (wrongCSV) {
          setEnableContinueButton(false);
          setShowColumnHeaderAlert(true);
          setCsvFile(undefined);
          return;
        } else {
          setEnableContinueButton(true);
          setShowColumnHeaderAlert(false);
        }

        if (errors !== null && errors.length) {
          setCsvErrors(errors);
          setCsvJson([]);
          setDisplayedJson([]);
        } else {
          setShowNoDatasetTypeAlert(false);
          setCsvErrors(undefined);
          const csvJson = ParsingFileService.isExcelFile(data.type)
            ? DatasetParsingService.createHeaderRowJson(results)
            : results;
          setCsvJson(csvJson);
          setDisplayedJson(csvJson);
        }
        setDatasetLoading(false);
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
      JSON.stringify(displayedJson),
      t
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
          ...((values.chartType === ChartType.LineChart ||
            values.chartType === ChartType.ColumnChart) && {
            horizontalScroll: values.horizontalScroll,
          }),
          ...((values.chartType === ChartType.BarChart ||
            values.chartType === ChartType.ColumnChart) && {
            stackedChart: values.stackedChart,
          }),
          ...((values.chartType === ChartType.BarChart ||
            values.chartType === ChartType.ColumnChart ||
            values.chartType === ChartType.PieChart ||
            values.chartType === ChartType.DonutChart) && {
            dataLabels: values.dataLabels,
          }),
          ...((values.chartType === ChartType.PieChart ||
            values.chartType === ChartType.DonutChart) && {
            computePercentages: values.computePercentages,
          }),
          ...(values.chartType === ChartType.DonutChart && {
            showTotal: values.showTotal,
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
          significantDigitLabels: values.significantDigitLabels,
          columnsMetadata: ColumnsMetadataService.getColumnsMetadata(
            hiddenColumns,
            dataTypes,
            numberTypes,
            currencyTypes
          ),
        },
        widget.updatedAt
      );

      setEditingWidget(false);
      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: t("EditChartScreen.EditChartSuccess", {
            title: values.title,
          }),
        },
      });
    } catch (err) {
      console.log(t("AddContentFailure"), err);
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
      initializeColumnsMetadata();
      await UtilsService.timeout(0);
      if (datasetType === DatasetType.DynamicDataset) {
        setDisplayedJson(dynamicJson);
      }
      if (datasetType === DatasetType.StaticDataset) {
        if (csvJson && csvJson.length) {
          setDisplayedJson(csvJson);
        } else {
          setDisplayedJson(staticJson);
        }
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

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const browseDatasets = () => {
    history.push({
      pathname: `/admin/dashboard/${dashboardId}/choose-static-dataset`,
      state: {
        redirectUrl: `/admin/dashboard/${dashboardId}/edit-chart/${widgetId}`,
        crumbLabel: t("EditChartScreen.EditChart"),
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

      initializeColumnsMetadata();
      const dataset = await StorageService.downloadJson(jsonFile);
      setDynamicDataset(dynamicDatasets.find((d) => d.s3Key.json === jsonFile));
      setDynamicJson(dataset);
      setDisplayedJson(dataset);
    }

    setDatasetLoading(false);
  };

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

  if (!loading && widget) {
    crumbs.push({
      label: t("EditChartScreen.EditChart"),
      url: "",
    });
  }

  const configHeader = (suffix: string) => (
    <div>
      <h1 id={`editChartFormHeader_${suffix}`} className="margin-top-0">
        {t("EditChartScreen.EditChart")}
      </h1>
      <ul
        className="usa-button-group usa-button-group--segmented"
        role="tablist"
        aria-labelledby={`editChartFormHeader_${suffix}`}
      >
        <li className="usa-button-group__item">
          <button
            id={`editChartFormHeaderStep1_${suffix}`}
            role="tab"
            aria-selected={step === 0}
            aria-controls="panel1"
            className={`usa-button tabSelector ${
              step !== 0 ? "usa-button--outline" : ""
            }`}
            type="button"
            onClick={() => setStep(0)}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          >
            {t("EditChartScreen.ChooseData")}
          </button>
        </li>
        <li className="usa-button-group__item">
          <button
            id={`editChartFormHeaderStep2_${suffix}`}
            role="tab"
            aria-selected={step === 1}
            aria-controls="panel2"
            className={`usa-button tabSelector ${
              step !== 1 ? "usa-button--outline" : ""
            }`}
            type="button"
            onClick={() => setStep(1)}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
            disabled={!displayedJson.length}
          >
            {t("EditChartScreen.CheckData")}
          </button>
        </li>
        <li className="usa-button-group__item">
          <button
            id={`editChartFormHeaderStep3_${suffix}`}
            role="tab"
            aria-selected={step === 2}
            aria-controls="panel3"
            className={`usa-button tabSelector ${
              step !== 2 ? "usa-button--outline" : ""
            }`}
            type="button"
            onClick={() => setStep(2)}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
            disabled={!displayedJson.length}
          >
            {t("EditChartScreen.Visualize")}
          </button>
        </li>
      </ul>
    </div>
  );

  useChangeBackgroundColor();
  useScrollUp(oldStep, step, setOldStep);

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      {loading ||
      loadingDatasets ||
      !widget ||
      !displayedDatasetType ||
      !filteredJson ||
      fileLoading ||
      editingWidget ? (
        <Spinner
          className="text-center margin-top-9"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <div className="grid-row">
          <div className="grid-col-12">
            <div
              id="panel1"
              hidden={step !== 0}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="editChartFormHeaderStep1_chooseDdata"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                aria-labelledby="editChartFormHeader_chooseDdata"
              >
                <PrimaryActionBar>
                  {configHeader("chooseDdata")}
                  <div className="margin-y-3" hidden={!showColumnHeaderAlert}>
                    <Alert
                      type="error"
                      message={t("EditChartScreen.ResolveError")}
                      slim
                    ></Alert>
                  </div>
                  <div className="margin-y-3" hidden={!showNoDatasetTypeAlert}>
                    <Alert
                      type="error"
                      message={t("EditChartScreen.ChooseDataset")}
                      slim
                    />
                  </div>
                  <ChooseData
                    selectDynamicDataset={selectDynamicDataset}
                    dynamicDatasets={dynamicDatasets}
                    datasetType={displayedDatasetType}
                    onFileProcessed={onFileProcessed}
                    handleChange={handleChange}
                    backStep={goBack}
                    advanceStep={advanceStep}
                    fileLoading={fileLoading}
                    browseDatasets={browseDatasets}
                    hasErrors={!enableContinueButton || !displayedJson.length}
                    csvErrors={csvErrors}
                    csvFile={csvFile}
                    staticFileName={staticFileName}
                    dynamicFileName={dynamicFileName}
                    onCancel={onCancel}
                    register={register}
                    widgetType={t("ChooseDataDescriptionChart")}
                    setShowNoDatasetTypeAlert={setShowNoDatasetTypeAlert}
                  />
                </PrimaryActionBar>
              </form>
            </div>
            <div
              id="panel2"
              hidden={step !== 1}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="editChartFormHeaderStep2_checkDdata"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                aria-labelledby="editChartFormHeader_checkDdata"
              >
                <PrimaryActionBar>
                  {configHeader("checkDdata")}
                  <CheckData
                    data={displayedJson}
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
                    widgetType={t("CheckDataDescriptionChart")}
                  />
                </PrimaryActionBar>
              </form>
            </div>
            <div
              id="panel3"
              hidden={step !== 2}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="editChartFormHeaderStep3_visualizeChart"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                aria-labelledby="editChartFormHeader_visualizeChart"
              >
                <VisualizeChart
                  widgetId={`chart-${Utils.getShorterId(widgetId)}`}
                  errors={errors}
                  register={register}
                  json={filteredJson}
                  originalJson={displayedJson}
                  headers={
                    displayedJson.length
                      ? (Object.keys(displayedJson[0]) as Array<string>)
                      : []
                  }
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
                  previewPanelId={previewPanelId}
                  submitButtonLabel={t("Save")}
                  sortByColumn={sortByColumn}
                  sortByDesc={sortByDesc}
                  setSortByColumn={setSortByColumn}
                  setSortByDesc={setSortByDesc}
                  horizontalScroll={horizontalScroll}
                  stackedChart={stackedChart}
                  dataLabels={dataLabels}
                  computePercentages={computePercentages}
                  showTotal={showTotal}
                  significantDigitLabels={significantDigitLabels}
                  columnsMetadata={ColumnsMetadataService.getColumnsMetadata(
                    hiddenColumns,
                    dataTypes,
                    numberTypes,
                    currencyTypes
                  )}
                  configHeader={configHeader("visualizeChart")}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditChart;
