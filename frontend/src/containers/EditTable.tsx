import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Dataset, DatasetType } from "../models";
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
import Link from "../components/Link";
import ComboBox from "../components/Combobox";
import { useDatasets } from "../hooks/dataset-hooks";
import { title } from "process";

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
  const { dynamicDatasets, staticDatasets } = useDatasets();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [fileLoading, setFileLoading] = useState(false);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [editingWidget, setEditingWidget] = useState(false);
  const {
    widget,
    json,
    setJson,
    setWidget,
    datasetType,
    setDatasetType,
  } = useWidget(dashboardId, widgetId);

  const [dynamicDataset, setDynamicDataset] = useState<Dataset | undefined>(
    dynamicDatasets.find((d) => d.s3Key.json === widget?.content.s3Key.json)
  );
  const [staticDataset, setStaticDataset] = useState<Dataset | undefined>(
    staticDatasets.find((d) => d.s3Key.json === widget?.content.s3Key.json)
  );

  const onFileProcessed = useCallback(
    async (data: File) => {
      if (!data) {
        return;
      }
      setDatasetLoading(true);
      parse(data, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        comments: "#",
        complete: function (results: ParseResult<object>) {
          if (results.errors.length) {
            setCsvErrors(results.errors);
            setJson([]);
          } else {
            setCsvErrors(undefined);
            setJson(results.data);
          }
          setDatasetLoading(false);
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
      let newDataset;
      if (csvFile) {
        newDataset = await uploadDataset();
      }

      setEditingWidget(true);
      await BackendService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        {
          title: values.title,
          summary: values.summary,
          datasetType: datasetType,
          datasetId: newDataset
            ? newDataset.id
            : dynamicDataset?.id || staticDataset?.id,
          s3Key: newDataset
            ? newDataset.s3Key
            : dynamicDataset?.s3Key || staticDataset?.s3Key,
          fileName: csvFile
            ? csvFile.name
            : dynamicDataset?.fileName || staticDataset?.fileName,
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

  const handleChange = async (event: React.FormEvent<HTMLFieldSetElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.name === "datasetType") {
      setDatasetType(target.value as DatasetType);
      if (
        datasetType === DatasetType.DynamicDataset &&
        dynamicDataset &&
        dynamicDataset.s3Key.json
      ) {
        setDatasetLoading(true);
        const dataset = await StorageService.downloadJson(
          dynamicDataset.s3Key.json
        );
        setJson(dataset);
        setDatasetLoading(false);
      }
      if (
        datasetType === DatasetType.StaticDataset &&
        staticDataset &&
        staticDataset.s3Key.json
      ) {
        setDatasetLoading(true);
        const dataset = await StorageService.downloadJson(
          staticDataset.s3Key.json
        );
        setJson(dataset);
        setDatasetLoading(false);
      }
    }
  };

  const onSelectDynamicDataset = async (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    event.persist();
    setDatasetLoading(true);

    const jsonFile = (event.target as HTMLInputElement).value;
    const dataset = await StorageService.downloadJson(jsonFile);

    setJson(dataset);
    setDynamicDataset(dynamicDatasets.find((d) => d.s3Key.json === jsonFile));
    setStaticDataset(undefined);
    setCsvFile(undefined);

    setDatasetLoading(false);
    event.stopPropagation();
  };

  const onSelectStaticDataset = async (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    event.persist();
    setDatasetLoading(true);

    const jsonFile = (event.target as HTMLInputElement).value;
    const dataset = await StorageService.downloadJson(jsonFile);

    setJson(dataset);
    setStaticDataset(staticDatasets.find((d) => d.s3Key.json === jsonFile));
    setDynamicDataset(undefined);
    setCsvFile(undefined);

    setDatasetLoading(false);
    event.stopPropagation();
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

      {loading || !widget || !datasetType ? (
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

                  <label htmlFor="fieldset" className="usa-label text-bold">
                    Data
                  </label>
                  <div className="usa-hint">
                    Choose an existing dataset or create a new one to populate
                    this table.
                  </div>
                  <fieldset
                    id="fieldset"
                    className="usa-fieldset"
                    onChange={handleChange}
                  >
                    <legend className="usa-sr-only">Content item types</legend>
                    <div className="usa-radio">
                      <div className="grid-row">
                        <div className="grid-col flex-5">
                          <input
                            className="usa-radio__input"
                            id="dynamicDataset"
                            value="DynamicDataset"
                            type="radio"
                            name="datasetType"
                            defaultChecked={
                              datasetType === DatasetType.DynamicDataset
                            }
                            ref={register()}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="dynamicDataset"
                          >
                            Select a dynamic dataset
                          </label>
                        </div>
                      </div>
                    </div>
                    {datasetType === DatasetType.DynamicDataset && (
                      <div className="margin-left-4">
                        <div className="usa-hint margin-top-1">
                          Choose from a list of available datasets.
                        </div>
                        <ComboBox
                          id="dynamicDatasets"
                          name="dynamicDatasets"
                          label=""
                          options={dynamicDatasets.map((d) => {
                            return {
                              value: d.s3Key.json,
                              content: `${d.fileName} (${d.s3Key.json})`,
                            };
                          })}
                          value={dynamicDataset?.s3Key.json}
                          onChange={onSelectDynamicDataset}
                        />
                      </div>
                    )}
                    <div className="usa-radio">
                      <div className="grid-row">
                        <div className="grid-col flex-5">
                          <input
                            className="usa-radio__input"
                            id="staticDataset"
                            value="StaticDataset"
                            type="radio"
                            name="datasetType"
                            defaultChecked={
                              datasetType === DatasetType.StaticDataset
                            }
                            ref={register()}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="staticDataset"
                          >
                            Select a static dataset
                          </label>
                        </div>
                      </div>
                    </div>
                    {datasetType === DatasetType.StaticDataset && (
                      <div className="margin-left-4">
                        <div className="usa-hint margin-top-1">
                          Choose from a list of available datasets.
                        </div>
                        <ComboBox
                          id="staticDatasets"
                          name="staticDatasets"
                          label=""
                          options={staticDatasets.map((d) => {
                            return {
                              value: d.s3Key.json,
                              content: `${d.fileName} (${d.s3Key.json})`,
                            };
                          })}
                          value={staticDataset?.s3Key.json}
                          onChange={onSelectStaticDataset}
                        />
                      </div>
                    )}
                    <div className="usa-radio">
                      <div className="grid-row">
                        <div className="grid-col flex-5">
                          <input
                            className="usa-radio__input"
                            id="csvFileUpload"
                            value="CsvFileUpload"
                            type="radio"
                            name="datasetType"
                            defaultChecked={
                              datasetType === DatasetType.CsvFileUpload
                            }
                            ref={register()}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="csvFileUpload"
                          >
                            Create a new dataset from file
                          </label>
                        </div>
                      </div>
                    </div>
                    {datasetType === DatasetType.CsvFileUpload && (
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
                          (widget.content.datasetType ===
                          DatasetType.CsvFileUpload
                            ? widget.content.fileName ||
                              widget.content.title + ".csv"
                            : "")
                        }`}
                        hint={
                          <span>
                            Must be a CSV file.{" "}
                            <Link
                              to="/admin/formattingcsv"
                              target="_blank"
                              external
                            >
                              How do I format my CSV file?
                            </Link>
                          </span>
                        }
                        onFileProcessed={onFileProcessed}
                      />
                    )}
                  </fieldset>

                  <div hidden={!json.length}>
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
                  for those with visual impairments."
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
                  disabled={
                    !json.length || !title || fileLoading || editingWidget
                  }
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
              <div hidden={!json.length} className="margin-left-4">
                <h4>Preview</h4>
                {datasetLoading ? (
                  <Spinner
                    className="text-center margin-top-6"
                    label="Loading"
                  />
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditTable;
