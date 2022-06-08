import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import {
  ChartType,
  CurrencyDataType,
  LocationState,
  NumberDataType,
} from "../models";
import { Dataset, WidgetType, DatasetType, ColumnDataType } from "../models";
import {
  useDashboard,
  useDatasets,
  useFullPreview,
  useChangeBackgroundColor,
  useScrollUp,
} from "../hooks";
import StorageService from "../services/StorageService";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import UtilsService from "../services/UtilsService";
import StepIndicator from "../components/StepIndicator";
import CheckData from "../components/CheckData";
import ChooseData from "../components/ChooseData";
import VisualizeChart from "../components/VisualizeChart";
import ColumnsMetadataService from "../services/ColumnsMetadataService";
import DatasetParsingService from "../services/DatasetParsingService";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
import Alert from "../components/Alert";
import ParsingFileService from "../services/ParsingFileService";

interface FormValues {
  title: string;
  summary: string;
  chartType: string;
  showTitle: boolean;
  summaryBelow: boolean;
  datasetType: string;
  horizontalScroll: boolean;
  stackedChart: boolean;
  significantDigitLabels: boolean;
  dataLabels: boolean;
  computePercentages: boolean;
  showTotal: boolean;
  sortData: string;
}

interface PathParams {
  dashboardId: string;
}

function AddChart() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { t } = useTranslation();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { dynamicDatasets } = useDatasets();
  const { register, errors, handleSubmit, reset, watch } =
    useForm<FormValues>();
  const [currentJson, setCurrentJson] = useState<Array<any>>(
    state && state.json ? state.json : []
  );
  const [dynamicJson, setDynamicJson] = useState<Array<any>>([]);
  const [staticJson] = useState<Array<any>>(
    state && state.json ? state.json : []
  );
  const [csvJson, setCsvJson] = useState<Array<any>>([]);
  const [filteredJson, setFilteredJson] = useState<Array<any>>(currentJson);
  const [dynamicDataset, setDynamicDataset] = useState<Dataset | undefined>(
    undefined
  );
  const [staticDataset] = useState<Dataset | undefined>(
    state && state.staticDataset ? state.staticDataset : undefined
  );
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [fileLoading, setFileLoading] = useState(false);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [creatingWidget, setCreatingWidget] = useState(false);
  const [showColumnHeaderAlert, setShowColumnHeaderAlert] = useState(false);
  const [showNoDatasetTypeAlert, setShowNoDatasetTypeAlert] = useState(false);
  const [enableContinueButton, setEnableContinueButton] = useState(true);
  const [datasetType, setDatasetType] = useState<DatasetType | undefined>(
    state && state.json ? DatasetType.StaticDataset : undefined
  );
  const [step, setStep] = useState<number>(state && state.json ? 1 : 0);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
    new Set<string>()
  );
  const [sortByColumn, setSortByColumn] = useState<string | undefined>(
    undefined
  );
  const [sortByDesc, setSortByDesc] = useState<boolean | undefined>(undefined);
  const { fullPreviewButton, fullPreview } = useFullPreview();
  const [dataTypes, setDataTypes] = useState<Map<string, ColumnDataType>>(
    new Map<string, ColumnDataType>()
  );
  const [numberTypes, setNumberTypes] = useState<Map<string, NumberDataType>>(
    new Map<string, NumberDataType>()
  );
  const [currencyTypes, setCurrencyTypes] = useState<
    Map<string, CurrencyDataType>
  >(new Map<string, CurrencyDataType>());
  const [oldStep, setOldStep] = useState<number>(-1);

  const title = watch("title");
  const summary = watch("summary");
  const summaryBelow = watch("summaryBelow");
  const chartType = watch("chartType");
  const showTitle = watch("showTitle");
  const horizontalScroll = watch("horizontalScroll");
  const stackedChart = watch("stackedChart");
  const dataLabels = watch("dataLabels");
  const computePercentages = watch("computePercentages");
  const showTotal = watch("showTotal");
  const significantDigitLabels = watch("significantDigitLabels");

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
      currentJson,
      hiddenColumns
    );
    DatasetParsingService.sortFilteredJson(
      newFilteredJson,
      sortByColumn,
      sortByDesc
    );
    setFilteredJson(newFilteredJson);
  }, [currentJson, hiddenColumns, sortByColumn, sortByDesc]);

  const uploadDataset = async (): Promise<Dataset> => {
    if (!csvFile) {
      throw new Error(t("CSVFileNotSpecified"));
    }

    setFileLoading(true);
    const uploadResponse = await StorageService.uploadDataset(
      csvFile,
      JSON.stringify(currentJson),
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
    try {
      let newDataset;
      if (csvFile) {
        newDataset = await uploadDataset();
      }

      setCreatingWidget(true);
      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Chart,
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
          datasetType: datasetType,
          datasetId: newDataset
            ? newDataset.id
            : datasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.id
            : staticDataset?.id,
          s3Key: newDataset
            ? newDataset.s3Key
            : datasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.s3Key
            : staticDataset?.s3Key,
          fileName: csvFile
            ? csvFile.name
            : datasetType === DatasetType.DynamicDataset
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
        }
      );
      setCreatingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: t("AddChartScreen.AddChartSuccess", { title: values.title }),
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

  const browseDatasets = () => {
    history.push({
      pathname: `/admin/dashboard/${dashboardId}/choose-static-dataset`,
      state: {
        redirectUrl: `/admin/dashboard/${dashboardId}/add-chart/`,
        crumbLabel: t("AddChartScreen.AddChart"),
      },
    });
  };

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
          setCurrentJson([]);
        } else {
          setShowNoDatasetTypeAlert(false);
          setCsvErrors(undefined);
          const csvJson = ParsingFileService.isExcelFile(data.type)
            ? DatasetParsingService.createHeaderRowJson(results)
            : results;
          setCsvJson(csvJson);
          setCurrentJson(csvJson);
        }
        setDatasetLoading(false);
      });
      setCsvFile(data);
    },
    [setCurrentJson, setCsvJson]
  );

  const handleChange = async (event: React.FormEvent<HTMLFieldSetElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.name === "datasetType") {
      setDatasetLoading(true);
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
      setDatasetLoading(false);
    }
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
      setDynamicJson(dataset);
      setCurrentJson(dataset);
      setDynamicDataset(dynamicDatasets.find((d) => d.s3Key.json === jsonFile));
    }

    setDatasetLoading(false);
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
      label: t("AddChartScreen.AddChart"),
      url: "",
    });
  }

  const segments = [
    {
      label: t("AddChartScreen.ChooseData"),
    },
    {
      label: t("AddChartScreen.CheckData"),
    },
    {
      label: t("AddChartScreen.Visualize"),
    },
  ];
  const configHeader = (
    <div>
      <h1
        id="addChartFormHeader"
        className="margin-top-0"
        aria-label={t("AddChartScreen.AddChartTitle", {
          step: segments[step].label.toLowerCase(),
        })}
      >
        {t("AddChartScreen.AddChart")}
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
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            aria-labelledby="addChartFormHeader"
          >
            <div hidden={step !== 0}>
              <PrimaryActionBar>
                {configHeader}
                <div className="margin-y-3" hidden={!showColumnHeaderAlert}>
                  <Alert
                    type="error"
                    message={t("AddChartScreen.ResolveError")}
                    slim
                  />
                </div>
                <div className="margin-y-3" hidden={!showNoDatasetTypeAlert}>
                  <Alert
                    type="error"
                    message={t("AddChartScreen.ChooseDataset")}
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
                  hasErrors={!enableContinueButton || !currentJson.length}
                  csvErrors={csvErrors}
                  csvFile={csvFile}
                  onCancel={onCancel}
                  register={register}
                  widgetType={t("ChooseDataDescriptionChart")}
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
                  widgetType={t("CheckDataDescriptionChart")}
                />
              </PrimaryActionBar>
            </div>

            <div hidden={step !== 2}>
              <VisualizeChart
                errors={errors}
                register={register}
                json={filteredJson}
                headers={
                  currentJson.length
                    ? (Object.keys(currentJson[0]) as Array<string>)
                    : []
                }
                originalJson={currentJson}
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
                submitButtonLabel={t("AddChartScreen.AddChart")}
                sortByColumn={sortByColumn}
                sortByDesc={sortByDesc}
                setSortByColumn={setSortByColumn}
                setSortByDesc={setSortByDesc}
                title={title}
                summary={summary}
                summaryBelow={summaryBelow}
                showTitle={showTitle}
                chartType={chartType as ChartType}
                significantDigitLabels={significantDigitLabels}
                horizontalScroll={horizontalScroll}
                stackedChart={stackedChart}
                dataLabels={dataLabels}
                computePercentages={computePercentages}
                showTotal={showTotal}
                columnsMetadata={ColumnsMetadataService.getColumnsMetadata(
                  hiddenColumns,
                  dataTypes,
                  numberTypes,
                  currencyTypes
                )}
                configHeader={configHeader}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddChart;
