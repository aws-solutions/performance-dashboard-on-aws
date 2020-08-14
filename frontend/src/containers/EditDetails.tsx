import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import AdminLayout from "../layouts/Admin";
import BadgerService from "../services/BadgerService";
import { useTopicAreas } from "../hooks";
import Markdown from "../components/Markdown";
import "./EditDetails.css";

interface FormValues {
  name: string;
  topicAreaId: string;
  description: string;
}

function EditDetails() {
  const history = useHistory();
  const { topicareas } = useTopicAreas();
  const { dashboardId } = useParams();
  const [id, setId] = useState(dashboardId);
  const [name, setName] = useState("");
  const [topicAreaId, setTopicAreaId] = useState("");
  const [description, setDescription] = useState("");
  const { register, errors, handleSubmit, setValue } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await BadgerService.editDashboard(
      id,
      values.name,
      values.topicAreaId,
      values.description || ""
    );
    history.push(`/admin/dashboard/edit/${id}`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${id}`);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setValue("name", event.target.value);
  };

  const handleTopicAreaIdChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTopicAreaId(event.target.value);
    setValue("topicAreaId", event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValue("description", event.target.value);
  };

  useEffect(() => {
    register("name");
    register("topicAreaId");
    register("description");
  }, [register]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await BadgerService.fetchDashboardById(dashboardId);
      setId(data.id);
      setDescription(data.description);
      setValue("description", data.description);
      setName(data.name);
      setValue("name", data.name);
      setTopicAreaId(data.topicAreaId);
      setValue("topicAreaId", data.topicAreaId);
    };
    fetchData();
  }, [dashboardId, setValue]);

  return (
    <AdminLayout>
      <h1>Edit Details</h1>
      <div className="grid-row">
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="edit-details-form usa-form"
            data-testid="EditDetailsForm"
          >
            <div className="edit-details-form-group-dashboard-name usa-form-group">
              <label htmlFor="name" className="usa-label">
                Dashboard Name
              </label>
              {errors.name && (
                <span
                  className="usa-error-message"
                  id="input-error-message"
                  role="alert"
                >
                  Please specify a name
                </span>
              )}
              <input
                id="name"
                className="usa-input"
                name="name"
                value={name}
                onChange={handleNameChange}
              />
            </div>

            <div className="edit-details-form-group-topicarea-id usa-form-group">
              <label htmlFor="topicAreaId" className="usa-label">
                Topic Area
              </label>
              <div className="usa-hint" id="event-date-start-hint">
                Select an existing topic area
              </div>
              {errors.topicAreaId && (
                <span
                  className="usa-error-message"
                  id="input-error-message"
                  role="alert"
                >
                  Please select a topic area
                </span>
              )}
              <select
                id="topicAreaId"
                value={topicAreaId}
                onChange={handleTopicAreaIdChange}
                name="topicAreaId"
                className="usa-select"
              >
                <option value="">- Select -</option>
                {topicareas.map((topicarea) => {
                  return (
                    <option
                      data-testid="topicAreaOption"
                      key={topicarea.id}
                      value={topicarea.id}
                    >
                      {topicarea.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {name && (
              <Markdown
                text={description}
                title="Description - optional"
                subtitle="Give your dashboard a description to explain it in more depth."
                onChange={handleDescriptionChange}
              />
            )}

            <br />
            <button className="usa-button" type="submit">
              Edit
            </button>
            <button
              className="usa-button usa-button--unstyled"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditDetails;
