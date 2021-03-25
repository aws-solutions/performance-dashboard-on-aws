import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTopicAreas, useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import TextField from "../components/TextField";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";
import PrimaryActionBar from "../components/PrimaryActionBar";
import Link from "../components/Link";

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

  const name = watch("name");
  const description = watch("description");
  const topicAreaId = watch("topicAreaId");

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

  const getTopicAreaName = (topicAreaId: string) => {
    return topicareas.find((t) => t.id === topicAreaId)?.name || "";
  };

  const onCancel = () => {
    history.push("/admin/dashboards");
  };

  if (loading) {
    return <Spinner className="text-center margin-top-9" label="Loading" />;
  }

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

      <div className="grid-row width-desktop">
        <div className="grid-col-6">
          <div className="grid-row">
            <div className="grid-col-12">
              <PrimaryActionBar>
                <h1 className="margin-top-0">Create dashboard</h1>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="usa-form usa-form--large"
                  data-testid="CreateDashboardForm"
                >
                  <TextField
                    id="name"
                    name="name"
                    label="Dashboard Name"
                    hint="Give your dashboard a descriptive name"
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

                  <TextField
                    id="description"
                    name="description"
                    label="Description - optional"
                    hint={
                      <>
                        Give your dashboard a description that provides an initial summary. This text area supports limited markdown.{" "}
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
                  <hr />
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
