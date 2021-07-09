import React, { useCallback, useState } from "react";
import { useDateTimeFormatter } from "../hooks";
import { Dataset, DatasetType } from "../models";
import Button from "./Button";
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
  advanceStep: Function;
  fileLoading: boolean;
  csvErrors: Array<object> | undefined;
  csvFile: File | undefined;
  onFileProcessed: Function;
  browseDatasets: Function;
  selectDynamicDataset: Function;
  dynamicDatasets: Array<Dataset>;
  continueButtonDisabled: boolean;
  continueButtonDisabledTooltip?: string;
  widgetType: string;
}

function ChooseData(props: Props) {
  const { t } = useTranslation();
  const dateFormatter = useDateTimeFormatter();
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");

  const onSelect = useCallback(
    (selectedDataset: Array<Dataset>) => {
      if (props.datasetType === DatasetType.DynamicDataset) {
        props.selectDynamicDataset(selectedDataset[0]);
      }
    },
    [props]
  );

  const onSearch = (query: string) => {
    setFilter(query);
  };

  return (
    <>
      <div className="grid-col-6">
        <label htmlFor="fieldset" className="usa-label text-bold">
          {t("Data")}
        </label>
        <div className="usa-hint">
          {t("ChooseDataDescription", {
            widgetType: props.widgetType,
          })}{" "}
          <Link to="/admin/apihelp" target="_blank" external>
            {t("HowDoIAddDatasets")}
          </Link>
        </div>
      </div>
      <fieldset
        id="fieldset"
        className="usa-fieldset"
        onChange={props.handleChange}
      >
        <legend className="usa-sr-only">{t("ContentItemTypesLabel")}</legend>
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
                    {t("StaticDataset")}
                  </label>
                </div>
                <div className="grid-col flex-7">
                  <div className="usa-prose text-base margin-left-4">
                    {t("StaticDatasetDescription")}
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
                    {t("DynamicDataset")}
                  </label>
                </div>
                <div className="grid-col flex-7">
                  <div className="usa-prose text-base margin-left-4">
                    {t("DynamicDatasetDescription")}
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
                label={t("StaticDatasets")}
                accept=".csv"
                loading={props.fileLoading}
                errors={props.csvErrors}
                register={props.register}
                hint={
                  <span>
                    {t("StaticDatasetsHint")}{" "}
                    <Link to="/admin/formattingcsv" target="_blank" external>
                      {t("HowDoIFormatMyCSVFile")}
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
                {t("BrowseDatasets")}
              </Button>
            </div>
          </div>
        </div>

        <div hidden={props.datasetType !== DatasetType.DynamicDataset}>
          <div className="grid-row margin-top-3 margin-bottom-1">
            <div className="tablet:grid-col-4 padding-top-1px">
              <div role="search" className="usa-search usa-search--small">
                <label className="usa-sr-only" htmlFor="search">
                  {t("SearchButton")}
                </label>
                <input
                  className="usa-input"
                  id="search"
                  type="search"
                  name="query"
                  style={{ height: "37px" }}
                  value={query}
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
                  <span className="usa-sr-only">{t("SearchButton")}</span>
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
      <Button
        type="button"
        onClick={props.advanceStep}
        disabled={props.continueButtonDisabled}
        disabledToolTip={
          props.datasetType === DatasetType.DynamicDataset
            ? t("DynamicDatasetContinue")
            : props.datasetType === DatasetType.StaticDataset
            ? t("StaticDatasetContinue")
            : props.continueButtonDisabledTooltip
        }
      >
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
