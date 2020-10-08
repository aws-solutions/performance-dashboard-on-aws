import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { parse, ParseResult } from "papaparse";
import { Dataset, ChartType } from "../models";
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
import { useWidget } from "../hooks";

interface FormValues {
  title: string;
  chartType: string;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditChart() {
  const history = useHistory();
  const { dashboardId, widgetId } = useParams<PathParams>();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    const uploadResponse = await StorageService.uploadDataset(
      csvFile,
      JSON.stringify(json)
    );

    const newDataset = await BadgerService.createDataset(csvFile.name, {
      raw: uploadResponse.s3Keys.raw,
      json: uploadResponse.s3Keys.json,
    });

    setLoading(false);
    return newDataset;
  };

  const onSubmit = async (values: FormValues) => {
    if (!widget) {
      return;
    }

    try {
      const newDataset = await uploadDataset();
      const datasetId = newDataset ? newDataset.id : widget.content?.datasetId;
      const s3Key = newDataset ? newDataset.s3Key : widget.content?.s3Key;

      await BadgerService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        {
          title: values.title,
          chartType: values.chartType,
          datasetId,
          s3Key,
        },
        widget.updatedAt
      );

      history.push(`/admin/dashboard/edit/${dashboardId}`);
    } catch (err) {
      console.log("Failed to edit widget", err);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (widget) {
      setWidget({
        ...widget,
        name: (event.target as HTMLInputElement).value,
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

  if (!widget) {
    return null;
  }

  return (
    <AdminLayout>
      <Breadcrumbs />
      <h1>Edit content item</h1>
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
                defaultValue={widget.name}
                required
                register={register}
              />
              <FileInput
                id="dataset"
                name="dataset"
                label="File upload"
                accept=".csv"
                loading={loading}
                errors={csvErrors}
                register={register}
                hint="Must be a CSV file. [Link] How do I format my CSV?"
                fileName={`${widget.content?.title}.csv`}
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
                    defaultValue={widget.content?.chartType}
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
              ) : (
                ""
              )}
            </fieldset>
            <br />
            <br />
            <hr />
            <Button disabled={!json || loading} type="submit">
              Save
            </Button>
            <Button variant="unstyled" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </div>
        <div className="grid-col-6">
          <div hidden={!json} className="margin-left-4">
            <h4>Preview</h4>
            {widget.content?.chartType === "LineChart" && (
              <LineChartPreview
                title={widget.name}
                lines={
                  json.length > 0 ? (Object.keys(json[0]) as Array<string>) : []
                }
                data={json}
              />
            )}
            {widget.content?.chartType === "ColumnChart" && (
              <ColumnChartPreview
                title={widget.name}
                columns={
                  json.length > 0 ? (Object.keys(json[0]) as Array<string>) : []
                }
                data={json}
              />
            )}
            {widget.content?.chartType === "BarChart" && (
              <BarChartPreview
                title={widget.name}
                bars={
                  json.length > 0 ? (Object.keys(json[0]) as Array<string>) : []
                }
                data={json}
              />
            )}
            {widget.content?.chartType === "PartWholeChart" && (
              <PartWholeChartPreview
                title={widget.name}
                parts={
                  json.length > 0 ? (Object.keys(json[0]) as Array<string>) : []
                }
                data={json}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditChart;
