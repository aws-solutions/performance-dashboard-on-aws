import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useTopicAreas,
  useDashboard,
  useSettings,
  useChangeBackgroundColor,
  useFullPreview,
} from "../hooks";
import BackendService from "../services/BackendService";
import TextField from "../components/TextField";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";
import PrimaryActionBar from "../components/PrimaryActionBar";
import Link from "../components/Link";
import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import AlertContainer from "./AlertContainer";

interface FormValues {
  name: string;
  topicAreaId: string;
  displayTableOfContents: boolean;
  description: string;
}

interface PathParams {
  dashboardId: string;
}

function EditDetails() {
  const history = useHistory();
  const { settings } = useSettings();
  const { topicareas } = useTopicAreas();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const [activeWidgetId, setActiveWidgetId] = useState("");
  const { fullPreview, fullPreviewButton } = useFullPreview();
  const { register, errors, handleSubmit, watch, reset } =
    useForm<FormValues>();

  const sortedTopicAreas = topicareas.sort((a, b) =>
    a.name > b.name ? 1 : -1
  );

  const name = watch("name");
  const description = watch("description");
  const topicAreaId = watch("topicAreaId");
  const displayTableOfContents = watch("displayTableOfContents");

  useEffect(() => {
    const routeTableOfContents = (history.location.state as any)
      ?.tableOfContents;
    if (dashboard && routeTableOfContents) {
      dashboard.displayTableOfContents = true;
      dashboard.tableOfContents = routeTableOfContents;
    }
  }, [dashboard, history.location.state]);

  useEffect(() => {
    if (dashboard) {
      const name = dashboard.name;
      const description = dashboard.description;
      const topicAreaId = dashboard.topicAreaId;
      const displayTableOfContents = dashboard.displayTableOfContents;
      reset({
        name,
        description,
        topicAreaId,
        displayTableOfContents,
      });
    }
  }, [dashboard, reset]);

  const { t } = useTranslation();

  const onDisplayTableOfContentsChange = (value: boolean) => {
    if (!dashboard) {
      return;
    }
    if (!dashboard.tableOfContents) {
      dashboard.tableOfContents = {};
    }
    for (const widget of dashboard.widgets || []) {
      dashboard.tableOfContents[widget.id] = value;
    }
  };

  const onSubmit = async (values: FormValues) => {
    await BackendService.editDashboard(
      dashboardId,
      values.name,
      values.topicAreaId,
      values.displayTableOfContents,
      values.description || "",
      dashboard ? dashboard.updatedAt : new Date(),
      dashboard && dashboard.tableOfContents ? dashboard.tableOfContents : {}
    );

    history.push(`/admin/dashboard/edit/${dashboardId}`, {
      alert: {
        type: "success",
        message: `"${values.name}" ${t("EditDetailsSuccess")}`,
      },
      id: "top-alert",
    });
  };

  const getTopicAreaName = (topicAreaId: string) => {
    return topicareas.find((t) => t.id === topicAreaId)?.name || "";
  };

  const onTableOfContentsEdit = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}/tableofcontents`, {
      tableOfContents: dashboard?.tableOfContents,
    });
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  useChangeBackgroundColor();

  if (loading || !dashboard || !topicareas || topicareas.length === 0) {
    return (
      <Spinner
        className="text-center margin-top-9"
        label={t("LoadingSpinnerLabel")}
      />
    );
  }

  return (
    <>
      <AlertContainer />
      <Breadcrumbs
        crumbs={[
          {
            label: t("Dashboards"),
            url: "/admin/dashboards",
          },
          {
            label: dashboard.name,
            url: `/admin/dashboard/edit/${dashboard?.id}`,
          },
          {
            label: t("EditHeader"),
          },
        ]}
      />

      <div className="grid-row width-desktop grid-gap">
        <div className="grid-col-6" hidden={fullPreview}>
          <div className="grid-row">
            <div className="grid-col-12">
              <PrimaryActionBar>
                <h1 id="editHeaderLabel" className="margin-top-0">
                  {t("EditHeader")
                    .split(" ")
                    .map((word) => {
                      return word[0].toUpperCase() + word.substring(1);
                    })
                    .join(" ")}
                </h1>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="edit-details-form usa-form usa-form--large"
                  data-testid="EditDetailsForm"
                  aria-labelledby="editHeaderLabel"
                >
                  <TextField
                    id="name"
                    name="name"
                    label={t("DashboardName")}
                    error={errors.name && t("ErrorNameSpecify")}
                    defaultValue={dashboard.name}
                    register={register}
                    required
                  />

                  <Dropdown
                    id="topicAreaId"
                    name="topicAreaId"
                    label={settings.topicAreaLabels.singular}
                    hint={`${t(
                      "SelectExistingLeading"
                    )} ${settings.topicAreaLabels.singular.toLowerCase()}`}
                    defaultValue={dashboard.topicAreaId}
                    register={register}
                    options={sortedTopicAreas.map((topicarea) => ({
                      value: topicarea.id,
                      label: topicarea.name,
                    }))}
                    required
                  />

                  <div className="usa-form-group">
                    <label className="usa-label text-bold">
                      {t("TableOfContents")}
                    </label>
                    <div className="usa-hint">
                      {t("TableOfContentsDescription")}
                    </div>
                    <div className="grid-row">
                      <div className="grid-col text-left">
                        <div className="usa-checkbox">
                          <br />
                          <input
                            className="usa-checkbox__input"
                            id="display-table-of-contents"
                            type="checkbox"
                            name="displayTableOfContents"
                            defaultChecked={
                              dashboard && dashboard.displayTableOfContents
                            }
                            ref={register}
                            onChange={(e) =>
                              onDisplayTableOfContentsChange(e.target.checked)
                            }
                          />
                          <label
                            className="usa-checkbox__label margin-top-0"
                            htmlFor="display-table-of-contents"
                          >
                            {t("DisplayTableOfContents")}
                          </label>
                        </div>
                      </div>
                      <div className="grid-col text-right">
                        <Button
                          variant="outline"
                          disabled={!displayTableOfContents}
                          onClick={onTableOfContentsEdit}
                        >
                          {t("Edit")}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <TextField
                    id="description"
                    name="description"
                    label={t("DescriptionOptional")}
                    defaultValue={dashboard.description}
                    hint={
                      <>
                        {t("CreateEditDashboardDetails")}{" "}
                        <Link target="_blank" to={"/admin/markdown"} external>
                          {t("CreateEditDashboardDetailsLink")}
                        </Link>
                      </>
                    }
                    register={register}
                    multiline
                    rows={10}
                  />

                  <br />
                  <Button type="submit" disabled={loading}>
                    {t("Save")}
                  </Button>
                  <Button
                    variant="unstyled"
                    type="button"
                    className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                    onClick={onCancel}
                  >
                    {t("Cancel")}
                  </Button>
                </form>
              </PrimaryActionBar>
            </div>
          </div>
        </div>
        <div className={fullPreview ? "grid-col-12" : "grid-col-6"}>
          {fullPreviewButton}
          <div className="margin-top-2">
            <DashboardHeader
              name={name}
              topicAreaName={getTopicAreaName(topicAreaId)}
              description={description}
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
              widgetNameIds={dashboard.widgets
                .filter(
                  (w) =>
                    dashboard &&
                    dashboard.tableOfContents &&
                    dashboard.tableOfContents[w.id]
                )
                .map((widget) => {
                  return {
                    name: widget.name,
                    id: widget.id,
                    isInsideSection: !!widget.section,
                    sectionWithTabs: "",
                  };
                })}
              activeWidgetId={activeWidgetId}
              isTop={false}
              displayTableOfContents={displayTableOfContents}
              onBottomOfThePage={() => {}}
              onClick={setActiveWidgetId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditDetails;
