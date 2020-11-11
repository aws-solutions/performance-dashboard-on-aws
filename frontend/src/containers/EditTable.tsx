import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Dataset } from "../models";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import { parse, ParseResult } from "papaparse";
import TablePreview from "../components/TablePreview";
import { useWidget, useDashboard } from "../hooks";
import Spinner from "../components/Spinner";

interface FormValues {
  title: string;
  summary: string;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditTable() {
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
          datasetId,
          s3Key,
        },
        widget.updatedAt
      );
      setEditingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" table has been successfully edited`,
        },
      });
    } catch (err) {
      console.log("Failed to edit widget", err);
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
      label: "Edit table",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Edit table</h1>

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
                    label="Table title"
                    hint="Give your table a descriptive title."
                    error={errors.title && "Please specify a table title"}
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
                    hint="Must be a CSV file. [Link] How do I format my CSV?"
                    fileName={`${widget.content.title}.csv`}
                    onFileProcessed={onFileProcessed}
                  />

                  <div hidden={!json}>
                    {json.length > 0 &&
                    (Object.keys(json[0]) as Array<string>).length >= 8 ? (
                      <div className="usa-alert usa-alert--warning margin-top-3">
                        <div className="usa-alert__body">
                          <p className="usa-alert__text">
                            It is recommended that tables have less than 8
                            columns. You can still continue.
                          </p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <TextField
                      id="summary"
                      name="summary"
                      label="Table summary"
                      hint="Give your table a summary to explain it in more depth.
                  It can also be read by screen readers to describe the table
                  for those with visual impairments. What is useful in a table description?"
                      register={register}
                      defaultValue={widget.content.summary}
                      onChange={handleSummaryChange}
                      multiline
                      rows={5}
                    />
                  </div>
                </fieldset>
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
                <TablePreview
                  title={widget.content.title}
                  summary={widget.content.summary}
                  headers={
                    json.length > 0
                      ? (Object.keys(json[0]) as Array<string>)
                      : []
                  }
                  data={json}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditTable;
