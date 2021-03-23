import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Dataset, DatasetType, LocationState } from "../models";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";
import DatasetParsingService from "../services/DatasetParsingService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import { parse, ParseResult } from "papaparse";
import TableWidget from "../components/TableWidget";
import {
  useWidget,
  useDashboard,
  useDateTimeFormatter,
  useFullPreview,
} from "../hooks";
import Spinner from "../components/Spinner";
import Link from "../components/Link";
import { useDatasets, useSettings } from "../hooks";
import Table from "../components/Table";
import UtilsService from "../services/UtilsService";
import "./EditTable.css";

interface FormValues {
  title: string;
  summary: string;
  showTitle: boolean;
  dynamicDatasets: string;
  staticDatasets: string;
  summaryBelow: boolean;
  datasetType: string;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditTable() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { dashboardId, widgetId } = useParams<PathParams>();
  const dateFormatter = useDateTimeFormatter();
  const { settings } = useSettings();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { dynamicDatasets, staticDatasets, loadingDatasets } = useDatasets();
  const {
    register,
    errors,
    handleSubmit,
    getValues,
    reset,
  } = useForm<FormValues>();
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
  const [fileLoading, setFileLoading] = useState(false);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [editingWidget, setEditingWidget] = useState(false);
  const [step, setStep] = useState<number>(1);
  const {
    widget,
    datasetType,
    currentJson,
    dynamicJson,
    staticJson,
    csvJson,
    setCurrentJson,
    setDynamicJson,
    setCsvJson,
  } = useWidget(dashboardId, widgetId);
  const {
    fullPreview,
    fullPreviewToggle,
    fullPreviewButton,
  } = useFullPreview();

  const [title, setTitle] = useState("");
  const [showTitle, setShowTitle] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryBelow, setSummaryBelow] = useState(false);

  const [displayedJson, setDisplayedJson] = useState<Array<any>>([]);
  const [displayedDatasetType, setDisplayedDatasetType] = useState<
    DatasetType | undefined
  >();

  const dynamicDatasetsTableCols = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "fileName",
        Cell: (props: any) => {
          return (
            <div className="tooltip">
              {props.value}
              <span className="tooltiptext">Tooltip text</span>
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
                  <span className="tooltiptext">{props.value}</span>
                </div>
              );
            } else {
              return (
                <div className="tooltip">
                  {props.value}
                  <span className="tooltiptext">{props.value}</span>
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
  );

  const dynamicDatasetsTableRows = React.useMemo(() => dynamicDatasets, [
    dynamicDatasets,
  ]);

  useEffect(() => {
    if (
      widget &&
      dynamicDatasets &&
      staticDatasets &&
      currentJson &&
      datasetType
    ) {
      const title = widget.content.title;
      const showTitle = widget.showTitle;
      const summary = widget.content.summary;
      const summaryBelow = widget.content.summaryBelow;

      reset({
        title,
        showTitle,
        datasetType: displayedDatasetType
          ? displayedDatasetType
          : state && state.json
          ? DatasetType.StaticDataset
          : datasetType,
        summary,
        summaryBelow,
        dynamicDatasets:
          widget.content.datasetType === DatasetType.DynamicDataset
            ? widget.content.s3Key.json
            : "",
        staticDatasets:
          widget.content.datasetType === DatasetType.StaticDataset
            ? widget.content.s3Key.json
            : "",
      });

      if (!displayedDatasetType) {
        setDisplayedDatasetType(
          state && state.json ? DatasetType.StaticDataset : datasetType
        );
      }

      if (!displayedJson.length) {
        setDisplayedJson(state && state.json ? state.json : currentJson);
      }

      setTitle(title);
      setShowTitle(showTitle);
      setSummary(summary);
      setSummaryBelow(summaryBelow);

      if (!dynamicDataset) {
        setDynamicDataset(
          dynamicDatasets.find(
            (d) => d.s3Key.json === widget.content.s3Key.json
          )
        );
      }
      if (!staticDataset) {
        setStaticDataset(
          staticDatasets.find((d) => d.s3Key.json === widget.content.s3Key.json)
        );
      }
    }
  }, [
    widget,
    dynamicDatasets,
    staticDatasets,
    reset,
    state,
    currentJson,
    displayedJson,
    datasetType,
  ]);

  const onFileProcessed = useCallback(
    async (data: File) => {
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
    },
    [setCurrentJson, setCsvJson]
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
        values.showTitle,
        {
          title: values.title,
          summary: values.summary,
          summaryBelow: values.summaryBelow,
          datasetType: displayedDatasetType,
          datasetId: newDataset
            ? newDataset.id
            : displayedDatasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.id
            : staticDataset?.id,
          s3Key: newDataset
            ? newDataset.s3Key
            : displayedDatasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.s3Key
            : staticDataset?.s3Key,
          fileName: csvFile
            ? csvFile.name
            : displayedDatasetType === DatasetType.DynamicDataset
            ? dynamicDataset?.fileName
            : staticDataset?.fileName,
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

  const handleChange = async (event: React.FormEvent<HTMLFieldSetElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.name === "datasetType") {
      setDatasetLoading(true);
      const datasetType = target.value as DatasetType;
      setDisplayedDatasetType(datasetType);
      await UtilsService.timeout(0);
      if (datasetType === DatasetType.DynamicDataset) {
        setDisplayedJson(dynamicJson);
      }
      if (datasetType === DatasetType.StaticDataset) {
        setDisplayedJson(staticJson);
      }
      if (datasetType === DatasetType.CsvFileUpload) {
        setDisplayedJson(csvJson);
      }
      setDatasetLoading(false);
    }
  };

  const onFormChange = () => {
    const { title, showTitle, summary, summaryBelow } = getValues();
    setTitle(title);
    setShowTitle(showTitle);
    setSummary(summary);
    setSummaryBelow(summaryBelow);
  };

  const advanceStep = () => {
    setStep(1);
  };

  const backStep = () => {
    setStep(0);
  };

  const browseDatasets = () => {
    history.push({
      pathname: `/admin/dashboard/${dashboardId}/choose-static-dataset`,
      state: {
        redirectUrl: `/admin/dashboard/${dashboardId}/edit-table/${widgetId}`,
        crumbLabel: "Edit table",
      },
    });
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
      setDynamicDataset(dynamicDatasets.find((d) => d.s3Key.json === jsonFile));
      setDynamicJson(dataset);
      setDisplayedJson(dataset);
    } else {
      setDynamicDataset(undefined);
      setDynamicJson([]);
      setDisplayedJson([]);
    }

    setDatasetLoading(false);
  };

  const onSelect = useCallback(
    (selectedDataset: Array<Dataset>) => {
      if (displayedDatasetType === DatasetType.DynamicDataset) {
        selectDynamicDataset(selectedDataset[0]);
      }
    },
    [displayedDatasetType]
  );

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

  const tableHeaders = useMemo(() => {
    return currentJson.length > 0
      ? (Object.keys(currentJson[0]) as Array<string>)
      : [];
  }, [currentJson]);

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1 hidden={fullPreview}>Edit table</h1>

      {loading ||
      loadingDatasets ||
      !widget ||
      !displayedDatasetType ||
      !displayedJson ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <div className="grid-row width-desktop">
            <form onChange={onFormChange} onSubmit={handleSubmit(onSubmit)}>
              <div className="grid-col-12">
                <div className="grid-col-6" hidden={fullPreview}>
                  <ul className="usa-button-group usa-button-group--segmented">
                    <li className="usa-button-group__item">
                      <button
                        className={
                          step === 1
                            ? "usa-button usa-button--outline"
                            : "usa-button"
                        }
                        type="button"
                        onClick={backStep}
                      >
                        Choose data
                      </button>
                    </li>
                    <li className="usa-button-group__item">
                      <button
                        className={
                          step === 0
                            ? "usa-button usa-button--outline"
                            : "usa-button"
                        }
                        type="button"
                        onClick={advanceStep}
                      >
                        Visualize
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div hidden={step !== 0}>
                <div className="grid-col-6">
                  <label htmlFor="fieldset" className="usa-label text-bold">
                    Data
                  </label>
                  <div className="usa-hint">
                    Choose an existing dataset or create a new one to populate
                    this table
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
                            displayedDatasetType === "StaticDataset"
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
                              Upload a new dataset from file or elect an
                              existing dataset.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid-col-4 padding-left-2">
                      <div className="usa-radio">
                        <div
                          className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                            displayedDatasetType === "DynamicDataset"
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
                              Choose from a list of continuously updated
                              datasets.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    hidden={displayedDatasetType !== DatasetType.StaticDataset}
                  >
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

                  <div
                    hidden={displayedDatasetType !== DatasetType.DynamicDataset}
                  >
                    <div className="overflow-hidden">
                      <Table
                        selection="single"
                        initialSortByField="updatedAt"
                        filterQuery={""}
                        rows={dynamicDatasetsTableRows}
                        screenReaderField="name"
                        width="100%"
                        onSelection={onSelect}
                        columns={dynamicDatasetsTableCols}
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
                  disabled={!displayedJson.length}
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
                    <fieldset className="usa-fieldset">
                      <TextField
                        id="title"
                        name="title"
                        label="Table title"
                        hint="Give your table a descriptive title."
                        error={errors.title && "Please specify a table title"}
                        defaultValue={title}
                        required
                        register={register}
                      />

                      <div className="usa-checkbox">
                        <input
                          className="usa-checkbox__input"
                          id="display-title"
                          type="checkbox"
                          name="showTitle"
                          defaultChecked={showTitle}
                          ref={register()}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="display-title"
                        >
                          Show title on dashboard
                        </label>
                      </div>

                      {widget ? (
                        <div>
                          <TextField
                            id="summary"
                            name="summary"
                            label="Table summary - optional"
                            hint={
                              <>
                                Give your table a summary to explain it in more
                                depth. This field supports markdown.
                                <Link
                                  target="_blank"
                                  to={"/admin/markdown"}
                                  external
                                >
                                  View Markdown Syntax
                                </Link>
                              </>
                            }
                            register={register}
                            defaultValue={summary}
                            multiline
                            rows={5}
                          />
                          <div className="usa-checkbox">
                            <input
                              className="usa-checkbox__input"
                              id="summary-below"
                              type="checkbox"
                              name="summaryBelow"
                              defaultChecked={summaryBelow}
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
                      ) : (
                        ""
                      )}
                    </fieldset>
                  </div>
                  <div className={fullPreview ? "grid-col-12" : "grid-col-7"}>
                    <div className="margin-left-4">
                      {fullPreviewButton}
                      <h4>Preview</h4>
                      {datasetLoading ? (
                        <Spinner
                          className="text-center margin-top-6"
                          label="Loading"
                        />
                      ) : (
                        <>
                          <TableWidget
                            title={showTitle ? title : ""}
                            summary={summary}
                            headers={tableHeaders}
                            summaryBelow={summaryBelow}
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
                    !displayedJson.length ||
                    !title ||
                    fileLoading ||
                    editingWidget
                  }
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
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default EditTable;
