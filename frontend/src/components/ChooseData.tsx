import React, { useCallback, useState, MouseEvent } from "react";
import { useDateTimeFormatter } from "../hooks";
import { Dataset, DatasetType } from "../models";
import Button from "./Button";
import RadioButtonsTile from "./RadioButtonsTile";
import FileInput from "./FileInput";
import Link from "./Link";
import Table from "./Table";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface Props {
  handleChange: React.FormEventHandler<HTMLFieldSetElement>;
  datasetType: DatasetType | undefined;
  register: Function;
  onCancel: Function;
  backStep: Function;
  advanceStep: Function;
  fileLoading: boolean;
  csvErrors: Array<object> | undefined;
  csvFile: File | undefined;
  staticFileName: string | undefined;
  dynamicFileName: string | undefined;
  onFileProcessed: Function;
  browseDatasets: (event: MouseEvent<HTMLButtonElement>) => void;
  selectDynamicDataset: Function;
  dynamicDatasets: Array<Dataset>;
  hasErrors: boolean;
  widgetType: string;
  setShowNoDatasetTypeAlert: Function;
}

function ChooseData(props: Props) {
  const { t } = useTranslation();
  const dateFormatter = useDateTimeFormatter();
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const onSelect = useCallback(
    (selectedDataset: Array<Dataset>) => {
      if (props.datasetType === DatasetType.DynamicDataset) {
        if (selectedDataset.length) {
          props.selectDynamicDataset(selectedDataset[0]);
          props.setShowNoDatasetTypeAlert(false);
        } else if (props.dynamicFileName) {
          props.setShowNoDatasetTypeAlert(false);
        }
      }
      if (
        props.datasetType === DatasetType.StaticDataset &&
        (props.csvFile || props.staticFileName)
      ) {
        props.setShowNoDatasetTypeAlert(false);
      }
    },
    [props.datasetType]
  );

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onAdvanceStep = () => {
    if (props.hasErrors) {
      props.setShowNoDatasetTypeAlert(true);
    } else {
      props.advanceStep();
    }
  };

  return (
    <>
      <fieldset className="usa-fieldset" onChange={props.handleChange}>
        <legend className="usa-hint grid-col-6">
          <label className="usa-label text-bold">{t("Data")}</label>
          <div className="usa-hint">
            {t("ChooseDataDescription", {
              widgetType: props.widgetType,
            })}{" "}
            <Link to="/admin/apihelp" target="_blank" external>
              {t("HowDoIAddDatasets")}
            </Link>
          </div>
        </legend>

        <div className="grid-row">
          <RadioButtonsTile
            isHorizontally={true}
            register={props.register}
            options={[
              {
                id: "staticDataset",
                value: "StaticDataset",
                name: "datasetType",
                dataTestId: "staticDatasetRadioButton",
                label: t("StaticDataset"),
                description: t("StaticDatasetDescription"),
              },
              {
                id: "dynamicDataset",
                value: "DynamicDataset",
                name: "datasetType",
                dataTestId: "dynamicDatasetRadioButton",
                label: t("DynamicDataset"),
                description: t("DynamicDatasetDescription"),
              },
            ]}
          />
        </div>

        <div
          hidden={props.datasetType !== DatasetType.StaticDataset}
          role="tabpanel"
          tabIndex={0}
          aria-label={t("ChooseStaticDataset")}
        >
          <div className="grid-row">
            <div className="grid-col-6">
              <FileInput
                id="dataset"
                name="dataset"
                label={t("StaticDatasets")}
                accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                loading={props.fileLoading}
                errors={props.csvErrors}
                register={props.register}
                required={props.datasetType === DatasetType.StaticDataset}
                hint={
                  <span>
                    {t("StaticDatasetsHint")}{" "}
                    <Link to="/admin/formatting" target="_blank" external>
                      {t("HowDoIFormatMyCSVFile")}
                    </Link>
                  </span>
                }
                fileName={props.csvFile && props.csvFile.name}
                staticFileName={props.staticFileName}
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
                {t("BrowseDatasets")}
              </Button>
            </div>
          </div>
        </div>

        <div
          hidden={props.datasetType !== DatasetType.DynamicDataset}
          role="tabpanel"
          tabIndex={0}
          aria-label={t("ChooseDynamicDataset")}
        >
          <div className="grid-row margin-top-3 margin-bottom-1">
            <div className="tablet:grid-col-4 padding-top-1px">
              <div role="search" className="usa-search usa-search--small">
                <input
                  className="usa-input"
                  id="search"
                  type="search"
                  name="query"
                  style={{ height: "37px" }}
                  value={query}
                  placeholder={props.dynamicFileName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setQuery(event.target.value)
                  }
                />
                <button
                  className="usa-button usa-button--base padding-x-2"
                  type="button"
                  style={{
                    height: "37px",
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                  }}
                  onClick={() => onSearch(query)}
                >
                  <FontAwesomeIcon
                    style={{ marginTop: "-3px" }}
                    icon={faSearch}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden">
            <Table
              selection="single"
              initialSortByField="updatedAt"
              filterQuery={filter}
              rows={React.useMemo(
                () => props.dynamicDatasets,
                [props.dynamicDatasets]
              )}
              screenReaderField="name"
              width="100%"
              onSelection={onSelect}
              columns={React.useMemo(
                () => [
                  {
                    Header: t("NameUpperCase"),
                    accessor: "fileName",
                  },
                  {
                    Header: t("LastUpdatedLabel"),
                    accessor: "updatedAt",
                    Cell: (props: any) => dateFormatter(props.value),
                  },
                  {
                    Header: t("Description"),
                    accessor: "description",
                  },
                  {
                    Header: t("Tags"),
                    accessor: "tags",
                  },
                ],
                [dateFormatter, t]
              )}
            />
          </div>
        </div>
      </fieldset>
      <br />
      <br />
      <hr />
      <Button variant="outline" type="button" onClick={props.backStep}>
        {t("BackButton")}
      </Button>
      <Button type="button" onClick={onAdvanceStep}>
        {t("ContinueButton")}
      </Button>
      <Button
        variant="unstyled"
        className="text-base-dark hover:text-base-darker active:text-base-darkest"
        type="button"
        onClick={props.onCancel}
      >
        {t("Cancel")}
      </Button>
    </>
  );
}

export default ChooseData;
