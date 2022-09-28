import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Metric,
  LocationState,
  Dataset,
  DatasetSchema,
  DatasetType,
} from "../models";
import {
  useDashboard,
  useWidget,
  useFullPreview,
  useChangeBackgroundColor,
  useWindowSize,
} from "../hooks";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import MetricsWidget from "../components/MetricsWidget";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MetricsList from "../components/MetricsList";
import OrderingService from "../services/OrderingService";
import StorageService from "../services/StorageService";
import Spinner from "../components/Spinner";
import PrimaryActionBar from "../components/PrimaryActionBar";
import Alert from "../components/Alert";
import AlertContainer from "../containers/AlertContainer";

interface FormValues {
  title: string;
  showTitle: boolean;
  oneMetricPerRow: boolean;
  significantDigitLabels: boolean;
  metricsCenterAlign: boolean;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditMetrics() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { dashboardId, widgetId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, reset, watch } =
    useForm<FormValues>();

  const [fileLoading, setFileLoading] = useState(false);
  const [editingWidget, setEditingWidget] = useState(false);
  const { widget, currentJson } = useWidget(dashboardId, widgetId);
  const [metrics, setMetrics] = useState<Array<Metric>>([]);
  const [submittedMetricsNum, setSubmittedMetricsNum] = useState<
    number | undefined
  >();
  const previewPanelId = "preview-metrics-panel";
  const { fullPreview, fullPreviewButton } = useFullPreview(previewPanelId);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 600;

  const title = watch("title");
  const showTitle = watch("showTitle");
  const oneMetricPerRow = watch("oneMetricPerRow");
  const significantDigitLabels = watch("significantDigitLabels");
  const metricsCenterAlign = watch("metricsCenterAlign");

  useEffect(() => {
    if (widget && currentJson) {
      const title =
        state && state.metricTitle !== undefined
          ? state.metricTitle
          : widget.content.title;

      const showTitle =
        state && state.showTitle !== undefined
          ? state.showTitle
          : widget.showTitle;

      const oneMetricPerRow =
        state && state.oneMetricPerRow !== undefined
          ? state.oneMetricPerRow
          : widget.content.oneMetricPerRow;

      const significantDigitLabels =
        state && state.significantDigitLabels !== undefined
          ? state.significantDigitLabels
          : widget.content.significantDigitLabels;

      const metricsCenterAlign =
        state && state.metricsCenterAlign !== undefined
          ? state.metricsCenterAlign
          : widget.content.metricsCenterAlign;

      reset({
        title,
        showTitle,
        oneMetricPerRow,
        significantDigitLabels,
        metricsCenterAlign,
      });

      setMetrics(
        state && state.metrics
          ? [...state.metrics]
          : (currentJson as Array<Metric>)
      );
    }
  }, [widget, currentJson, state, reset]);

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
    if (!widget) {
      return;
    }

    if (metrics.length === 0) {
      setSubmittedMetricsNum(0);
      return;
    }

    try {
      let newDataset = await uploadDataset();

      setEditingWidget(true);
      await BackendService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        values.showTitle,
        {
          title: values.title,
          datasetId: newDataset.id,
          s3Key: newDataset.s3Key,
          oneMetricPerRow: values.oneMetricPerRow,
          datasetType: DatasetType.CreateNew,
          significantDigitLabels: values.significantDigitLabels,
          metricsCenterAlign: values.metricsCenterAlign,
        },
        widget.updatedAt
      );
      setEditingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: t("EditMetricsScreen.MetricsEditedSuccessfully", {
            title: values.title,
          }),
        },
      });
    } catch (err) {
      console.log(t("AddContentFailure"), err);
      setEditingWidget(false);
    }
  };

  const onAddMetric = async () => {
    history.push(`/admin/dashboard/${dashboardId}/add-metric`, {
      metrics,
      showTitle,
      oneMetricPerRow,
      metricTitle: title,
      origin: history.location.pathname,
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

  useChangeBackgroundColor();

  if (!loading && widget) {
    crumbs.push({
      label: t("EditMetricsScreen.EditMetrics"),
      url: "",
    });
  }

  return (
    <>
      <AlertContainer />
      <Breadcrumbs crumbs={crumbs} />

      {loading || !widget || !currentJson || fileLoading || editingWidget ? (
        <Spinner
          className="text-center margin-top-9"
          label={`${
            fileLoading
              ? t("EditMetricsScreen.UploadingFile")
              : editingWidget
              ? t("EditMetricsScreen.EditingMetrics")
              : t("LoadingSpinnerLabel")
          }`}
        />
      ) : (
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-6" hidden={fullPreview}>
            <PrimaryActionBar>
              <h1 id="editMetricsFormHeader" className="margin-top-0">
                {t("EditMetricsScreen.EditMetrics")}
              </h1>
              <form
                aria-labelledby="editMetricsFormHeader"
                className="usa-form usa-form--large"
                onSubmit={handleSubmit(onSubmit)}
              >
                <fieldset className="usa-fieldset">
                  <legend
                    className={`usa-hint ${
                      isMobile ? "grid-col-12" : "grid-col-6"
                    }`}
                  >
                    {t("EditMetricsScreen.Configure")}
                  </legend>
                  {(errors.title || submittedMetricsNum === 0) && (
                    <Alert
                      type="error"
                      message={
                        submittedMetricsNum === 0
                          ? t("EditMetricsScreen.EnterMetric")
                          : t("EditMetricsScreen.ResolveErrors")
                      }
                      slim
                    ></Alert>
                  )}
                  <TextField
                    id="title"
                    name="title"
                    label={t("EditMetricsScreen.MetricsTitle")}
                    hint={t("EditMetricsScreen.MetricsTitleHint")}
                    error={
                      errors.title && t("EditMetricsScreen.MetricsTitleError")
                    }
                    required
                    defaultValue={title}
                    register={register}
                  />

                  <div className="usa-checkbox">
                    <input
                      className="usa-checkbox__input"
                      id="display-title"
                      type="checkbox"
                      name="showTitle"
                      defaultChecked={showTitle}
                      ref={register()}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor="display-title"
                    >
                      {t("EditMetricsScreen.ShowTitle")}
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
                  allowAddMetric
                  onDrag={setMetricOrder}
                />
                <br />
                <br />
                <hr />
                <Button
                  disabled={editingWidget || fileLoading}
                  type="submit"
                  className="margin-top-1"
                >
                  {t("Save")}
                </Button>
                <Button
                  variant="unstyled"
                  className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-1"
                  type="button"
                  onClick={onCancel}
                >
                  {t("Cancel")}
                </Button>
              </form>
            </PrimaryActionBar>
          </div>
          <section
            className={fullPreview ? "tablet:grid-col-12" : "tablet:grid-col-6"}
            aria-label={t("ContentPreview")}
          >
            <div hidden={false} className="sticky-preview">
              {isMobile ? <br /> : fullPreviewButton}
              <div id={previewPanelId}>
                <MetricsWidget
                  title={showTitle ? title : ""}
                  metrics={metrics}
                  metricPerRow={oneMetricPerRow ? 1 : 3}
                  significantDigitLabels={significantDigitLabels}
                  metricsCenterAlign={metricsCenterAlign}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default EditMetrics;
