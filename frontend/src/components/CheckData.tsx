import React, { useMemo } from "react";
import Button from "./Button";
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
              Cell: (props: any) => {
                const row = props.row.original;
                return row[header] ? row[header].toLocaleString() : null;
              },
            },
          ],
        };
      }),
    [props.data, props.selectedHeaders]
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
            <div className="font-sans-md">
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
            hiddenColumns={Array.from(props.hiddenColumns)}
            selectedHeaders={props.selectedHeaders}
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
