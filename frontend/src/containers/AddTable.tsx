import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Dataset, DatasetType, WidgetType } from "../models";
import BackendService from "../services/BackendService";
import { useDashboard, useDateTimeFormatter } from "../hooks";
import StorageService from "../services/StorageService";
import DatasetParsingService from "../services/DatasetParsingService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import { parse, ParseResult } from "papaparse";
import TableWidget from "../components/TableWidget";
import Link from "../components/Link";
import ComboBox from "../components/Combobox";
import { useDatasets } from "../hooks/dataset-hooks";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface FormValues {
  title: string;
  summary: string;
  showTitle: boolean;
  summaryBelow: boolean;
}

interface PathParams {
  dashboardId: string;
}

function AddTable() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const dateFormatter = useDateTimeFormatter();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { dynamicDatasets, staticDatasets } = useDatasets();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [currentJson, setCurrentJson] = useState<Array<any>>([]);
  const [dynamicJson, setDynamicJson] = useState<Array<any>>([]);
  const [staticJson, setStaticJson] = useState<Array<any>>([]);
  const [csvJson, setCsvJson] = useState<Array<any>>([]);
  const [dynamicDataset, setDynamicDataset] = useState<Dataset | undefined>(
    undefined
  );
  const [staticDataset, setStaticDataset] = useState<Dataset | undefined>(
    undefined
  );
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [showTitle, setShowTitle] = useState(true);
  const [summaryBelow, setSummaryBelow] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [creatingWidget, setCreatingWidget] = useState(false);
  const [datasetType, setDatasetType] = useState<DatasetType | undefined>(
    undefined
  );
  const [showAlert, setShowAlert] = useState(true);

  const uploadDataset = async (): Promise<Dataset> => {
    if (!csvFile) {
      throw new Error("CSV file not specified");
    }

    setFileLoading(true);
    const uploadResponse = await StorageService.uploadDataset(
      csvFile,
      JSON.stringify(currentJson)
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
      let newDataset;
      if (csvFile) {
        newDataset = await uploadDataset();
      }

      setCreatingWidget(true);
      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Table,
        values.showTitle,
        {
          title: values.title,
          summary: values.summary,
          summaryBelow: values.summaryBelow,
          datasetType: datasetType,
          datasetId: newDataset
            ? newDataset.id
            : datasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.id
            : staticDataset?.id,
          s3Key: newDataset
            ? newDataset.s3Key
            : datasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.s3Key
            : staticDataset?.s3Key,
          fileName: csvFile
            ? csvFile.name
            : datasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.fileName
            : staticDataset?.fileName,
        }
      );
      setCreatingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" table has been successfully added`,
        },
      });
    } catch (err) {
      console.log("Failed to save content item", err);
      setCreatingWidget(false);
    }
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleChangeTitle = (event: React.FormEvent<HTMLInputElement>) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  const handleSummaryChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setSummary((event.target as HTMLTextAreaElement).value);
  };

  const handleSummaryBelowChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setSummaryBelow((event.target as HTMLInputElement).checked);
  };

  const handleShowTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setShowTitle((event.target as HTMLInputElement).checked);
  };

  const onFileProcessed = (data: File) => {
    if (!data) {
      return;
    }
    setDatasetLoading(true);
    parse(data, {
      header: false,
      dynamicTyping: true,
      skipEmptyLines: true,
      comments: "#",
      encoding: "ISO-8859-1",
      complete: function (results: ParseResult<object>) {
        if (results.errors.length) {
          setCsvErrors(results.errors);
          setCsvJson([]);
          setCurrentJson([]);
        } else {
          setCsvErrors(undefined);
          const csvJson = DatasetParsingService.createHeaderRowJson(
            results.data
          );
          setCsvJson(csvJson);
          setCurrentJson(csvJson);
        }
        setDatasetLoading(false);
      },
    });
    setCsvFile(data);
  };

  const handleChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.name === "datasetType") {
      const datasetType = target.value as DatasetType;
      setDatasetType(datasetType);
      if (datasetType === DatasetType.DynamicDataset) {
        setCurrentJson(dynamicJson);
      }
      if (datasetType === DatasetType.StaticDataset) {
        setCurrentJson(staticJson);
      }
      if (datasetType === DatasetType.CsvFileUpload) {
        setCurrentJson(csvJson);
      }
    }
  };

  const onSelectDynamicDataset = async (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    event.persist();
    setDatasetLoading(true);

    const jsonFile = (event.target as HTMLInputElement).value;
    if (jsonFile) {
      const dataset = await StorageService.downloadJson(jsonFile);
      setDynamicJson(dataset);
      setCurrentJson(dataset);
      setDynamicDataset(dynamicDatasets.find((d) => d.s3Key.json === jsonFile));
    } else {
      setDynamicJson([]);
      setCurrentJson([]);
      setDynamicDataset(undefined);
    }

    setDatasetLoading(false);
    event.stopPropagation();
  };

  const onSelectStaticDataset = async (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    event.persist();
    setDatasetLoading(true);

    const jsonFile = (event.target as HTMLInputElement).value;
    if (jsonFile) {
      const dataset = await StorageService.downloadJson(jsonFile);
      setStaticJson(dataset);
      setCurrentJson(dataset);
      setStaticDataset(staticDatasets.find((d) => d.s3Key.json === jsonFile));
    } else {
      setStaticJson([]);
      setCurrentJson([]);
      setStaticDataset(undefined);
    }

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

  if (!loading) {
    crumbs.push({
      label: "Add table",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Add table</h1>

      <div className="text-base text-italic">Step 2 of 2</div>
      <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
        Configure table
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
                label="Table title"
                hint="Give your table a descriptive title."
                error={errors.title && "Please specify a table title"}
                onChange={handleChangeTitle}
                required
                register={register}
              />

              <div className="usa-checkbox">
                <input
                  className="usa-checkbox__input"
                  id="display-title"
                  type="checkbox"
                  name="showTitle"
                  defaultChecked={true}
                  onChange={handleShowTitleChange}
                  ref={register()}
                />
                <label className="usa-checkbox__label" htmlFor="display-title">
                  Show title on dashboard
                </label>
              </div>

              <label htmlFor="fieldset" className="usa-label text-bold">
                Data
              </label>
              <div className="usa-hint">
                Choose an existing dataset or create a new one to populate this
                table.{" "}
                <Link to="/admin/apihelp" target="_blank" external>
                  How do I add datasets?
                </Link>
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
                <div
                  className="margin-left-4"
                  hidden={datasetType !== DatasetType.DynamicDataset}
                >
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
                        content: `${d.fileName} (${
                          d.s3Key.json
                        }) Last update: ${dateFormatter(d.updatedAt)}`,
                      };
                    })}
                    register={register}
                    onChange={onSelectDynamicDataset}
                  />
                </div>
                <div className="usa-radio">
                  <div className="grid-row">
                    <div className="grid-col flex-5">
                      <input
                        className="usa-radio__input"
                        id="staticDataset"
                        value="StaticDataset"
                        type="radio"
                        name="datasetType"
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
                <div
                  className="margin-left-4"
                  hidden={datasetType !== DatasetType.StaticDataset}
                >
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
                    register={register}
                    onChange={onSelectStaticDataset}
                  />
                </div>
                <div className="usa-radio">
                  <div className="grid-row">
                    <div className="grid-col flex-5">
                      <input
                        className="usa-radio__input"
                        id="csvFileUpload"
                        value="CsvFileUpload"
                        type="radio"
                        name="datasetType"
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
                <div hidden={datasetType !== DatasetType.CsvFileUpload}>
                  <FileInput
                    id="dataset"
                    name="dataset"
                    label="File upload"
                    accept=".csv"
                    loading={fileLoading}
                    errors={csvErrors}
                    register={register}
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
                    fileName={csvFile && csvFile.name}
                    onFileProcessed={onFileProcessed}
                  />
                </div>
              </fieldset>

              <div hidden={!currentJson.length}>
                {currentJson.length &&
                (Object.keys(currentJson[0]) as Array<string>).length >= 8 ? (
                  <div className="usa-alert usa-alert--warning margin-top-3">
                    <div className="usa-alert__body">
                      <p className="usa-alert__text">
                        It is recommended that tables have less than 8 columns.
                        You can still continue.
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <TextField
                  id="summary"
                  name="summary"
                  label="Table summary - optional"
                  hint={
                    <>
                      Give your chart a summary to explain it in more depth. It
                      can also be read by screen readers to describe the chart
                      for those with visual impairments. This field supports
                      markdown.{" "}
                      <Link target="_blank" to={"/admin/markdown"} external>
                        View Markdown Syntax
                      </Link>
                    </>
                  }
                  register={register}
                  onChange={handleSummaryChange}
                  multiline
                  rows={5}
                />
                <div className="usa-checkbox">
                  <input
                    className="usa-checkbox__input"
                    id="summary-below"
                    type="checkbox"
                    name="summaryBelow"
                    defaultChecked={false}
                    onChange={handleSummaryBelowChange}
                    ref={register()}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="summary-below"
                  >
                    Show summary below chart
                  </label>
                </div>
              </div>
            </fieldset>
            <br />
            <hr />
            <Button variant="outline" type="button" onClick={goBack}>
              Back
            </Button>
            <Button
              disabled={
                !currentJson.length || !title || fileLoading || creatingWidget
              }
              type="submit"
            >
              Add table
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
          <div hidden={!currentJson.length} className="margin-left-4">
            <h4>Preview</h4>
            {datasetLoading ? (
              <Spinner className="text-center margin-top-6" label="Loading" />
            ) : (
              <>
                {showAlert && datasetType === DatasetType.CsvFileUpload && (
                  <div className="margin-left-1">
                    <Alert
                      type="info"
                      message={
                        <div className="grid-row margin-left-4">
                          <div className="grid-col-11">
                            Does the chart look correct?{" "}
                            <Link
                              to="/admin/formattingcsv"
                              target="_blank"
                              external
                            >
                              Learn how to format your CSV data.
                            </Link>
                          </div>
                          <div className="grid-col-1">
                            <div className="margin-left-4">
                              <Button
                                variant="unstyled"
                                className="margin-0-important text-base-dark hover:text-base-darker active:text-base-darkest"
                                onClick={() => setShowAlert(false)}
                                type="button"
                                ariaLabel="Close"
                              >
                                <FontAwesomeIcon icon={faTimes} size="sm" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      }
                      slim
                    />
                  </div>
                )}
                <TablePreview
                  title={showTitle ? title : ""}
                  summary={summary}
                  summaryBelow={summaryBelow}
                  headers={
                    currentJson.length
                      ? (Object.keys(currentJson[0]) as Array<string>)
                      : []
                  }
                  data={currentJson}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTable;
