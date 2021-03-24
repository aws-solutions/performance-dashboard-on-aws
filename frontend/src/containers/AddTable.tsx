import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { ColumnDataType, LocationState } from "../models";
import { Dataset, DatasetType, WidgetType } from "../models";
import BackendService from "../services/BackendService";
import { useDashboard, useFullPreview } from "../hooks";
import StorageService from "../services/StorageService";
import DatasetParsingService from "../services/DatasetParsingService";
import Breadcrumbs from "../components/Breadcrumbs";
import { parse, ParseResult } from "papaparse";
import { useDatasets } from "../hooks";
import StepIndicator from "../components/StepIndicator";
import ChooseData from "../components/ChooseData";
import CheckData from "../components/CheckData";
import Visualize from "../components/VisualizeTable";

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

  const { dashboardId } = useParams<PathParams>();
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
  const [filteredJson, setFilteredJson] = useState<Array<any>>(currentJson);
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
  const [selectedHeaders, setSelectedHeaders] = useState<Set<string>>(
    new Set<string>()
  );
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
    new Set<string>()
  );
  const [sortByColumn, setSortByColumn] = useState<string | undefined>(
    undefined
  );
  const [sortByDesc, setSortByDesc] = useState<boolean | undefined>(undefined);
  const { fullPreview, fullPreviewButton } = useFullPreview();
  const [dataTypes, setDataTypes] = useState<Map<string, ColumnDataType>>(
    new Map<string, ColumnDataType>()
  );

  useMemo(() => {
    let headers = currentJson.length
      ? (Object.keys(currentJson[0]) as Array<string>)
      : [];
    headers = headers.filter((h) => !hiddenColumns.has(h));
    const newFilteredJson = new Array<any>();
    for (const row of currentJson) {
      const filteredRow = headers.reduce((obj: any, key: any) => {
        obj[key] = row[key];
        return obj;
      }, {});
      if (filteredRow !== {}) {
        newFilteredJson.push(filteredRow);
      }
    }
    setFilteredJson(newFilteredJson);
  }, [currentJson, hiddenColumns]);

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
          sortByColumn,
          sortByDesc,
          columnsMetadata: Array.from(selectedHeaders).map((header) => {
            return {
              columnName: header,
              dataType: dataTypes.has(header)
                ? dataTypes.get(header)
                : undefined,
              hidden: hiddenColumns.has(header),
            };
          }),
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
    setStep(step + 1);
  };

  const backStep = () => {
    setStep(step - 1);
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
                    label: "Check data",
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
            <ChooseData
              selectDynamicDataset={selectDynamicDataset}
              dynamicDatasets={dynamicDatasets}
              datasetType={datasetType}
              onFileProcessed={onFileProcessed}
              handleChange={handleChange}
              advanceStep={advanceStep}
              fileLoading={fileLoading}
              browseDatasets={browseDatasets}
              continueButtonDisabled={!currentJson.length}
              csvErrors={csvErrors}
              csvFile={csvFile}
              onCancel={onCancel}
              register={register}
              widgetType="table"
            />
          </div>

          <div hidden={step !== 1}>
            <CheckData
              data={currentJson}
              advanceStep={advanceStep}
              backStep={backStep}
              selectedHeaders={selectedHeaders}
              setSelectedHeaders={setSelectedHeaders}
              hiddenColumns={hiddenColumns}
              setHiddenColumns={setHiddenColumns}
              onCancel={onCancel}
              register={register}
              setSortByColumn={setSortByColumn}
              setSortByDesc={setSortByDesc}
              dataTypes={dataTypes}
              setDataTypes={setDataTypes}
            />
          </div>

          <div hidden={step !== 2}>
            <Visualize
              errors={errors}
              register={register}
              json={filteredJson}
              csvJson={csvJson}
              datasetLoading={datasetLoading}
              datasetType={datasetType}
              onCancel={onCancel}
              backStep={backStep}
              advanceStep={advanceStep}
              fileLoading={fileLoading}
              processingWidget={creatingWidget}
              fullPreviewButton={fullPreviewButton}
              fullPreview={fullPreview}
              submitButtonLabel="Add Table"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTable;
