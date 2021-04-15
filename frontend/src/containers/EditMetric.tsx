import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import TextField from "../components/TextField";
import NumberField from "../components/NumberField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import { useDashboard } from "../hooks";
import Spinner from "../components/Spinner";
import DatePicker from "../components/DatePicker";
import { LocationState } from "../models";
import { useTranslation } from "react-i18next";

interface FormValues {
  title: string;
  value: number;
  changeOverTime: string;
  startDate: string;
  endDate: string;
}

interface PathParams {
  dashboardId: string;
}

function EditMetric() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { t } = useTranslation();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    const editedMetric =
      state && state.metrics && state.position !== undefined
        ? state.metrics[state.position]
        : undefined;
    if (editedMetric) {
      editedMetric.title = values.title;
      editedMetric.value = values.value;
      editedMetric.changeOverTime = values.changeOverTime;
      editedMetric.startDate = values.startDate;
      editedMetric.endDate = values.endDate;
    }
    const newMetrics = state && state.metrics ? [...state.metrics] : [];
    history.push(
      (state && state.origin) || `/admin/dashboard/${dashboardId}/add-metrics`,
      {
        alert: {
          type: "success",
          message: t("EditMetricScreen.MetricSuccessfullyEdited"),
        },
        metrics: newMetrics,
        showTitle: state.showTitle !== false,
        oneMetricPerRow: state.oneMetricPerRow === true,
        metricTitle: state.metricTitle || "",
      }
    );
  };

  const onCancel = () => {
    history.push(
      (state && state.origin) || `/admin/dashboard/${dashboardId}/add-metrics`,
      {
        metrics: state && state.metrics ? [...state.metrics] : [],
        showTitle: state && state.showTitle !== false,
        oneMetricPerRow: state && state.oneMetricPerRow === true,
        metricTitle: (state && state.metricTitle) || "",
      }
    );
  };

  if (!state || !state.metrics || !state.metric) {
    setTimeout(onCancel, 1000);
    return null;
  }

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
      label: t("EditMetricScreen.EditMetric"),
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {loading ? (
        <Spinner
          className="text-center margin-top-9"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <>
          <div className="grid-row">
            <div className="grid-col-12">
              <h1>{t("EditMetricScreen.EditMetric")}</h1>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="usa-form usa-form--large"
                data-testid="EditMetricForm"
              >
                <TextField
                  id="title"
                  name="title"
                  label={t("EditMetricScreen.MetricTitle")}
                  hint={t("EditMetricScreen.MetricTitleHint")}
                  register={register}
                  defaultValue={state.metric.title}
                  error={errors.title && t("EditMetricScreen.MetricTitleError")}
                  required
                />

                <NumberField
                  id="value"
                  name="value"
                  label={t("EditMetricScreen.MetricValue")}
                  hint={t("EditMetricScreen.MetricValueHint")}
                  register={register}
                  error={errors.value && t("EditMetricScreen.MetricValueError")}
                  className="width-50"
                  defaultValue={state.metric.value}
                  step={0.01}
                  required
                />

                <TextField
                  id="changeOverTime"
                  name="changeOverTime"
                  label={t("EditMetricScreen.ChangeOverTime")}
                  hint={t("EditMetricScreen.ChangeOverTimeHint")}
                  register={register}
                  className="width-50"
                  defaultValue={state.metric.changeOverTime}
                  error={
                    errors.changeOverTime &&
                    errors.changeOverTime.type === "validate"
                      ? t("EditMetricScreen.ChangeOverTimeError")
                      : undefined
                  }
                  validate={(input: string) => {
                    return !input || input[0] === "+" || input[0] === "-";
                  }}
                />

                <DatePicker
                  id="startDate"
                  name="startDate"
                  label={t("EditMetricScreen.StartDateOptional")}
                  hint="mm/dd/yyyy"
                  register={register}
                  className="width-50"
                  defaultValue={state.metric.startDate}
                />

                <DatePicker
                  id="endDate"
                  name="endDate"
                  label={t("EditMetricScreen.EndDateOptional")}
                  hint="mm/dd/yyyy"
                  register={register}
                  className="width-50"
                  defaultValue={state.metric.endDate}
                />

                <br />
                <Button type="submit">{t("Save")}</Button>
                <Button
                  className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                  variant="unstyled"
                  type="button"
                  onClick={onCancel}
                >
                  {t("Cancel")}
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditMetric;
