import React, { useMemo } from "react";
import { ColumnDataType } from "../models";
import Button from "./Button";
import Combobox from "./Combobox";
import Table from "./Table";

interface Props {
  selectedHeaders: Set<string>;
  hiddenColumns: Set<string>;
  register: Function;
  setSelectedHeaders: Function;
  setHiddenColumns: Function;
  backStep: Function;
  advanceStep: Function;
  onCancel: Function;
  data: Array<any>;
  dataTypes: Map<string, ColumnDataType>;
  setDataTypes: Function;
}

function CheckData(props: Props) {
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
    if (target.value === ColumnDataType.Text) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newDataTypes.set(selectedHeader, ColumnDataType.Text);
      }
    } else if (target.value === ColumnDataType.Number) {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newDataTypes.set(selectedHeader, ColumnDataType.Number);
      }
    } else {
      for (const selectedHeader of Array.from(props.selectedHeaders)) {
        newDataTypes.delete(selectedHeader);
      }
    }
    props.setDataTypes(newDataTypes);
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
                ref={props.register()}
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
                      row[header].toLocaleString()
                    ) : (
                      <div className="text-secondary-vivid">! None</div>
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
    [props.data, props.selectedHeaders, props.dataTypes]
  );

  return (
    <>
      <div className="grid-col-6">
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
                id="hide-from-visualization"
                type="checkbox"
                name="hideFromVisualization"
                defaultChecked={false}
                onChange={handleHideFromVisualizationChange}
                ref={props.register()}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="hide-from-visualization"
              >
                Hide from visualization
              </label>
            </div>
            <div className="margin-top-3 margin-right-3">
              <Combobox
                id="dataType"
                name="dataType"
                label="Data format"
                options={[
                  { value: ColumnDataType.Text, content: ColumnDataType.Text },
                  {
                    value: ColumnDataType.Number,
                    content: ColumnDataType.Number,
                  },
                ]}
                labelClassName={"text-bold"}
                onChange={handleDataTypeChange}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className={`grid-col-${props.selectedHeaders.size > 0 ? 9 : 12}`}>
          <Table
            selection="none"
            rows={checkDataTableRows}
            initialSortAscending
            disablePagination={true}
            disableBorderless={true}
            columns={checkDataTableColumns}
            selectedHeaders={props.selectedHeaders}
            addNumbersColumn={true}
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
