import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDashboard } from "../hooks";
import Breadcrumbs from "../components/Breadcrumbs";
import Button from "../components/Button";

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
      label: "Add content",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Add content</h1>

      <div className="text-base text-italic">Step 1 of 2</div>
      <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
        Select the type of content you want to add
      </div>

      <div className="grid-col-12">
        <form
          className="usa-form usa-form--large"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="usa-fieldset" onChange={handleChange}>
            <legend className="usa-sr-only">Widget types</legend>
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
                    Upload a CSV file to display data as a visualization,
                    including line, bar, column and part-to-whole charts.
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
                    Upload a CSV file to display data formatted in rows and
                    columns.
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <br />
          <hr />
          <Button variant="base" disabled={!widgetType} type="submit">
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
      </div>
    </>
  );
}

export default AddContent;
