import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTopicAreas, useSettings, useChangeBackgroundColor } from "../hooks";
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
import { TopicAreaSortingCriteria } from "../models";

interface FormValues {
  name: string;
  topicAreaId: string;
  description: string;
}

function CreateDashboard() {
  const history = useHistory();
  const { settings } = useSettings();
  const { topicareas, loading } = useTopicAreas();
  const { register, errors, handleSubmit, watch } = useForm<FormValues>();

  const sortedTopicAreas = topicareas.sort(TopicAreaSortingCriteria);
  const name = watch("name");
  const description = watch("description");
  const topicAreaId = watch("topicAreaId");

  const { t } = useTranslation();

  const onSubmit = async (values: FormValues) => {
    const dashboard = await BackendService.createDashboard(
      values.name,
      values.topicAreaId,
      values.description || ""
    );

    history.push(`/admin/dashboard/edit/${dashboard.id}`, {
      alert: {
        type: "success",
        message: `"${dashboard.name}" ${t("CreateEditDashboardSuccess")}`,
      },
      id: "top-alert",
    });
  };

  const getTopicAreaName = (topicAreaId: string) => {
    return topicareas.find((t) => t.id === topicAreaId)?.name || "";
  };

  const onCancel = () => {
    history.push("/admin/dashboards");
  };

  useChangeBackgroundColor();

  if (loading) {
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
            label: t("CreateNewDashboard"),
          },
        ]}
      />

      <div className="grid-row width-desktop">
        <div className="grid-col-6">
          <div className="grid-row">
            <div className="grid-col-12">
              <PrimaryActionBar>
                <h1 id="createDashboardLabel" className="margin-top-0">
                  {t("CreateDashboard")}
                </h1>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="usa-form usa-form--large"
                  data-testid="CreateDashboardForm"
                  aria-labelledby="createDashboardLabel"
                >
                  <TextField
                    id="name"
                    name="name"
                    label={t("DashboardName")}
                    hint={t("DashboardDescriptiveName")}
                    register={register}
                    error={errors.name && t("ErrorNameSpecify")}
                    required
                  />

                  <Dropdown
                    id="topicAreaId"
                    name="topicAreaId"
                    label={settings.topicAreaLabels.singular}
                    hint={`${t(
                      "SelectExistingLeading"
                    )} ${settings.topicAreaLabels.singular.toLowerCase()}`}
                    register={register}
                    options={sortedTopicAreas.map((topicarea) => ({
                      value: topicarea.id,
                      label: topicarea.name,
                    }))}
                    required
                  />

                  <TextField
                    id="description"
                    name="description"
                    label={t("DescriptionOptional")}
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
                  <hr />
                  <Button type="submit">{t("Create")}</Button>
                  <Button
                    className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                    variant="unstyled"
                    type="button"
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
              hidden={!name}
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

export default CreateDashboard;
