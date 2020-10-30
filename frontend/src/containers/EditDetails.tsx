import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTopicAreas, useDashboard } from "../hooks";
import BadgerService from "../services/BadgerService";
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

interface PathParams {
  dashboardId: string;
}

function EditDetails() {
  const history = useHistory();
  const { topicareas } = useTopicAreas();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await BadgerService.editDashboard(
      dashboardId,
      values.name,
      values.topicAreaId,
      values.description || "",
      dashboard ? dashboard.updatedAt : new Date()
    );
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  if (!dashboard || !topicareas || topicareas.length === 0) {
    return null;
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
            label: dashboard.name,
            url: `/admin/dashboard/edit/${dashboard.id}`,
          },
          {
            label: "Edit details",
          },
        ]}
      />
      <h1>Edit Details</h1>
      <div className="grid-row">
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="edit-details-form usa-form usa-form--large"
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
              label="Topic Area"
              hint="Select an existing topic area"
              defaultValue={dashboard?.topicAreaId}
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
              defaultValue={dashboard?.description}
              register={register}
              hint="Give your dashboard a description to explain it in more depth."
            />

            <br />
            <Button type="submit" disabled={loading}>
              Save
            </Button>
            <Button
              variant="unstyled"
              type="button"
              className="margin-left-1"
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

export default EditDetails;
