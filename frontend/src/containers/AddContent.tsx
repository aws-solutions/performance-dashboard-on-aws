import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDashboard } from "../hooks";
import Breadcrumbs from "../components/Breadcrumbs";
import Button from "../components/Button";
import PrimaryActionBar from "../components/PrimaryActionBar";

interface FormValues {
  widgetType: string;
}

interface PathParams {
  dashboardId: string;
}

function AddContent() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, handleSubmit } = useForm<FormValues>();
  const [widgetType, setWidgetType] = useState("");

  const onSubmit = async (values: FormValues) => {
    if (values.widgetType === "chart") {
      history.push(`/admin/dashboard/${dashboardId}/add-chart`);
    } else if (values.widgetType === "table") {
      history.push(`/admin/dashboard/${dashboardId}/add-table`);
    } else if (values.widgetType === "text") {
      history.push(`/admin/dashboard/${dashboardId}/add-text`);
    } else if (values.widgetType === "image") {
      history.push(`/admin/dashboard/${dashboardId}/add-image`);
    } else if (values.widgetType === "metrics") {
      history.push(`/admin/dashboard/${dashboardId}/add-metrics`);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
    setWidgetType((event.target as HTMLInputElement).value);
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
      label: "Add content item",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="grid-col-12">
        <PrimaryActionBar className="grid-col-6">
          <h1 className="margin-top-0">Add content item</h1>

          <div className="text-base text-italic">Step 1 of 2</div>
          <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
            Select the type of content you want to add
          </div>

          <form
            className="usa-form usa-form--large"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="usa-fieldset" onChange={handleChange}>
              <legend className="usa-sr-only">Content item types</legend>
              <div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    widgetType === "text" ? " bg-base-lightest" : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="text"
                      value="text"
                      type="radio"
                      name="widgetType"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="text">
                      Text
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Add a formatted block of text. Input supports Markdown
                      including links, bullets, bolding, and headings.
                    </div>
                  </div>
                </div>
              </div>
              <div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    widgetType === "metrics" ? " bg-base-lightest" : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="metrics"
                      value="metrics"
                      type="radio"
                      name="widgetType"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="metrics">
                      Metrics
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Add one or more metrics to show point-in-time numerical
                      data and trends.
                    </div>
                  </div>
                </div>
              </div>
              <div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    widgetType === "chart" ? " bg-base-lightest" : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="chart"
                      value="chart"
                      type="radio"
                      name="widgetType"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="chart">
                      Chart
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Display data as a visualization, including line, bar,
                      column and part-to-whole charts.
                    </div>
                  </div>
                </div>
              </div>
              <div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    widgetType === "table" ? " bg-base-lightest" : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="table"
                      value="table"
                      type="radio"
                      name="widgetType"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="table">
                      Table
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Display data formatted in rows and columns.
                    </div>
                  </div>
                </div>
              </div>
              <div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    widgetType === "image" ? " bg-base-lightest" : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="image"
                      value="image"
                      type="radio"
                      name="widgetType"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="image">
                      Image
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Upload an image to display.
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <br />
            <hr />
            <Button
              variant="base"
              disabled={!widgetType}
              type="submit"
              disabledToolTip={
                !widgetType ? "Choose a content item to continue" : ""
              }
            >
              Continue
            </Button>
            <Button
              variant="unstyled"
              type="button"
              onClick={onCancel}
              className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
            >
              Cancel
            </Button>
          </form>
        </PrimaryActionBar>
      </div>
    </>
  );
}

export default AddContent;
