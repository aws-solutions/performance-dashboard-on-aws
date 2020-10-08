import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { parse, ParseResult } from "papaparse";
import { Dataset, ChartType, WidgetType } from "../models";
import StorageService from "../services/StorageService";
import BadgerService from "../services/BadgerService";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import RadioButtons from "../components/RadioButtons";
import LineChartPreview from "../components/LineChartPreview";
import ColumnChartPreview from "../components/ColumnChartPreview";
import BarChartPreview from "../components/BarChartPreview";
import PartWholeChartPreview from "../components/PartWholeChartPreview";

interface FormValues {
  title: string;
  chartType: string;
}

interface PathParams {
  dashboardId: string;
}

function AddChart() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [dataset, setDataset] = useState<Array<object> | undefined>(undefined);
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [chartType, setChartType] = useState<ChartType>(ChartType.LineChart);
  const [loading, setLoading] = useState(false);

  const uploadDataset = async (): Promise<Dataset> => {
    if (!csvFile) {
      throw new Error("CSV file not specified");
    }

    setLoading(true);
    const uploadResponse = await StorageService.uploadDataset(
      csvFile,
      JSON.stringify(dataset)
    );

    const newDataset = await BadgerService.createDataset(csvFile.name, {
      raw: uploadResponse.s3Keys.raw,
      json: uploadResponse.s3Keys.json,
    });

    setLoading(false);
    return newDataset;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const newDataset = await uploadDataset();
      await BadgerService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Chart,
        {
          title: values.title,
          chartType: values.chartType,
          datasetId: newDataset.id,
          s3Key: newDataset.s3Key,
        }
      );
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

  const handleTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  const handleChartTypeChange = (
    event: React.FormEvent<HTMLFieldSetElement>
  ) => {
    setChartType((event.target as HTMLInputElement).value as ChartType);
  };

  const onFileProcessed = (data: File) => {
    if (!data) {
      return;
    }
    parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      comments: "#",
      complete: function (results: ParseResult<object>) {
        if (results.errors.length) {
          setCsvErrors(results.errors);
          setDataset(undefined);
        } else {
          setCsvErrors(undefined);
          setDataset(results.data);
        }
      },
    });
    setCsvFile(data);
  };

  return (
    <AdminLayout>
      <Breadcrumbs />
      <h1>Add content</h1>
      <div className="text-base text-italic">Step 2 of 2</div>
      <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
        Configure chart
      </div>
      <div className="grid-row width-desktop">
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
                onChange={handleTitleChange}
                required
                register={register}
              />

              <FileInput
                id="dataset"
                name="dataset"
                label="File upload"
                accept=".csv"
                disabled={!title}
                loading={loading}
                errors={csvErrors}
                register={register}
                hint="Must be a CSV file. [Link] How do I format my CSV?"
                fileName={csvFile && csvFile.name}
                onFileProcessed={onFileProcessed}
              />

              <div hidden={!dataset}>
                <RadioButtons
                  id="chartType"
                  name="chartType"
                  label="Chart type"
                  hint="Choose a chart type. [Link] Which chart is right for my data?"
                  register={register}
                  error={errors.chartType && "Please select a chart type"}
                  onChange={handleChartTypeChange}
                  defaultValue={ChartType.LineChart}
                  required
                  options={[
                    {
                      value: ChartType.BarChart,
                      label: "Bar",
                    },
                    {
                      value: ChartType.ColumnChart,
                      label: "Column",
                    },
                    {
                      value: ChartType.LineChart,
                      label: "Line",
                    },
                    {
                      value: ChartType.PartWholeChart,
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
            <Button disabled={!dataset || loading} type="submit">
              Add chart
            </Button>
            <Button variant="unstyled" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </div>
        <div className="grid-col-6">
          <div hidden={!dataset} className="margin-left-4">
            <h4>Preview</h4>
            {chartType === ChartType.LineChart && (
              <LineChartPreview
                title={title}
                lines={
                  dataset && dataset.length
                    ? (Object.keys(dataset[0]) as Array<string>)
                    : []
                }
                data={dataset}
              />
            )}
            {chartType === ChartType.ColumnChart && (
              <ColumnChartPreview
                title={title}
                columns={
                  dataset && dataset.length
                    ? (Object.keys(dataset[0]) as Array<string>)
                    : []
                }
                data={dataset}
              />
            )}
            {chartType === ChartType.BarChart && (
              <BarChartPreview
                title={title}
                bars={
                  dataset && dataset.length
                    ? (Object.keys(dataset[0]) as Array<string>)
                    : []
                }
                data={dataset}
              />
            )}
            {chartType === ChartType.PartWholeChart && (
              <PartWholeChartPreview
                title={title}
                parts={
                  dataset && dataset.length
                    ? (Object.keys(dataset[0]) as Array<string>)
                    : []
                }
                data={dataset}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddChart;
