import React, { useCallback } from "react";
import { useDateTimeFormatter, useSettings } from "../hooks";
import { Dataset, DatasetType } from "../models";
import Button from "./Button";
import FileInput from "./FileInput";
import Link from "./Link";
import Table from "./Table";

interface Props {
  handleChange: React.FormEventHandler<HTMLFieldSetElement>;
  datasetType: DatasetType | undefined;
  register: Function;
  onCancel: Function;
  advanceStep: Function;
  fileLoading: boolean;
  csvErrors: Array<object> | undefined;
  csvFile: File | undefined;
  onFileProcessed: Function;
  browseDatasets: Function;
  selectDynamicDataset: Function;
  dynamicDatasets: Array<Dataset>;
  continueButtonDisabled: boolean;
  widgetType?: "chart" | "table";
}

function ChooseData(props: Props) {
  const dateFormatter = useDateTimeFormatter();
  const { settings } = useSettings();

  const onSelect = useCallback(
    (selectedDataset: Array<Dataset>) => {
      if (props.datasetType === DatasetType.DynamicDataset) {
        props.selectDynamicDataset(selectedDataset[0]);
      }
    },
    [props.datasetType]
  );

  return (
    <>
      <div className="grid-col-6">
        <label htmlFor="fieldset" className="usa-label text-bold">
          Data
        </label>
        <div className="usa-hint">
          {`Choose an existing dataset or create a new one to populate this ${
            props.widgetType || "chart"
          }. `}
          <Link to="/admin/apihelp" target="_blank" external>
            How do I add datasets?
          </Link>
        </div>
      </div>
      <fieldset
        id="fieldset"
        className="usa-fieldset"
        onChange={props.handleChange}
      >
        <legend className="usa-sr-only">Content item types</legend>

        <div className="grid-row">
          <div className="grid-col-4 padding-right-2">
            <div className="usa-radio">
              <div
                className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                  props.datasetType === DatasetType.StaticDataset
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
                    ref={props.register()}
                  />
                  <label className="usa-radio__label" htmlFor="staticDataset">
                    Static dataset
                  </label>
                </div>
                <div className="grid-col flex-7">
                  <div className="usa-prose text-base margin-left-4">
                    Upload a new dataset from file or elect an existing dataset.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-col-4 padding-left-2">
            <div className="usa-radio">
              <div
                className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                  props.datasetType === DatasetType.DynamicDataset
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
                    ref={props.register()}
                  />
                  <label className="usa-radio__label" htmlFor="dynamicDataset">
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

        <div hidden={props.datasetType !== DatasetType.StaticDataset}>
          <div className="grid-row">
            <div className="grid-col-5">
              <FileInput
                id="dataset"
                name="dataset"
                label="Static datasets"
                accept=".csv"
                loading={props.fileLoading}
                errors={props.csvErrors}
                register={props.register}
                hint={
                  <span>
                    Upload a dataset from a CSV file, or choose an existing
                    static dataset.{" "}
                    <Link to="/admin/formattingcsv" target="_blank" external>
                      How do I format my CSV file?
                    </Link>
                  </span>
                }
                fileName={props.csvFile && props.csvFile.name}
                onFileProcessed={props.onFileProcessed}
              />
            </div>
            <div className="grid-col-3 padding-left-3">
              <Button
                variant="outline"
                type="button"
                className="datasetsButton"
                onClick={props.browseDatasets}
              >
                Browse datasets
              </Button>
            </div>
          </div>
        </div>

        <div hidden={props.datasetType !== DatasetType.DynamicDataset}>
          <div className="overflow-hidden">
            <Table
              selection="single"
              initialSortByField="updatedAt"
              filterQuery={""}
              rows={React.useMemo(() => props.dynamicDatasets, [
                props.dynamicDatasets,
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
        onClick={props.advanceStep}
        disabled={props.continueButtonDisabled}
      >
        Continue
      </Button>
      <Button
        variant="unstyled"
        className="text-base-dark hover:text-base-darker active:text-base-darkest"
        type="button"
        onClick={props.onCancel}
      >
        Cancel
      </Button>
    </>
  );
}

export default ChooseData;
