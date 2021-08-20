import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Metric,
  WidgetType,
  LocationState,
  Dataset,
  DatasetSchema,
  DatasetType,
} from "../models";
import {
  useDashboard,
  useDateTimeFormatter,
  useDatasets,
  useFullPreview,
  useChangeBackgroundColor,
  useScrollUp,
} from "../hooks";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import MetricsWidget from "../components/MetricsWidget";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MetricsList from "../components/MetricsList";
import OrderingService from "../services/OrderingService";
import StorageService from "../services/StorageService";
import StepIndicator from "../components/StepIndicator";
import Link from "../components/Link";
import Table from "../components/Table";
import UtilsService from "../services/UtilsService";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface FormValues {
  title: string;
  showTitle: boolean;
  oneMetricPerRow: boolean;
  datasetType: string;
  significantDigitLabels: boolean;
  metricsCenterAlign: boolean;
}

interface PathParams {
  dashboardId: string;
}

function AddMetrics() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { dashboardId } = useParams<PathParams>();
  const dateFormatter = useDateTimeFormatter();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { dynamicMetricDatasets } = useDatasets();
  const { register, errors, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      title: state && state.metricTitle !== undefined ? state.metricTitle : "",
      showTitle:
        state && state.showTitle !== undefined ? state.showTitle : true,
      oneMetricPerRow:
        state && state.oneMetricPerRow !== undefined
          ? state.oneMetricPerRow
          : false,
    },
  });
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");

  const [dynamicJson, setDynamicJson] = useState<Array<any>>([]);
  const [dynamicDataset, setDynamicDataset] =
    useState<Dataset | undefined>(undefined);
  const [fileLoading, setFileLoading] = useState(false);
  const [creatingWidget, setCreatingWidget] = useState(false);

  const [metrics, setMetrics] = useState<Array<Metric>>(
    state && state.metrics ? [...state.metrics] : []
  );
  const [submittedMetricsNum, setSubmittedMetricsNum] =
    useState<number | undefined>();
  const [step, setStep] = useState<number>(state && state.metrics ? 1 : 0);
  const [datasetType, setDatasetType] = useState<DatasetType | undefined>(
    state && state.datasetType ? state.datasetType : undefined
  );
  const { fullPreview, fullPreviewButton } = useFullPreview();
  const [oldStep, setOldStep] = useState<number>(-1);
  const title = watch("title");
  const showTitle = watch("showTitle");
  const oneMetricPerRow = watch("oneMetricPerRow");
  const significantDigitLabels = watch("significantDigitLabels");
  const metricsCenterAlign = watch("metricsCenterAlign");

  useEffect(() => {
    if (datasetType) {
      reset({
        title,
        showTitle,
        oneMetricPerRow,
        datasetType,
      });
    }
  }, []);

  const rows = useMemo(() => dynamicMetricDatasets, [dynamicMetricDatasets]);
  const columns = useMemo(
    () => [
      {
        Header: t("AddMetricsScreen.Name"),
        accessor: "fileName",
      },
      {
        Header: t("AddMetricsScreen.LastUpdated"),
        accessor: "updatedAt",
        Cell: (props: any) => dateFormatter(props.value),
      },
      {
        Header: t("AddMetricsScreen.Description"),
        accessor: "description",
      },
      {
        Header: t("AddMetricsScreen.Tags"),
        accessor: "tags",
      },
    ],
    [dateFormatter, t]
  );

  const uploadDataset = async (): Promise<Dataset> => {
    setFileLoading(true);
    const uploadResponse = await StorageService.uploadMetric(
      JSON.stringify(metrics)
    );

    const newDataset = await BackendService.createDataset(
      title,
      {
        raw: uploadResponse.s3Keys.raw,
        json: uploadResponse.s3Keys.json,
      },
      DatasetSchema.Metrics
    );

    setFileLoading(false);
    return newDataset;
  };

  const onSubmit = async (values: FormValues) => {
    if (metrics.length === 0) {
      setSubmittedMetricsNum(0);
      return;
    }

    try {
      if (datasetType) {
        let newDataset;
        if (
          datasetType === DatasetType.DynamicDataset &&
          dynamicJson === metrics
        ) {
          newDataset = { ...dynamicDataset };
        } else {
          newDataset = await uploadDataset();
        }

        setCreatingWidget(true);
        await BackendService.createWidget(
          dashboardId,
          values.title,
          WidgetType.Metrics,
          values.showTitle,
          {
            title: values.title,
            datasetId: newDataset.id,
            s3Key: newDataset.s3Key,
            oneMetricPerRow: values.oneMetricPerRow,
            datasetType:
              datasetType === DatasetType.DynamicDataset &&
              dynamicJson === metrics
                ? DatasetType.DynamicDataset
                : DatasetType.CreateNew,
            significantDigitLabels: values.significantDigitLabels,
            metricsCenterAlign: values.metricsCenterAlign,
          }
        );
        setCreatingWidget(false);

        history.push(`/admin/dashboard/edit/${dashboardId}`, {
          alert: {
            type: "success",
            message: t("AddMetricsScreen.MetricsAddedSuccessffully", {
              title: values.title,
            }),
          },
        });
      }
    } catch (err) {
      console.log(t("AddContentFailure"), err);
      setCreatingWidget(false);
    }
  };

  const onAddMetric = async () => {
    history.push(`/admin/dashboard/${dashboardId}/add-metric`, {
      metrics,
      showTitle,
      oneMetricPerRow,
      metricTitle: title,
      origin: history.location.pathname,
      datasetType: datasetType,
    });
  };

  const onEditMetric = async (metric: Metric, position: number) => {
    history.push(`/admin/dashboard/${dashboardId}/edit-metric`, {
      metrics,
      metric,
      position,
      showTitle,
      oneMetricPerRow,
      metricTitle: title,
      origin: history.location.pathname,
      datasetType: datasetType,
    });
  };

  const onDeleteMetric = (metric: Metric) => {
    const newMetrics = metrics.filter((m) => m !== metric);
    setMetrics(newMetrics);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const onMoveMetricUp = async (index: number) => {
    return setMetricOrder(index, index - 1);
  };

  const onMoveMetricDown = async (index: number) => {
    return setMetricOrder(index, index + 1);
  };

  const setMetricOrder = async (index: number, newIndex: number) => {
    const metricsOrdered = OrderingService.moveMetric(metrics, index, newIndex);

    // if no change in order ocurred, exit
    if (metricsOrdered === metrics) {
      return;
    }

    setMetrics(metricsOrdered);
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const handleChange = async (event: React.FormEvent<HTMLFieldSetElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.name === "datasetType") {
      const datasetType = target.value as DatasetType;
      setDatasetType(datasetType);
      await UtilsService.timeout(0);
      if (datasetType === DatasetType.DynamicDataset) {
        setMetrics(dynamicJson);
      }
      if (datasetType === DatasetType.CreateNew) {
        setMetrics([]);
      }
    }
  };

  const selectDynamicDataset = useCallback(async (selectedDataset: Dataset) => {
    if (
      selectedDataset &&
      selectedDataset.s3Key &&
      selectedDataset.s3Key.json
    ) {
      const jsonFile = selectedDataset.s3Key.json;
      const dataset = await StorageService.downloadJson(jsonFile);
      setDynamicJson(dataset);
      setMetrics(dataset);
      setDynamicDataset(selectedDataset);
    }
  }, []);

  const onSelect = useCallback(
    (selectedDataset: Array<Dataset>) => {
      selectDynamicDataset(selectedDataset[0]);
    },
    [selectDynamicDataset]
  );

  const advanceStep = () => {
    setStep(1);
  };

  const backStep = () => {
    setStep(0);
  };

  const onSearch = (query: string) => {
    setFilter(query);
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

  if (!loading) {
    crumbs.push({
      label: t("AddMetricsScreen.AddMetrics"),
      url: "",
    });
  }

  useChangeBackgroundColor();
  useScrollUp(oldStep, step, setOldStep);

  const configHeader = (
    <div>
      <h1 className="margin-top-0">{t("AddMetricsScreen.AddMetrics")}</h1>
      <StepIndicator
        current={step}
        segments={[
          {
            label: t("AddMetricsScreen.ChooseData"),
          },
          {
            label: t("AddMetricsScreen.Visualize"),
          },
        ]}
        showStepChart={true}
        showStepText={false}
      />
    </div>
  );

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {fileLoading || creatingWidget ? (
        <Spinner
          className="text-center margin-top-6"
          label={`${
            fileLoading
              ? t("AddMetricsScreen.UploadingFile")
              : t("AddMetricsScreen.CreatingMetrics")
          }`}
        />
      ) : (
        <div className="grid-row width-desktop">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div hidden={step !== 0}>
              <PrimaryActionBar>
                {configHeader}
                <div className="grid-col-6">
                  <label htmlFor="fieldset" className="usa-label text-bold">
                    {t("AddMetricsScreen.Data")}
                  </label>
                  <div className="usa-hint">
                    {t("AddMetricsScreen.DataHint")}.{" "}
                    <Link to="/admin/apihelp" target="_blank" external>
                      {t("AddMetricsScreen.DataHelp")}
                    </Link>
                  </div>
                </div>
                <fieldset
                  id="fieldset"
                  className="usa-fieldset"
                  onChange={handleChange}
                >
                  <legend className="usa-sr-only">
                    {t("AddMetricsScreen.ContentItemTypes")}
                  </legend>

                  <div className="grid-row">
                    <div className="grid-col-4 padding-right-2">
                      <div className="usa-radio">
                        <div
                          className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                            datasetType === DatasetType.CreateNew
                              ? " bg-base-lightest"
                              : "-lighter"
                          } border-2px padding-2 margin-y-1`}
                        >
                          <div className="grid-col flex-5">
                            <input
                              className="usa-radio__input"
                              id="createNew"
                              value="CreateNew"
                              type="radio"
                              name="datasetType"
                              ref={register()}
                            />
                            <label
                              className="usa-radio__label"
                              htmlFor="createNew"
                            >
                              {t("AddMetricsScreen.CreateNew")}
                            </label>
                          </div>
                          <div className="grid-col flex-7">
                            <div className="usa-prose text-base margin-left-4">
                              {t("AddMetricsScreen.CreateNewDescription")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid-col-4 padding-left-2">
                      <div className="usa-radio">
                        <div
                          className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                            datasetType === DatasetType.DynamicDataset
                              ? " bg-base-lightest"
                              : "-lighter"
                          } border-2px padding-2 margin-y-1`}
                        >
                          <div className="grid-col flex-5">
                            <input
                              className="usa-radio__input"
                              id="dynamicDataset"
                              value="DynamicDataset"
                              type="radio"
                              name="datasetType"
                              ref={register()}
                            />
                            <label
                              className="usa-radio__label"
                              htmlFor="dynamicDataset"
                            >
                              {t("AddMetricsScreen.DynamicDataset")}
                            </label>
                          </div>
                          <div className="grid-col flex-7">
                            <div className="usa-prose text-base margin-left-4">
                              {t("AddMetricsScreen.DynamicDatasetDescription")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div hidden={datasetType !== DatasetType.DynamicDataset}>
                    <div className="grid-row margin-top-3 margin-bottom-1">
                      <div className="tablet:grid-col-4 padding-top-1px">
                        <div
                          role="search"
                          className="usa-search usa-search--small"
                        >
                          <label className="usa-sr-only" htmlFor="search">
                            {t("SearchButton")}
                          </label>
                          <input
                            className="usa-input"
                            id="search"
                            type="search"
                            name="query"
                            style={{ height: "37px" }}
                            value={query}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => setQuery(event.target.value)}
                          />
                          <button
                            className="usa-button usa-button--base padding-x-2"
                            type="button"
                            style={{
                              height: "37px",
                              borderTopLeftRadius: "0",
                              borderBottomLeftRadius: "0",
                            }}
                            onClick={() => onSearch(query)}
                          >
                            <FontAwesomeIcon
                              style={{ marginTop: "-3px" }}
                              icon={faSearch}
                            />
                            <span className="usa-sr-only">
                              {t("SearchButton")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <Table
                        selection="single"
                        initialSortByField="updatedAt"
                        filterQuery={filter}
                        rows={rows}
                        screenReaderField="name"
                        width="100%"
                        onSelection={onSelect}
                        columns={columns}
                      />
                    </div>
                  </div>
                </fieldset>
                <br />
                <br />
                <hr />
                <Button variant="outline" type="button" onClick={goBack}>
                  {t("AddMetricsScreen.Back")}
                </Button>
                <Button
                  type="button"
                  onClick={advanceStep}
                  disabled={
                    !datasetType ||
                    (datasetType === DatasetType.DynamicDataset &&
                      !metrics.length)
                  }
                  disabledToolTip={
                    datasetType === DatasetType.DynamicDataset
                      ? t("AddMetricsScreen.SelectDataset")
                      : t("AddMetricsScreen.ChooseDataset")
                  }
                >
                  {t("AddMetricsScreen.Continue")}
                </Button>
                <Button
                  variant="unstyled"
                  className="text-base-dark hover:text-base-darker active:text-base-darkest"
                  type="button"
                  onClick={onCancel}
                >
                  {t("Cancel")}
                </Button>
              </PrimaryActionBar>
            </div>

            <div hidden={step !== 1}>
              <div className="grid-row width-desktop grid-gap">
                <div className="grid-col-6" hidden={fullPreview}>
                  <PrimaryActionBar>
                    {configHeader}
                    <fieldset className="usa-fieldset">
                      {(errors.title || submittedMetricsNum === 0) && (
                        <Alert
                          type="error"
                          message={
                            submittedMetricsNum === 0
                              ? t("AddMetricsScreen.EnterMetric")
                              : t("AddMetricsScreen.ResolveErrors")
                          }
                          slim
                        ></Alert>
                      )}
                      <TextField
                        id="title"
                        name="title"
                        label={t("AddMetricsScreen.MetricsTitle")}
                        hint={t("AddMetricsScreen.MetricsTitleHint")}
                        error={
                          errors.title &&
                          t("AddMetricsScreen.MetricsTitleError")
                        }
                        required
                        register={register}
                      />

                      <div className="usa-checkbox">
                        <input
                          className="usa-checkbox__input"
                          id="display-title"
                          type="checkbox"
                          name="showTitle"
                          defaultChecked={true}
                          ref={register()}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="display-title"
                        >
                          {t("AddMetricsScreen.ShowTitle")}
                        </label>
                      </div>

                      <label className="usa-label text-bold">
                        {t("MetricsOptionsLabel")}
                      </label>
                      <div className="usa-hint">
                        {t("MetricsOptionsDescription")}
                      </div>
                      <div className="usa-checkbox">
                        <input
                          className="usa-checkbox__input"
                          id="significantDigitLabels"
                          type="checkbox"
                          name="significantDigitLabels"
                          defaultChecked={false}
                          ref={register()}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="significantDigitLabels"
                        >
                          {t("SignificantDigitLabels")}
                        </label>
                      </div>
                      <div className="usa-checkbox">
                        <input
                          className="usa-checkbox__input"
                          id="metricsCenterAlign"
                          type="checkbox"
                          name="metricsCenterAlign"
                          defaultChecked={false}
                          ref={register()}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="metricsCenterAlign"
                        >
                          {t("MetricsCenterAlign")}
                        </label>
                      </div>
                    </fieldset>
                    <MetricsList
                      metrics={metrics}
                      onClick={onAddMetric}
                      onEdit={onEditMetric}
                      onDelete={onDeleteMetric}
                      onMoveUp={onMoveMetricUp}
                      onMoveDown={onMoveMetricDown}
                      defaultChecked={oneMetricPerRow}
                      register={register}
                      allowAddMetric={datasetType === DatasetType.CreateNew}
                      onDrag={setMetricOrder}
                    />
                    <br />
                    <br />
                    <hr />
                    <Button variant="outline" type="button" onClick={backStep}>
                      {t("AddMetricsScreen.Back")}
                    </Button>
                    <Button
                      disabled={creatingWidget || fileLoading}
                      type="submit"
                    >
                      {t("AddMetricsScreen.AddMetrics")}
                    </Button>
                    <Button
                      variant="unstyled"
                      className="text-base-dark hover:text-base-darker active:text-base-darkest"
                      type="button"
                      onClick={onCancel}
                    >
                      {t("Cancel")}
                    </Button>
                  </PrimaryActionBar>
                </div>
                <div className={fullPreview ? "grid-col-12" : "grid-col-6"}>
                  <div className="sticky-preview">
                    {fullPreviewButton}
                    <MetricsWidget
                      title={showTitle ? title : ""}
                      metrics={metrics}
                      metricPerRow={oneMetricPerRow ? 1 : 3}
                      significantDigitLabels={significantDigitLabels}
                      metricsCenterAlign={metricsCenterAlign}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default AddMetrics;
