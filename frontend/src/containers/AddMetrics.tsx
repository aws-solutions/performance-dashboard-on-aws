import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import {
  Metric,
  WidgetType,
  LocationState,
  Dataset,
  DatasetSchema,
} from "../models";
import { useDashboard } from "../hooks";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import MetricsCardGroup from "../components/MetricsCardGroup";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MetricsList from "../components/MetricsList";
import OrderingService from "../services/OrderingService";
import StorageService from "../services/StorageService";

interface FormValues {
  title: string;
  showTitle: boolean;
  oneMetricPerRow: boolean;
}

interface PathParams {
  dashboardId: string;
}

function AddMetrics() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const [fileLoading, setFileLoading] = useState(false);
  const [creatingMetrics, setCreatingMetrics] = useState(false);
  const [title, setTitle] = useState(
    state && state.metricTitle !== undefined ? state.metricTitle : ""
  );
  const [showTitle, setShowTitle] = useState(
    state && state.showTitle !== undefined ? state.showTitle : true
  );
  const [oneMetricPerRow, setOneMetricPerRow] = useState(
    state && state.oneMetricPerRow !== undefined ? state.oneMetricPerRow : false
  );
  const [metrics, setMetrics] = useState<Array<Metric>>(
    state && state.metrics ? [...state.metrics] : []
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
    try {
      let newDataset = await uploadDataset();

      setCreatingMetrics(true);
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
        }
      );
      setCreatingMetrics(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" metrics have been successfully added`,
        },
      });
    } catch (err) {
      console.log("Failed to save content item", err);
      setCreatingMetrics(false);
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
    const widgets = OrderingService.moveMetric(metrics, index, newIndex);

    // if no change in order ocurred, exit
    if (widgets === metrics) {
      return;
    }

    setMetrics(widgets);
  };

  const onFormChange = () => {
    const { title, showTitle, oneMetricPerRow } = getValues();
    setTitle(title);
    setShowTitle(showTitle);
    setOneMetricPerRow(oneMetricPerRow);
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
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

  if (!loading) {
    crumbs.push({
      label: "Add metrics",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Add metrics</h1>

      <div className="text-base text-italic">Step 2 of 2</div>
      <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
        Configure metrics
      </div>
      <div className="grid-row width-desktop">
        <div className="grid-col-6">
          <form
            className="usa-form usa-form--large"
            onChange={onFormChange}
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="usa-fieldset">
              <TextField
                id="title"
                name="title"
                label="Metrics title"
                hint="Give your group of metrics a descriptive title."
                error={errors.title && "Please specify a content title"}
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
                <label className="usa-checkbox__label" htmlFor="display-title">
                  Show title on dashboard
                </label>
              </div>

              <MetricsList
                metrics={metrics}
                onClick={onAddMetric}
                onEdit={onEditMetric}
                onDelete={onDeleteMetric}
                onMoveUp={onMoveMetricUp}
                onMoveDown={onMoveMetricDown}
                defaultChecked={oneMetricPerRow}
                register={register}
              />
            </fieldset>
            <br />
            <br />
            <hr />
            <Button variant="outline" type="button" onClick={goBack}>
              Back
            </Button>
            <Button
              disabled={!title || creatingMetrics || fileLoading}
              type="submit"
            >
              Add metrics
            </Button>
            <Button
              variant="unstyled"
              className="text-base-dark hover:text-base-darker active:text-base-darkest"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </form>
        </div>
        <div className="grid-col-6">
          <h4 className="margin-top-4">Preview</h4>
          {showTitle ? (
            <h2 className="margin-top-4 margin-left-1">{title}</h2>
          ) : (
            ""
          )}
          {metrics.length ? (
            <div className="padding-left-1">
              <MetricsCardGroup
                metrics={metrics}
                metricPerRow={oneMetricPerRow ? 1 : 3}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default AddMetrics;
