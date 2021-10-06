import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDashboard, useChangeBackgroundColor } from "../hooks";
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
  const { t } = useTranslation();
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, handleSubmit, watch } = useForm<FormValues>();

  const widgetType = watch("widgetType");

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
    } else if (values.widgetType === "section") {
      history.push(`/admin/dashboard/${dashboardId}/add-section`);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
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

  if (!loading) {
    crumbs.push({
      label: t("AddContentScreen.Title"),
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="grid-row">
        <PrimaryActionBar className="tablet:grid-col-6 grid-col-12">
          <h1 className="margin-top-0">{t("AddContentScreen.Title")}</h1>

          <div className="text-base text-italic">
            {t("StepOfTotal", { step: 1, total: 2 })}
          </div>
          <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
            {t("AddContentScreen.Instructions")}
          </div>

          <form
            className="usa-form usa-form--large"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="usa-fieldset">
              <legend className="usa-sr-only">
                {t("ContentItemTypesLabel")}
              </legend>
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
                      data-testid="textRadioButton"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="text">
                      {t("Text")}
                      <p className="text-base usa-checkbox__label-description">
                        {t("AddContentScreen.TextDescription")}
                      </p>
                    </label>
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
                      data-testid="metricsRadioButton"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="metrics">
                      {t("Metrics")}
                      <p className="text-base usa-checkbox__label-description">
                        {t("AddContentScreen.MetricsDescription")}
                      </p>
                    </label>
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
                      data-testid="chartRadioButton"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="chart">
                      {t("Chart")}
                      <p className="text-base usa-checkbox__label-description">
                        {t("AddContentScreen.ChartDescription")}
                      </p>
                    </label>
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
                      data-testid="tableRadioButton"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="table">
                      {t("Table")}
                      <p className="text-base usa-checkbox__label-description">
                        {t("AddContentScreen.TableDescription")}
                      </p>
                    </label>
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
                      data-testid="imageRadioButton"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="image">
                      {t("Image")}
                      <p className="text-base usa-checkbox__label-description">
                        {t("AddContentScreen.ImageDescription")}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
              <div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    widgetType === "section" ? " bg-base-lightest" : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="section"
                      value="section"
                      type="radio"
                      name="widgetType"
                      data-testid="sectionRadioButton"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="section">
                      {t("Section")}
                      <p className="text-base usa-checkbox__label-description">
                        {t("AddContentScreen.SectionDescription")}
                      </p>
                    </label>
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
                !widgetType ? t("AddContentScreen.DisabledToolTip") : ""
              }
            >
              {t("ContinueButton")}
            </Button>
            <Button
              variant="unstyled"
              type="button"
              onClick={onCancel}
              className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
            >
              {t("Cancel")}
            </Button>
          </form>
        </PrimaryActionBar>
        <div className="tablet:grid-col-6 grid-col-12">
          {widgetType === "text" && (
            <img
              src={`${process.env.PUBLIC_URL}/images/text-content-item.svg`}
              alt={t("AddContentScreen.TextImageAlt")}
            />
          )}

          {widgetType === "metrics" && (
            <img
              src={`${process.env.PUBLIC_URL}/images/metrics-content-item.svg`}
              alt={t("AddContentScreen.MetricsImageAlt")}
            />
          )}

          {widgetType === "chart" && (
            <img
              src={`${process.env.PUBLIC_URL}/images/chart-content-item.svg`}
              alt={t("AddContentScreen.ChartImageAlt")}
            />
          )}

          {widgetType === "table" && (
            <img
              src={`${process.env.PUBLIC_URL}/images/table-content-item.svg`}
              alt={t("AddContentScreen.TableImageAlt")}
            />
          )}

          {widgetType === "image" && (
            <img
              src={`${process.env.PUBLIC_URL}/images/image-content-item.svg`}
              alt={t("AddContentScreen.ImageAlt")}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AddContent;
