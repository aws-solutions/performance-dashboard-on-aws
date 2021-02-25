import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTopicAreas, useDashboard, useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Markdown from "../components/Markdown";
import TextField from "../components/TextField";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";
import Link from "../components/Link";

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
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const [name, setName] = useState("");
  const [topicAreaName, setTopicAreaName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (dashboard) {
      setName(dashboard.name);
      setTopicAreaName(dashboard.topicAreaName);
      setDescription(dashboard.description || "");
    }
  }, [dashboard]);

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
        message: `"${values.name}" details successfully edited`,
      },
      id: "top-alert",
    });
  };

  const onFormChange = () => {
    const { name, topicAreaId, description } = getValues();
    setName(name);
    setTopicAreaName(topicareas.find((t) => t.id === topicAreaId)?.name || "");
    setDescription(description);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const crumbs = [
    {
      label: "Dashboards",
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/edit/${dashboard?.id}`,
    },
  ];

  if (!loading) {
    crumbs.push({
      label: "Edit details",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Edit Details</h1>

      {loading || !dashboard || !topicareas || topicareas.length === 0 ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <div className="grid-row width-desktop">
          <div className="grid-col-6">
            <div className="grid-row">
              <div className="grid-col-12">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="edit-details-form usa-form usa-form--large"
                  onChange={onFormChange}
                  data-testid="EditDetailsForm"
                >
                  <TextField
                    id="name"
                    name="name"
                    label="Dashboard Name"
                    error={errors.name && "Please specify a name"}
                    defaultValue={dashboard?.name}
                    register={register}
                    required
                  />

                  <Dropdown
                    id="topicAreaId"
                    name="topicAreaId"
                    label={settings.topicAreaLabels.singular}
                    hint={`Select an existing ${settings.topicAreaLabels.singular.toLowerCase()}`}
                    defaultValue={dashboard?.topicAreaId}
                    register={register}
                    options={topicareas.map((topicarea) => ({
                      value: topicarea.id,
                      label: topicarea.name,
                    }))}
                  />

                  <TextField
                    id="description"
                    name="description"
                    label="Description - optional"
                    defaultValue={dashboard?.description}
                    hint={
                      <>
                        Give your dashboard a description to explain it in more
                        depth. This text area supports limited markdown.{" "}
                        <Link target="_blank" to={"/admin/markdown"} external>
                          View Markdown Syntax
                        </Link>
                      </>
                    }
                    register={register}
                    multiline
                    rows={10}
                  />

                  <br />
                  <Button type="submit" disabled={loading}>
                    Save
                  </Button>
                  <Button
                    variant="unstyled"
                    type="button"
                    className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </form>
              </div>
            </div>
          </div>
          <div className="grid-col-6">
            <div className="margin-left-3 margin-top-2">
              <DashboardHeader
                name={name}
                topicAreaName={topicAreaName}
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
      )}
    </>
  );
}

export default EditDetails;
