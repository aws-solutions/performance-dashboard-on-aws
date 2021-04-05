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
import PrimaryActionBar from "../components/PrimaryActionBar";

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

function AddMetric() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    const newMetrics = state && state.metrics ? [...state.metrics] : [];
    newMetrics.push({
      title: values.title,
      value: values.value,
      changeOverTime: values.changeOverTime,
      startDate: values.startDate,
      endDate: values.endDate,
    });
    history.push(
      (state && state.origin) || `/admin/dashboard/${dashboardId}/add-metrics`,
      {
        alert: {
          type: "success",
          message: "Metric successfully added.",
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

  if (!state || !state.metrics) {
    setTimeout(onCancel, 1000);
    return null;
  }

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

  if (!loading) {
    crumbs.push({
      label: "Add metric",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <div className="grid-row">
            <div className="grid-col-auto">
              <PrimaryActionBar>
                <h1 className="margin-top-0">Add metric</h1>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="usa-form usa-form--large"
                  data-testid="AddMetricForm"
                >
                  <TextField
                    id="title"
                    name="title"
                    label="Metric title"
                    hint="For example, 'Transactions per year'."
                    register={register}
                    error={errors.title && "Please specify a title"}
                    required
                  />

                  <NumberField
                    id="value"
                    name="value"
                    label="Metric value"
                    hint="Enter a number here."
                    register={register}
                    error={errors.value && "Please specify a value"}
                    className="width-50"
                    step={0.01}
                    required
                  />

                  <TextField
                    id="changeOverTime"
                    name="changeOverTime"
                    label="Change over time - optional"
                    hint='Indicate the increase or decrease since the previous time period. For example, +10.1% or -56%. Most includes "+" or "-".'
                    register={register}
                    className="width-50"
                    error={
                      errors.changeOverTime &&
                      errors.changeOverTime.type === "validate"
                        ? 'Must start with "+" or "-".'
                        : undefined
                    }
                    validate={(input: string) => {
                      return !input || input[0] === "+" || input[0] === "-";
                    }}
                  />

                  <DatePicker
                    id="startDate"
                    name="startDate"
                    label="Start date - optional"
                    hint="mm/dd/yyyy"
                    register={register}
                    className="width-50"
                  />

                  <DatePicker
                    id="endDate"
                    name="endDate"
                    label="End date - optional"
                    hint="mm/dd/yyyy"
                    register={register}
                    className="width-50"
                  />

                  <br />
                  <Button type="submit">Add metric</Button>
                  <Button
                    className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                    variant="unstyled"
                    type="button"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </form>
              </PrimaryActionBar>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AddMetric;
