import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import { useForm } from "react-hook-form";
import "./AddContent.css";

interface FormValues {
  widgetType: string;
}

function AddContent() {
  const history = useHistory();
  const { dashboardId } = useParams();
  const { register, handleSubmit } = useForm<FormValues>();
  const [widgetType, setWidgetType] = useState("");
  const [textHovered, setTextHovered] = useState(false);
  const [metricsHovered, setMetricsHovered] = useState(false);
  const [chartHovered, setChartHovered] = useState(false);
  const [tableHovered, setTableHovered] = useState(false);

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
    setWidgetType((event.target as HTMLInputElement).value);
  };

  const toggleTextHover = () => setTextHovered(!textHovered);
  const toggleMetricsHover = () => setMetricsHovered(!metricsHovered);
  const toggleChartHover = () => setChartHovered(!chartHovered);
  const toggleTableHover = () => setTableHovered(!tableHovered);

  return (
    <AdminLayout>
      <Breadcrumbs />
      <div className="display-inline-block text-semibold font-sans-2xl margin-y-2">
        Add content
      </div>
      <div className="text-base text-italic">Step 1 of 2</div>
      <h2 className="margin-top-0 display-inline-block">
        Select the type of content you want to add
      </h2>

      <div className="grid-col-12">
        <form className="usa-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="usa-fieldset" onChange={handleChange}>
            <legend className="usa-sr-only">Widget types</legend>
            <div
              className="usa-radio"
              onMouseEnter={toggleTextHover}
              onMouseLeave={toggleTextHover}
            >
              <div
                className={`grid-row flex-column border-base${
                  textHovered || widgetType === "text"
                    ? " bg-base-lightest"
                    : "-lighter"
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
                    What text is, using a short description that fits inside
                    this bound box
                  </div>
                </div>
              </div>
            </div>
            <div
              className="usa-radio"
              onMouseEnter={toggleMetricsHover}
              onMouseLeave={toggleMetricsHover}
            >
              <div
                className={`grid-row flex-column border-base${
                  metricsHovered || widgetType === "metrics"
                    ? " bg-base-lightest"
                    : "-lighter"
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
                    What metrics is, using a short description that fits inside
                    this bound box
                  </div>
                </div>
              </div>
            </div>
            <div
              className="usa-radio"
              onMouseEnter={toggleChartHover}
              onMouseLeave={toggleChartHover}
            >
              <div
                className={`grid-row flex-column border-base${
                  chartHovered || widgetType === "chart"
                    ? " bg-base-lightest"
                    : "-lighter"
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
                    What chart is, using a short description that fits inside
                    this bound box
                  </div>
                </div>
              </div>
            </div>
            <div
              className="usa-radio"
              onMouseEnter={toggleTableHover}
              onMouseLeave={toggleTableHover}
            >
              <div
                className={`grid-row flex-column border-base${
                  tableHovered || widgetType === "table"
                    ? " bg-base-lightest"
                    : "-lighter"
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
                    What table is, using a short description that fits inside
                    this bound box
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <br />
          <hr className="margin-bottom-0" />
          <button
            className="usa-button usa-button--base"
            disabled={!widgetType}
            type="submit"
          >
            Continue
          </button>
          <button
            className="usa-button usa-button--unstyled margin-left-1"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddContent;
