import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory, useParams } from "react-router-dom";
import { parse, ParseResult } from "papaparse";
import { Dataset, ChartType } from "../models";
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
import { useWidget, useDashboard } from "../hooks";
import Spinner from "../components/Spinner";
import UtilsService from "../services/UtilsService";

interface FormValues {
  title: string;
  summary: string;
  chartType: string;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditChart() {
  const history = useHistory();
  const { dashboardId, widgetId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [fileLoading, setFileLoading] = useState(false);
  const [editingWidget, setEditingWidget] = useState(false);
  const { widget, json, setJson, setWidget } = useWidget(dashboardId, widgetId);

  const onFileProcessed = useCallback(
    async (data: File) => {
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
          } else {
            setCsvErrors(undefined);
            setJson(results.data);
          }
        },
      });
      setCsvFile(data);
    },
    [setJson]
  );

  const uploadDataset = async (): Promise<Dataset | null> => {
    if (!csvFile) {
      // User did not select a new dataset.
      // No need to upload anything.
      return null;
    }

    if (!csvFile.lastModified) {
      return {
        id: widget?.content.datasetId,
        fileName: csvFile.name,
        s3Key: widget?.content.s3Key,
      };
    }

    setFileLoading(true);
    const uploadResponse = await StorageService.uploadDataset(
      csvFile,
      JSON.stringify(json)
    );

    const newDataset = await BackendService.createDataset(csvFile.name, {
      raw: uploadResponse.s3Keys.raw,
      json: uploadResponse.s3Keys.json,
    });

    setFileLoading(false);
    return newDataset;
  };

  const onSubmit = async (values: FormValues) => {
    if (!widget) {
      return;
    }

    try {
      const newDataset = await uploadDataset();
      const datasetId = newDataset ? newDataset.id : widget.content.datasetId;
      const s3Key = newDataset ? newDataset.s3Key : widget.content.s3Key;

      setEditingWidget(true);
      await BackendService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        {
          title: values.title,
          summary: values.summary,
          chartType: values.chartType,
          datasetId,
          s3Key,
          fileName: csvFile?.name,
        },
        widget.updatedAt
      );
      setEditingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" ${UtilsService.getChartTypeLabel(
            values.chartType
          ).toLowerCase()} has been successfully edited`,
        },
      });
    } catch (err) {
      console.log("Failed to edit content item", err);
      setEditingWidget(false);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (widget) {
      setWidget({
        ...widget,
        content: {
          ...widget.content,
          title: (event.target as HTMLInputElement).value,
        },
      });
    }
  };

  const handleSummaryChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    if (widget) {
      setWidget({
        ...widget,
        content: {
          ...widget.content,
          summary: (event.target as HTMLTextAreaElement).value,
        },
      });
    }
  };

  const handleChartTypeChange = (
    event: React.FormEvent<HTMLFieldSetElement>
  ) => {
    const selectedType = (event.target as HTMLInputElement).value;
    if (widget) {
      setWidget({
        ...widget,
        content: {
          ...widget.content,
          chartType: selectedType,
        },
      });
    }
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

  if (!loading && widget) {
    crumbs.push({
      label: "Edit chart",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Edit chart</h1>

      {loading || !widget ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
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
                    defaultValue={widget.content.title}
                    required
                    register={register}
                  />
                  <FileInput
                    id="dataset"
                    name="dataset"
                    label="File upload"
                    accept=".csv"
                    loading={fileLoading}
                    errors={csvErrors}
                    register={register}
                    fileName={`${
                      csvFile?.name ||
                      widget.content.fileName ||
                      widget.content.title + ".csv"
                    }`}
                    hint={
                      <span>
                        Must be a CSV file.{" "}
                        <Link to="/admin/formattingcsv" target="_blank">
                          How do I format my CSV file?
                        </Link>
                      </span>
                    }
                    onFileProcessed={onFileProcessed}
                  />
                  {widget ? (
                    <div hidden={!json}>
                      <RadioButtons
                        id="chartType"
                        name="chartType"
                        label="Chart type"
                        hint="Choose a chart type. [Link] Which chart is right for my data?"
                        register={register}
                        error={errors.chartType && "Please select a chart type"}
                        onChange={handleChartTypeChange}
                        defaultValue={widget.content.chartType}
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
                    for those with visual impairments."
                        register={register}
                        defaultValue={widget.content.summary}
                        onChange={handleSummaryChange}
                        multiline
                        rows={5}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </fieldset>
                <br />
                <br />
                <hr />
                <Button
                  disabled={!json || fileLoading || editingWidget}
                  type="submit"
                >
                  Save
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
              <div hidden={!json} className="margin-left-4">
                <h4>Preview</h4>
                {widget.content.chartType === ChartType.LineChart && (
                  <LineChartPreview
                    title={widget.content.title}
                    summary={widget.content.summary}
                    lines={
                      json.length > 0
                        ? (Object.keys(json[0]) as Array<string>)
                        : []
                    }
                    data={json}
                  />
                )}
                {widget.content.chartType === ChartType.ColumnChart && (
                  <ColumnChartPreview
                    title={widget.name}
                    summary={widget.content.summary}
                    columns={
                      json.length > 0
                        ? (Object.keys(json[0]) as Array<string>)
                        : []
                    }
                    data={json}
                  />
                )}
                {widget.content.chartType === ChartType.BarChart && (
                  <BarChartPreview
                    title={widget.name}
                    summary={widget.content.summary}
                    bars={
                      json.length > 0
                        ? (Object.keys(json[0]) as Array<string>)
                        : []
                    }
                    data={json}
                  />
                )}
                {widget.content.chartType === ChartType.PartWholeChart && (
                  <PartWholeChartPreview
                    title={widget.name}
                    summary={widget.content.summary}
                    parts={
                      json.length > 0
                        ? (Object.keys(json[0]) as Array<string>)
                        : []
                    }
                    data={json}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditChart;
