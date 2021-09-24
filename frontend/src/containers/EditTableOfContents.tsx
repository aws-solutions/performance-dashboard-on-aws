import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import Button from "../components/Button";
import {
  useDashboard,
  useFullPreview,
  useChangeBackgroundColor,
  useTopicAreas,
} from "../hooks";
import Spinner from "../components/Spinner";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
import { Widget } from "../models";
import Navigation from "../components/Navigation";
import DashboardHeader from "../components/DashboardHeader";

interface FormValues {}

interface PathParams {
  dashboardId: string;
}

function EditTableOfContents() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { topicareas } = useTopicAreas();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, handleSubmit, getValues, reset } = useForm<FormValues>();
  const { t } = useTranslation();
  const { fullPreview, fullPreviewButton } = useFullPreview();
  const [values, setValues] = useState<any>({});
  const [activeWidgetId, setActiveWidgetId] = useState("");

  useEffect(() => {
    if (dashboard) {
      const tableOfContents = dashboard.tableOfContents;
      if (tableOfContents) {
        setValues(tableOfContents);
        reset({
          ...tableOfContents,
        });
      }
    }
  }, [dashboard]);

  const onSubmit = async (values: FormValues) => {
    if (dashboard) {
      await BackendService.editDashboard(
        dashboardId,
        dashboard.name,
        dashboard.topicAreaId,
        dashboard.displayTableOfContents || false,
        dashboard.description || "",
        dashboard.updatedAt,
        values || {}
      );
    }
    try {
      history.push(`/admin/dashboard/edit/${dashboardId}/header`, {
        alert: {
          type: "success",
          message: t("TableOfContentsSuccessfullyEdited"),
        },
      });
    } catch (err) {
      console.log(t("AddContentFailure"), err);
    }
  };

  const getTopicAreaName = (topicAreaId: string) => {
    return topicareas.find((t) => t.id === topicAreaId)?.name || "";
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}/header`);
  };

  const onSelectAll = (selected: boolean) => {
    if (dashboard) {
      const tableOfContents: any = {};
      for (let w of dashboard.widgets) {
        tableOfContents[w.id] = selected;
      }
      setValues(tableOfContents);
      reset({
        ...tableOfContents,
      });
    }
  };

  const onFormChange = () => {
    const values = getValues();
    setValues(values);
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
    {
      label: t("EditHeader"),
      url: `/admin/dashboard/edit/${dashboardId}/header`,
    },
  ];

  useChangeBackgroundColor();

  if (!loading || !dashboard || !topicareas || topicareas.length === 0) {
    crumbs.push({
      label: t("EditTableOfContents"),
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {loading || !dashboard || !topicareas || topicareas.length === 0 ? (
        <Spinner
          className="text-center margin-top-9"
          label={`${t("LoadingSpinnerLabel")}`}
        />
      ) : (
        <>
          <div className="grid-row width-desktop grid-gap">
            <div className="grid-col-6" hidden={fullPreview}>
              <PrimaryActionBar>
                <h1 className="margin-top-0">{t("EditTableOfContents")}</h1>
                <form
                  className="usa-form usa-form--large"
                  onChange={onFormChange}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <fieldset className="usa-fieldset">
                    <>
                      {dashboard.widgets.length === 0 ? (
                        <div>{t("NoTableOfContentsItems")}</div>
                      ) : (
                        <div className="margin-bottom-4">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => onSelectAll(true)}
                          >
                            {t("SelectAll")}
                          </Button>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => onSelectAll(false)}
                          >
                            {t("DeselectAll")}
                          </Button>
                        </div>
                      )}
                      {dashboard.widgets.map((widget: Widget) => (
                        <div
                          className="usa-checkbox"
                          key={widget.id}
                          style={{
                            paddingLeft: widget.section ? "36px" : "0px",
                          }}
                        >
                          <input
                            className="usa-checkbox__input"
                            id={widget.id}
                            type="checkbox"
                            name={widget.id}
                            defaultChecked={
                              dashboard &&
                              dashboard.tableOfContents &&
                              !!dashboard.tableOfContents[widget.id]
                            }
                            ref={register()}
                          />
                          <label
                            className="usa-checkbox__label"
                            htmlFor={widget.id}
                          >
                            {widget.name}
                          </label>
                        </div>
                      ))}
                    </>
                  </fieldset>
                  <br />
                  <br />
                  <hr />
                  <Button type="submit">{t("Save")}</Button>
                  <Button
                    variant="unstyled"
                    className="text-base-dark hover:text-base-darker active:text-base-darkest"
                    type="button"
                    onClick={onCancel}
                  >
                    {t("Cancel")}
                  </Button>
                </form>
              </PrimaryActionBar>
            </div>
            <div className={fullPreview ? "grid-col-12" : "grid-col-6"}>
              {fullPreviewButton}
              <div className="margin-top-2">
                <DashboardHeader
                  name={dashboard.name}
                  topicAreaName={getTopicAreaName(dashboard.topicAreaId)}
                  description={dashboard.description}
                />
                <hr
                  style={{
                    border: "none",
                    height: "1px",
                    backgroundColor: "#dfe1e2",
                    margin: "2rem 0",
                  }}
                />
                <Navigation
                  stickyPosition={80}
                  offset={240}
                  area={4}
                  marginRight={45}
                  widgetNameIds={
                    dashboard?.widgets
                      .filter((w) => values[w.id])
                      .map((widget) => {
                        return {
                          name: widget.name,
                          id: widget.id,
                          isInsideSection: !!widget.section,
                        };
                      }) || []
                  }
                  activeWidgetId={activeWidgetId}
                  setActivewidgetId={setActiveWidgetId}
                  isTop={false}
                  displayTableOfContents={!!dashboard.displayTableOfContents}
                  onClick={setActiveWidgetId}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditTableOfContents;
