import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";

interface FormValues {
  title: string;
}

function AddChart() {
  const history = useHistory();
  const { dashboardId } = useParams();
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = (values: FormValues) => {
    console.log("Values", values);
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  return (
    <AdminLayout>
      <Breadcrumbs />
      <h1>Add content</h1>
      <div className="text-base text-italic">Step 2 of 2</div>
      <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
        Configure chart
      </div>
      <div className="grid-col-6">
        <form
          className="usa-form usa-form--large"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="usa-fieldset">
            <TextField
              id="title"
              name="title"
              label="Chart title"
              hint="Give your chart a descriptive title."
              error={errors.title && "Please specify a chart title"}
              required
              register={register}
            />
            <FileInput
              id="dataset"
              name="dataset"
              label="File upload"
              hint="Must be a CSV file. [Link] How do I format my CSV?"
            />
          </fieldset>
          <br />
          <br />
          <hr />
          <Button variant="outline" onClick={goBack}>
            Back
          </Button>
          <Button disabled type="submit">
            Add chart
          </Button>
          <Button variant="unstyled" onClick={onCancel}>
            Cancel
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddChart;
