import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Metric, WidgetType } from "../models";
import { useDashboard } from "../hooks";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import MetricsList from "../components/MetricsList";
import WidgetOrderingService from "../services/WidgetOrdering";

interface FormValues {
  title: string;
  text: string;
  showTitle: boolean;
}

interface PathParams {
  dashboardId: string;
}

function AddMetrics() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();

  const [creatingMetrics, setCreatingMetrics] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [showTitle, setShowTitle] = useState(true);
  const [metrics, setMetrics] = useState<Array<Metric>>([]);

  const onSubmit = async (values: FormValues) => {
    try {
      setCreatingMetrics(true);
      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Metrics,
        values.showTitle,
        {
          text: values.text,
        }
      );
      setCreatingMetrics(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" text has been successfully added`,
        },
      });
    } catch (err) {
      console.log("Failed to save content item", err);
      setCreatingMetrics(false);
    }
  };

  const onAddMetric = async () => {
    history.push(`/admin/dashboard/${dashboardId}/add-metric`);
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
    const widgets = WidgetOrderingService.moveWidget(metrics, index, newIndex);

    // if no change in order ocurred, exit
    if (widgets === metrics) {
      return;
    }

    setMetrics(widgets);
  };

  const onFormChange = () => {
    const { title, text, showTitle } = getValues();
    setTitle(title);
    setText(text);
    setShowTitle(showTitle);
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
                <label className="usa-checkbox__label" htmlFor="display-title">
                  Show title on dashboard
                </label>
              </div>

              <MetricsList
                metrics={[]}
                onClick={onAddMetric}
                onDelete={onDeleteMetric}
                onMoveUp={onMoveMetricUp}
                onMoveDown={onMoveMetricDown}
              />
            </fieldset>
            <br />
            <br />
            <hr />
            <Button variant="outline" type="button" onClick={goBack}>
              Back
            </Button>
            <Button disabled={creatingMetrics} type="submit">
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
            <h2 className="margin-top-4 margin-left-2px">{title}</h2>
          ) : (
            ""
          )}
          {text ? (
            <div className="padding-left-05">
              <MarkdownRender source={text} />
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
