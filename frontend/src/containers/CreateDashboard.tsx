import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTopicAreas, useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Markdown from "../components/Markdown";
import TextField from "../components/TextField";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";

interface FormValues {
  name: string;
  topicAreaId: string;
  description: string;
}

function CreateDashboard() {
  const history = useHistory();
  const { settings } = useSettings();
  const { topicareas, loading } = useTopicAreas();
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const [name, setName] = useState("");
  const [topicAreaName, setTopicAreaName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = async (values: FormValues) => {
    const dashboard = await BackendService.createDashboard(
      values.name,
      values.topicAreaId,
      values.description || ""
    );

    history.push(`/admin/dashboard/edit/${dashboard.id}`, {
      alert: {
        type: "success",
        message: `"${dashboard.name}" draft dashboard successfully created`,
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
    history.push("/admin/dashboards");
  };

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: "Dashboards",
            url: "/admin/dashboards",
          },
          {
            label: "Create new dashboard",
          },
        ]}
      />
      <h1>Create new dashboard</h1>

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <div className="grid-row width-desktop">
          <div className="grid-col-6">
            <div className="grid-row">
              <div className="grid-col-12">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="usa-form usa-form--large"
                  onChange={onFormChange}
                  data-testid="CreateDashboardForm"
                >
                  <TextField
                    id="name"
                    name="name"
                    label="Dashboard Name"
                    register={register}
                    error={errors.name && "Please specify a name"}
                    required
                  />

                  <Dropdown
                    id="topicAreaId"
                    name="topicAreaId"
                    label={settings.topicAreaLabels.singular}
                    hint={`Select an existing ${settings.topicAreaLabels.singular.toLowerCase()}`}
                    register={register}
                    options={topicareas.map((topicarea) => ({
                      value: topicarea.id,
                      label: topicarea.name,
                    }))}
                  />

                  <Markdown
                    id="description"
                    name="description"
                    label="Description - optional"
                    hint="Give your dashboard a description to explain it in more depth."
                    register={register}
                  />

                  <br />
                  <Button type="submit">Create</Button>
                  <Button
                    className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                    variant="unstyled"
                    type="button"
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

export default CreateDashboard;
