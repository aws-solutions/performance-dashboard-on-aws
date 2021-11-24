import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import TextField from "../components/TextField";
import NumberField from "../components/NumberField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import { useDashboard, useSettings } from "../hooks";
import Spinner from "../components/Spinner";
import DateRangePicker from "../components/DateRangePicker";
import { LocationState } from "../models";
import { useTranslation } from "react-i18next";
import Dropdown from "../components/Dropdown";
import { CurrencyDataType, NumberDataType } from "../models";

interface FormValues {
  title: string;
  value: number;
  changeOverTime: string;
  percentage: string;
  currency: string;
}

interface PathParams {
  dashboardId: string;
}

function EditMetric() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [startDate, setStartDate] = useState<Date | null>(
    state.metric && state.metric.startDate
      ? new Date(state.metric.startDate)
      : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    state.metric && state.metric.endDate ? new Date(state.metric.endDate) : null
  );
  const [symbolType, setsymbolType] = useState<string>("");

  const onSubmit = async (values: FormValues) => {
    const editedMetric =
      state && state.metrics && state.position !== undefined
        ? state.metrics[state.position]
        : undefined;
    if (editedMetric) {
      editedMetric.title = values.title;
      editedMetric.value = values.value;
      editedMetric.percentage = values.percentage;
      editedMetric.currency = values.currency;
      editedMetric.changeOverTime = values.changeOverTime;
      editedMetric.startDate = startDate ? startDate.toISOString() : "";
      editedMetric.endDate = endDate ? endDate.toISOString() : "";
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
        datasetType: state.datasetType || undefined,
      }
    );
  };

  const handleSymbol = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "Percentage") {
      setsymbolType("Percentage");
    } else if (e.target.value === "Currency") {
      setsymbolType("Currency");
    } else if (e.target.value === "") {
      setsymbolType("SelectAnOption");
    }
  };

  const onCancel = () => {
    history.push(
      (state && state.origin) || `/admin/dashboard/${dashboardId}/add-metrics`,
      {
        metrics: state && state.metrics ? [...state.metrics] : [],
        showTitle: state && state.showTitle !== false,
        oneMetricPerRow: state && state.oneMetricPerRow === true,
        metricTitle: (state && state.metricTitle) || "",
        datasetType: state.datasetType || undefined,
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

      {loading || loadingSettings ? (
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

                <Dropdown
                  id="percentage"
                  name="percentage"
                  label={t("NumberFormat")}
                  hint={t("AddMetricScreen.MetricFormatHint")}
                  options={[
                    { value: "", label: t("SelectAnOption") },
                    {
                      value: NumberDataType.Percentage,
                      label: t("Percentage"),
                    },
                    {
                      value: NumberDataType.Currency,
                      label: t("Currency"),
                    },
                  ]}
                  defaultValue={state.metric.percentage}
                  onChange={handleSymbol}
                  register={register}
                />

                {symbolType === "Currency" &&
                  (state.metric.percentage === "Percentage" ||
                    state.metric.percentage === "SelectAnOption" ||
                    state.metric.percentage === "" ||
                    state.metric.percentage === undefined) && (
                    <Dropdown
                      id="currency"
                      name="currency"
                      label={t("Currency")}
                      hint={t("AddMetricScreen.MetricCurrencyHint")}
                      options={[
                        { value: "", label: t("SelectAnOption") },
                        {
                          value: CurrencyDataType["Dollar $"],
                          label: t("Dollar"),
                        },
                        {
                          value: CurrencyDataType["Euro €"],
                          label: t("Euro"),
                        },
                        {
                          value: CurrencyDataType["Pound £"],
                          label: t("Pound"),
                        },
                      ]}
                      defaultValue={state.metric.currency}
                      register={register}
                      required
                    />
                  )}
                {state.metric.percentage === "Currency" &&
                  symbolType !== "Percentage" &&
                  symbolType !== "SelectAnOption" && (
                    <Dropdown
                      id="currency"
                      name="currency"
                      label={t("Currency")}
                      hint={t("AddMetricScreen.MetricCurrencyHint")}
                      options={[
                        { value: "", label: t("SelectAnOption") },
                        {
                          value: CurrencyDataType["Dollar $"],
                          label: t("Dollar"),
                        },
                        {
                          value: CurrencyDataType["Euro €"],
                          label: t("Euro"),
                        },
                        {
                          value: CurrencyDataType["Pound £"],
                          label: t("Pound"),
                        },
                      ]}
                      defaultValue={state.metric.currency}
                      register={register}
                      required
                    />
                  )}

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
                <DateRangePicker
                  start={{
                    id: "startDate",
                    name: "startDate",
                    label: t("EditMetricScreen.StartDateOptional"),
                    hint: settings.dateTimeFormat.date,
                    date: startDate,
                    dateFormat: settings.dateTimeFormat.date
                      .toLowerCase()
                      .replace(/m/g, "M"),
                    setDate: setStartDate,
                  }}
                  end={{
                    id: "endDate",
                    name: "endDate",
                    label: t("EditMetricScreen.EndDateOptional"),
                    hint: settings.dateTimeFormat.date,
                    date: endDate,
                    dateFormat: settings.dateTimeFormat.date
                      .toLowerCase()
                      .replace(/m/g, "M"),
                    setDate: setEndDate,
                  }}
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
