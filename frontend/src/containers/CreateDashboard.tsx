import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import AdminLayout from "../layouts/Admin";
import BadgerService from "../services/BadgerService";
import { useTopicAreas } from "../hooks";
// import TopicAreaDropdown from "../components/TopicAreaDropdown";

interface FormValues {
  name: string;
  topicAreaId: string;
}

function CreateDashboard() {
  const history = useHistory();
  const { topicareas } = useTopicAreas();
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    const newDashboard = await BadgerService.createDashboard(values.name, values.topicAreaId);
    const dashboardId = newDashboard.id;
    history.push(`/admin/dashboard/edit/${values.topicAreaId}/${dashboardId}`);
  };

  const onCancel = () => {
    history.push("/admin/dashboards");
  };

  return (
    <AdminLayout>
      <h1>Create dashboard</h1>
      <div className="grid-row">
        <div className="grid-col-6">
          <form onSubmit={handleSubmit(onSubmit)} className="usa-form">

            <div className="usa-form-group">
              <label htmlFor="name" className="usa-label">Dashboard Name</label>
              {errors.name && 
                <span className="usa-error-message" id="input-error-message" role="alert">
                  Please specify a name
                </span>
              }
              <input className="usa-input" name="name" ref={register({ required: true })} />
            </div>

            <div className="usa-form-group">
              <label htmlFor="topicAreaId" className="usa-label">Topic Area</label>
              {errors.topicAreaId && 
                <span className="usa-error-message" id="input-error-message" role="alert">
                  Please select a topic area
                </span>
              }
              <select ref={register({ required: true })} name="topicAreaId" className="usa-select">
                <option value=""></option>
                {topicareas.map(topicarea => {
                  return (
                    <option key={topicarea.id} value={topicarea.id}>{topicarea.name}</option>
                  );
                })}
              </select>
            </div>
            
            <br />
            <button
              className="usa-button"
              type="submit"
            >
              Create
            </button>
            <button className="usa-button usa-button--unstyled" onClick={onCancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default CreateDashboard;
