import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { parse, ParseResult } from "papaparse";
import { Dataset, ChartType, WidgetType } from "../models";
import { useDashboard } from "../hooks";
import StorageService from "../services/StorageService";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import RadioButtons from "../components/RadioButtons";
import LineChartPreview from "../components/LineChartPreview";
import ColumnChartPreview from "../components/ColumnChartPreview";
import BarChartPreview from "../components/BarChartPreview";
import PartWholeChartPreview from "../components/PartWholeChartPreview";
import UtilsService from "../services/UtilsService";

interface FormValues {
  title: string;
  summary: string;
  chartType: string;
}

interface PathParams {
  dashboardId: string;
}

function AddChart() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [dataset, setDataset] = useState<Array<object> | undefined>(undefined);
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [chartType, setChartType] = useState<ChartType>(ChartType.LineChart);
  const [fileLoading, setFileLoading] = useState(false);
  const [creatingWidget, setCreatingWidget] = useState(false);

  const uploadDataset = async (): Promise<Dataset> => {
    if (!csvFile) {
      throw new Error("CSV file not specified");
    }

    setFileLoading(true);
    const uploadResponse = await StorageService.uploadDataset(
      csvFile,
      JSON.stringify(dataset)
    );

    const newDataset = await BackendService.createDataset(csvFile.name, {
      raw: uploadResponse.s3Keys.raw,
      json: uploadResponse.s3Keys.json,
    });

    setFileLoading(false);
    return newDataset;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const newDataset = await uploadDataset();

      setCreatingWidget(true);
      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Chart,
        {
          title: values.title,
          summary: values.summary,
          chartType: values.chartType,
          datasetId: newDataset.id,
          s3Key: newDataset.s3Key,
        }
      );
      setCreatingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" ${UtilsService.getChartTypeLabel(
            values.chartType
          ).toLowerCase()} has been successfully added`,
        },
      });
    } catch (err) {
      console.log("Failed to save widget", err);
      setCreatingWidget(false);
    }
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

  const handleSummaryChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setSummary((event.target as HTMLTextAreaElement).value);
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

  const crumbs = [
    {
      label: "Dashboards",
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/edit/${dashboardId}`,
    },
  ];

  if (!loading) {
    crumbs.push({
      label: "Add chart",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Add chart</h1>

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
                loading={fileLoading}
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

                <TextField
                  id="summary"
                  name="summary"
                  label="Chart summary"
                  hint="Give your chart a summary to explain it in more depth.
                  It can also be read by screen readers to describe the chart
                  for those with visual impairments. What is useful in a chart description?"
                  register={register}
                  onChange={handleSummaryChange}
                  multiline
                  rows={5}
                />
              </div>
            </fieldset>
            <br />
            <br />
            <hr />
            <Button variant="outline" type="button" onClick={goBack}>
              Back
            </Button>
            <Button
              disabled={!dataset || fileLoading || creatingWidget}
              type="submit"
            >
              Add chart
            </Button>
            <Button
              variant="unstyled"
              className="text-base-dark hover:text-base-darker active:text-base-darkest"
              type="button"
              onClick={onCancel}
            >
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
                summary={summary}
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
                summary={summary}
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
                summary={summary}
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
                summary={summary}
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
    </>
  );
}

export default AddChart;
