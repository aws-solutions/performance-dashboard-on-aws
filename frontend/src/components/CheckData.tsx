import React, { useMemo, useState } from "react";
import { ColumnDataType, CurrencyDataType, NumberDataType } from "../models";
import ColumnsMetadataService from "../services/ColumnsMetadataService";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Table from "./Table";
interface Props {
  selectedHeaders: Set<string>;
  hiddenColumns: Set<string>;
  setSelectedHeaders: Function;
  setHiddenColumns: Function;
  backStep: Function;
  advanceStep: Function;
  onCancel: Function;
  data: Array<any>;
  dataTypes: Map<string, ColumnDataType>;
  setDataTypes: Function;
  numberTypes: Map<string, NumberDataType>;
  setNumberTypes: Function;
  currencyTypes: Map<string, CurrencyDataType>;
  setCurrencyTypes: Function;
  sortByColumn?: string;
  sortByDesc?: boolean;
  setSortByColumn?: Function;
  setSortByDesc?: Function;
  reset?: Function;
}

function CheckData(props: Props) {
  const [dataType, setDataType] = useState<string>("");
  const [numberType, setNumberType] = useState<string>("");
  const [currencyType, setCurrencyType] = useState<string>("");

  const handleSelectedHeadersChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement;
    const newSelectedHeaders = new Set(props.selectedHeaders);
    if (target.checked) {
      newSelectedHeaders.add(target.name);
    } else {
      newSelectedHeaders.delete(target.name);
    }
    if (newSelectedHeaders.size === 1) {
      const selectedHeader = Array.from(newSelectedHeaders)[0];
      if (props.dataTypes.has(selectedHeader)) {
        setDataType(props.dataTypes.get(selectedHeader) || "");
        if (
          props.dataTypes.get(selectedHeader) === ColumnDataType.Number &&
          props.numberTypes.has(selectedHeader)
        ) {
          setNumberType(props.numberTypes.get(selectedHeader) || "");
          if (
            props.numberTypes.get(selectedHeader) === NumberDataType.Currency &&
            props.currencyTypes.has(selectedHeader)
          ) {
            setCurrencyType(props.currencyTypes.get(selectedHeader) || "");
          } else {
            setCurrencyType("");
          }
        } else {
          setNumberType("");
        }
      } else {
        setDataType("");
      }
    } else {
      setDataType("");
      setNumberType("");
      setCurrencyType("");
    }
    props.setSelectedHeaders(newSelectedHeaders);
  };

  const handleHideFromVisualizationChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement;
    const newHiddenColumns = new Set(props.hiddenColumns);
    if (target.checked) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newHiddenColumns.add(selectedHeader);
      }
    } else {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newHiddenColumns.delete(selectedHeader);
      }
    }
    props.setHiddenColumns(newHiddenColumns);
  };

  const handleDataTypeChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const newDataTypes = new Map(props.dataTypes);
    setDataType(target.value);
    setNumberType("");
    setCurrencyType("");
    if (target.value === ColumnDataType.Text) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newDataTypes.set(selectedHeader, ColumnDataType.Text);
      }
    } else if (target.value === ColumnDataType.Number) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newDataTypes.set(selectedHeader, ColumnDataType.Number);
      }
    } else if (target.value === ColumnDataType.Date) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newDataTypes.set(selectedHeader, ColumnDataType.Date);
      }
    } else {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newDataTypes.delete(selectedHeader);
      }
    }
    props.setDataTypes(newDataTypes);
  };

  const handleNumberTypeChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const newNumberTypes = new Map(props.numberTypes);
    setNumberType(target.value);
    setCurrencyType("");
    if (target.value === NumberDataType.Percentage) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newNumberTypes.set(selectedHeader, NumberDataType.Percentage);
      }
    } else if (target.value === NumberDataType.Currency) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newNumberTypes.set(selectedHeader, NumberDataType.Currency);
      }
    } else if (target.value === NumberDataType["With thousands separators"]) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newNumberTypes.set(
          selectedHeader,
          NumberDataType["With thousands separators"]
        );
      }
    } else {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newNumberTypes.delete(selectedHeader);
      }
    }
    props.setNumberTypes(newNumberTypes);
  };

  const handleCurrencyTypeChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement;
    const newCurrencyTypes = new Map(props.currencyTypes);
    setCurrencyType(target.value);
    if (target.value === CurrencyDataType["Dollar $"]) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newCurrencyTypes.set(selectedHeader, CurrencyDataType["Dollar $"]);
      }
    } else if (target.value === CurrencyDataType["Euro €"]) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newCurrencyTypes.set(selectedHeader, CurrencyDataType["Euro €"]);
      }
    } else if (target.value === CurrencyDataType["Pound £"]) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newCurrencyTypes.set(selectedHeader, CurrencyDataType["Pound £"]);
      }
    } else {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newCurrencyTypes.delete(selectedHeader);
      }
    }
    props.setCurrencyTypes(newCurrencyTypes);
  };

  const checkDataTableRows = useMemo(() => props.data || [], [props.data]);
  const checkDataTableColumns = useMemo(
    () =>
      (props.data.length
        ? (Object.keys(props.data[0]) as Array<string>)
        : []
      ).map((header, i) => {
        return {
          Header: () => (
            <span className="text-center usa-checkbox margin-bottom-1">
              <input
                className="usa-checkbox__input"
                id={`checkbox-header-${i}`}
                type="checkbox"
                name={header}
                defaultChecked={props.selectedHeaders.has(header)}
                onChange={handleSelectedHeadersChange}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`checkbox-header-${i}`}
              ></label>
            </span>
          ),
          id: `checkbox${header}`,
          columns: [
            {
              Header: header,
              id: header,
              accessor: header,
              minWidth: 150,
              Cell: (properties: any) => {
                const row = properties.row.original;
                if (props.dataTypes.has(header)) {
                  if (props.dataTypes.get(header) === ColumnDataType.Number) {
                    return typeof row[header] === "number" ? (
                      ColumnsMetadataService.formatNumber(
                        row[header],
                        props.numberTypes.get(header),
                        props.currencyTypes.get(header)
                      )
                    ) : (
                      <div className="text-secondary-vivid">{`! ${
                        row[header] ? row[header].toLocaleString() : "None"
                      }`}</div>
                    );
                  } else if (
                    props.dataTypes.get(header) === ColumnDataType.Date
                  ) {
                    return !isNaN(Date.parse(row[header])) ? (
                      row[header].toLocaleString()
                    ) : (
                      <div className="text-secondary-vivid">{`! ${
                        row[header] ? row[header].toLocaleString() : "None"
                      }`}</div>
                    );
                  } else {
                    return row[header] ? row[header].toLocaleString() : "None";
                  }
                } else {
                  return row[header] ? row[header].toLocaleString() : "None";
                }
              },
            },
          ],
        };
      }),
    [
      props.data,
      props.selectedHeaders,
      props.dataTypes,
      props.numberTypes,
      props.currencyTypes,
    ]
  );

  return (
    <>
      <div className="grid-col-6 margin-top-3 margin-bottom-1">
        Please make sure that the system formats your data correctly. Select
        columns to format as numbers, dates, or text. Also select columns to
        hide or show from the chart.
      </div>

      <div className="grid-row width-desktop">
        {props.selectedHeaders.size ? (
          <div className="grid-col-3 margin-top-3">
            <div className="font-sans-md text-bold">
              {`Edit column${
                props.selectedHeaders.size > 1 ? "s" : ""
              } "${Array.from(props.selectedHeaders).join(", ")}"`}
            </div>
            <div className="usa-checkbox margin-top-3 margin-bottom-1">
              <input
                className="usa-checkbox__input"
                id="hideFromVisualization"
                type="checkbox"
                name="hideFromVisualization"
                checked={Array.from(props.selectedHeaders).every((s) =>
                  props.hiddenColumns.has(s)
                )}
                onChange={handleHideFromVisualizationChange}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="hideFromVisualization"
              >
                Hide from visualization
              </label>
            </div>
            {props.selectedHeaders.size === 1 && (
              <div className="margin-top-3 margin-right-3">
                <Dropdown
                  id="dataType"
                  name="dataType"
                  label="Data format"
                  options={[
                    { value: "", label: "Select an option" },
                    { value: ColumnDataType.Text, label: ColumnDataType.Text },
                    {
                      value: ColumnDataType.Number,
                      label: ColumnDataType.Number,
                    },
                    {
                      value: ColumnDataType.Date,
                      label: ColumnDataType.Date,
                    },
                  ]}
                  value={dataType}
                  onChange={handleDataTypeChange}
                />
              </div>
            )}
            {props.selectedHeaders.size === 1 &&
              dataType === ColumnDataType.Number && (
                <div className="margin-top-3 margin-right-3">
                  <Dropdown
                    id="numberType"
                    name="numberType"
                    label="Number format"
                    options={[
                      { value: "", label: "Select an option" },
                      {
                        value: NumberDataType.Percentage,
                        label: NumberDataType.Percentage,
                      },
                      {
                        value: NumberDataType.Currency,
                        label: NumberDataType.Currency,
                      },
                      {
                        value: NumberDataType["With thousands separators"],
                        label: NumberDataType["With thousands separators"],
                      },
                    ]}
                    value={numberType}
                    onChange={handleNumberTypeChange}
                  />
                </div>
              )}
            {props.selectedHeaders.size === 1 &&
              dataType === ColumnDataType.Number &&
              numberType === NumberDataType.Currency && (
                <div className="margin-top-3 margin-right-3">
                  <Dropdown
                    id="currencyType"
                    name="currencyType"
                    label="Currency"
                    options={[
                      { value: "", label: "Select an option" },
                      {
                        value: CurrencyDataType["Dollar $"],
                        label: CurrencyDataType["Dollar $"],
                      },
                      {
                        value: CurrencyDataType["Euro €"],
                        label: CurrencyDataType["Euro €"],
                      },
                      {
                        value: CurrencyDataType["Pound £"],
                        label: CurrencyDataType["Pound £"],
                      },
                    ]}
                    value={currencyType}
                    onChange={handleCurrencyTypeChange}
                  />
                </div>
              )}
          </div>
        ) : (
          ""
        )}
        <div
          className={`overflow-hidden grid-col-${
            props.selectedHeaders.size > 0 ? 9 : 12
          }`}
        >
          <Table
            selection="none"
            rows={checkDataTableRows}
            initialSortAscending={
              props.sortByDesc !== undefined ? !props.sortByDesc : true
            }
            initialSortByField={props.sortByColumn}
            disablePagination={true}
            disableBorderless={true}
            columns={checkDataTableColumns}
            selectedHeaders={props.selectedHeaders}
            hiddenColumns={props.hiddenColumns}
            addNumbersColumn={true}
            sortByColumn={props.sortByColumn}
            sortByDesc={props.sortByDesc}
            setSortByColumn={props.setSortByColumn}
            setSortByDesc={props.setSortByDesc}
            reset={props.reset}
          />
        </div>
      </div>

      <hr />
      <Button variant="outline" type="button" onClick={props.backStep}>
        Back
      </Button>
      <Button
        type="button"
        onClick={props.advanceStep}
        disabled={!props.data.length}
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

export default CheckData;
