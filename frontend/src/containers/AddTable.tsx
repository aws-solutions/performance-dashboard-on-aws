import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { LocationState } from "../models";
import { Dataset, DatasetType, WidgetType } from "../models";
import BackendService from "../services/BackendService";
import {
  useDashboard,
  useDateTimeFormatter,
  useSettings,
  useFullPreview,
} from "../hooks";
import StorageService from "../services/StorageService";
import DatasetParsingService from "../services/DatasetParsingService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import { parse, ParseResult } from "papaparse";
import TableWidget from "../components/TableWidget";
import Link from "../components/Link";
import { useDatasets } from "../hooks";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StepIndicator from "../components/StepIndicator";
import Table from "../components/Table";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface FormValues {
  title: string;
  summary: string;
  showTitle: boolean;
  summaryBelow: boolean;
  datasetType: string;
}

interface PathParams {
  dashboardId: string;
}

function AddTable() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { settings } = useSettings();

  const { dashboardId } = useParams<PathParams>();
  const dateFormatter = useDateTimeFormatter();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { dynamicDatasets } = useDatasets();
  const { register, errors, handleSubmit, reset } = useForm<FormValues>();
  const [currentJson, setCurrentJson] = useState<Array<any>>(
    state && state.json ? state.json : []
  );
  const [dynamicJson, setDynamicJson] = useState<Array<any>>([]);
  const [staticJson] = useState<Array<any>>(
    state && state.json ? state.json : []
  );
  const [csvJson, setCsvJson] = useState<Array<any>>([]);
  const [dynamicDataset, setDynamicDataset] = useState<Dataset | undefined>(
    undefined
  );
  const [staticDataset] = useState<Dataset | undefined>(
    state && state.staticDataset ? state.staticDataset : undefined
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
    state && state.json ? DatasetType.StaticDataset : undefined
  );
  const [showAlert, setShowAlert] = useState(true);
  const [step, setStep] = useState<number>(state && state.json ? 1 : 0);
  const {
    fullPreview,
    fullPreviewToggle,
    fullPreviewButton,
  } = useFullPreview();

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

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const advanceStep = () => {
    setStep(1);
  };

  const backStep = () => {
    setStep(0);
  };

  const selectDynamicDataset = async (selectedDataset: Dataset) => {
    setDatasetLoading(true);

    if (
      selectedDataset &&
      selectedDataset.s3Key &&
      selectedDataset.s3Key.json
    ) {
      const jsonFile = selectedDataset.s3Key.json;

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
  };

  const onSelect = useCallback(
    (selectedDataset: Array<Dataset>) => {
      if (datasetType === DatasetType.DynamicDataset) {
        selectDynamicDataset(selectedDataset[0]);
      }
    },
    [datasetType]
  );

  const browseDatasets = () => {
    history.push({
      pathname: `/admin/dashboard/${dashboardId}/choose-static-dataset`,
      state: {
        redirectUrl: `/admin/dashboard/${dashboardId}/add-table/`,
        crumbLabel: "Add table",
      },
    });
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

  useEffect(() => {
    if (datasetType) {
      reset({
        datasetType,
      });
    }
  }, []);

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
      <h1 hidden={fullPreview}>Add table</h1>

      <div className="grid-row width-desktop">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid-col-12">
            <div className="grid-col-6" hidden={fullPreview}>
              <StepIndicator
                current={step}
                segments={[
                  {
                    label: "Choose data",
                  },
                  {
                    label: "Visualize",
                  },
                ]}
                showStepChart={true}
                showStepText={false}
              />
            </div>
          </div>

          <div hidden={step !== 0}>
            <div className="grid-col-6">
              <label htmlFor="fieldset" className="usa-label text-bold">
                Data
              </label>
              <div className="usa-hint">
                Choose an existing dataset or create a new one to populate this
                table.
                <Link to="/admin/apihelp" target="_blank" external>
                  How do I add datasets?
                </Link>
              </div>
            </div>
            <fieldset
              id="fieldset"
              className="usa-fieldset"
              onChange={handleChange}
            >
              <legend className="usa-sr-only">Content item types</legend>

              <div className="grid-row">
                <div className="grid-col-4 padding-right-2">
                  <div className="usa-radio">
                    <div
                      className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                        datasetType === "StaticDataset"
                          ? " bg-base-lightest"
                          : "-lighter"
                      } border-2px padding-2 margin-y-1`}
                    >
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
                          Static dataset
                        </label>
                      </div>
                      <div className="grid-col flex-7">
                        <div className="usa-prose text-base margin-left-4">
                          Upload a new dataset from file or elect an existing
                          dataset.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-col-4 padding-left-2">
                  <div className="usa-radio">
                    <div
                      className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                        datasetType === "DynamicDataset"
                          ? " bg-base-lightest"
                          : "-lighter"
                      } border-2px padding-2 margin-y-1`}
                    >
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
                          Dynamic dataset
                        </label>
                      </div>
                      <div className="grid-col flex-7">
                        <div className="usa-prose text-base margin-left-4">
                          Choose from a list of continuously updated datasets.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div hidden={datasetType !== DatasetType.StaticDataset}>
                <div className="grid-row">
                  <div className="grid-col-5">
                    <FileInput
                      id="dataset"
                      name="dataset"
                      label="Static datasets"
                      accept=".csv"
                      loading={fileLoading}
                      errors={csvErrors}
                      register={register}
                      hint={
                        <span>
                          Upload a dataset from a CSV file, or choose an
                          existing static dataset.{" "}
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
                  <div className="grid-col-3 padding-left-3">
                    <Button
                      variant="outline"
                      type="button"
                      className="datasetsButton"
                      onClick={browseDatasets}
                    >
                      Browse datasets
                    </Button>
                  </div>
                </div>
              </div>

              <div hidden={datasetType !== DatasetType.DynamicDataset}>
                <div className="overflow-hidden">
                  <Table
                    selection="single"
                    initialSortByField="updatedAt"
                    filterQuery={""}
                    rows={React.useMemo(() => dynamicDatasets, [
                      dynamicDatasets,
                    ])}
                    screenReaderField="name"
                    width="100%"
                    onSelection={onSelect}
                    columns={React.useMemo(
                      () => [
                        {
                          Header: "Name",
                          accessor: "fileName",
                          Cell: (props: any) => {
                            return (
                              <div className="tooltip">
                                {props.value}
                                <span className="tooltiptext">
                                  Tooltip text
                                </span>
                              </div>
                            );
                          },
                        },
                        {
                          Header: "Last updated",
                          accessor: "updatedAt",
                        },
                        {
                          Header: "Description",
                          accessor: "description",
                          Cell: (props: any) => {
                            if (props.value) {
                              if (props.value.length > 11) {
                                return (
                                  <div className="tooltip">
                                    {props.value.substring(0, 11) + "..."}
                                    <span className="tooltiptext">
                                      {props.value}
                                    </span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="tooltip">
                                    {props.value}
                                    <span className="tooltiptext">
                                      {props.value}
                                    </span>
                                  </div>
                                );
                              }
                            }

                            return "";
                          },
                        },
                        {
                          Header: "Tags",
                          accessor: "tags",
                        },
                      ],
                      [dateFormatter, settings]
                    )}
                  />
                </div>
              </div>
            </fieldset>
            <br />
            <br />
            <hr />
            <Button
              type="button"
              onClick={advanceStep}
              disabled={!currentJson.length}
            >
              Continue
            </Button>
            <Button
              variant="unstyled"
              className="text-base-dark hover:text-base-darker active:text-base-darkest"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>

          <div hidden={step !== 1}>
            <div className="grid-row width-desktop">
              <div className="grid-col-5" hidden={fullPreview}>
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
                  <label
                    className="usa-checkbox__label"
                    htmlFor="display-title"
                  >
                    Show title on dashboard
                  </label>
                </div>

                <TextField
                  id="summary"
                  name="summary"
                  label="Table summary - optional"
                  hint={
                    <>
                      Give your table a summary to explain it in more depth.
                      This field supports markdown.
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
                    Show summary below table
                  </label>
                </div>
              </div>

              <div className={fullPreview ? "grid-col-12" : "grid-col-7"}>
                <div hidden={!currentJson.length} className="margin-left-4">
                  {fullPreviewButton}
                  <h4>Preview</h4>
                  {datasetLoading ? (
                    <Spinner
                      className="text-center margin-top-6"
                      label="Loading"
                    />
                  ) : (
                    <>
                      {showAlert &&
                      datasetType === DatasetType.StaticDataset &&
                      csvJson.length ? (
                        <div className="margin-left-1">
                          <Alert
                            type="info"
                            message={
                              <div className="grid-row margin-left-4">
                                <div className="grid-col-11">
                                  Does the table look correct?
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
                                      <FontAwesomeIcon
                                        icon={faTimes}
                                        size="sm"
                                      />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            }
                            slim
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <TableWidget
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
            <br />
            <br />
            <hr />
            <Button variant="outline" type="button" onClick={backStep}>
              Back
            </Button>
            <Button
              onClick={advanceStep}
              type="submit"
              disabled={
                !currentJson.length || !title || fileLoading || creatingWidget
              }
            >
              Add Table
            </Button>
            <Button
              variant="unstyled"
              className="text-base-dark hover:text-base-darker active:text-base-darkest"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTable;
