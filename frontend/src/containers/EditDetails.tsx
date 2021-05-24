import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useTopicAreas,
  useDashboard,
  useSettings,
  useChangeBackgroundColor,
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

interface FormValues {
  name: string;
  topicAreaId: string;
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
  const { register, errors, handleSubmit, watch } = useForm<FormValues>();

  const sortedTopicAreas = topicareas.sort((a, b) =>
    a.name > b.name ? 1 : -1
  );

  const name = watch("name");
  const description = watch("description");
  const topicAreaId = watch("topicAreaId");

  const { t } = useTranslation();

  const onSubmit = async (values: FormValues) => {
    await BackendService.editDashboard(
      dashboardId,
      values.name,
      values.topicAreaId,
      values.description || "",
      dashboard ? dashboard.updatedAt : new Date()
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
            label: t("EditDetails"),
          },
        ]}
      />

      <div className="grid-row width-desktop">
        <div className="grid-col-6">
          <div className="grid-row">
            <div className="grid-col-12">
              <PrimaryActionBar>
                <h1 className="margin-top-0">{t("EditDetailsCapital")}</h1>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="edit-details-form usa-form usa-form--large"
                  data-testid="EditDetailsForm"
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
                    defaultValue={dashboard?.topicAreaId}
                    register={register}
                    options={sortedTopicAreas.map((topicarea) => ({
                      value: topicarea.id,
                      label: topicarea.name,
                    }))}
                  />

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
        <div className="grid-col-6">
          <div className="margin-left-3 margin-top-2">
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
          </div>
        </div>
      </div>
    </>
  );
}

export default EditDetails;
