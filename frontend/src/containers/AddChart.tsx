import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import BadgerService from "../services/BadgerService";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import RadioButtons from "../components/RadioButtons";

interface FormValues {
  title: string;
  chartType: string;
}

function AddChart() {
  const history = useHistory();
  const { dashboardId } = useParams();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [dataset, setDataset] = useState<object | null>(null);

  const onSubmit = async (values: FormValues) => {
    try {
      await BadgerService.createWidget(dashboardId, values.title, "Chart", {
        title: values.title,
        chartType: values.chartType,
      });
    } catch (err) {
      console.log("Failed to save widget", err);
    }

    history.push(`/admin/dashboard/edit/${dashboardId}`);
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
      <div className="grid-row">
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
                onFileProcessed={(data: object) => setDataset(data)}
              />

              <div hidden={!dataset}>
                <RadioButtons
                  id="chartType"
                  name="chartType"
                  label="Chart type"
                  hint="Choose a chart type. [Link] Which chart is right for my data?"
                  register={register}
                  error={errors.chartType && "Please select a chart type"}
                  defaultValue="LineChart"
                  required
                  options={[
                    {
                      value: "BarChart",
                      label: "Bar",
                    },
                    {
                      value: "ColumnChart",
                      label: "Column",
                    },
                    {
                      value: "LineChart",
                      label: "Line",
                    },
                    {
                      value: "PartWholeChart",
                      label: "Part-to-whole",
                    },
                  ]}
                />
              </div>
            </fieldset>
            <br />
            <br />
            <hr />
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
            <Button disabled={!dataset} type="submit">
              Add chart
            </Button>
            <Button variant="unstyled" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </div>
        <div className="grid-col-6">
          <div hidden={!dataset} className="text-center">
            Chart placeholder
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddChart;
