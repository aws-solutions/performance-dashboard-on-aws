import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTopicAreas } from "../hooks";
import BackendService from "../services/BackendService";
import Markdown from "../components/Markdown";
import TextField from "../components/TextField";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";

interface FormValues {
  name: string;
  topicAreaId: string;
  description: string;
}

function CreateDashboard() {
  const history = useHistory();
  const { topicareas } = useTopicAreas();
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    const dashboard = await BackendService.createDashboard(
      values.name,
      values.topicAreaId,
      values.description || ""
    );
    history.push(`/admin/dashboard/edit/${dashboard.id}`);
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
      <div className="grid-row">
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="usa-form usa-form--large"
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
              label="Topic Area"
              hint="Select an existing topic area"
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
              className="margin-left-1"
              variant="unstyled"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateDashboard;
