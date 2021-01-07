import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useTable, useSortBy, useRowSelect } from "react-table";

interface Props {
  selection: "multiple" | "none";
  initialSortByField?: string;
  screenReaderField?: string;
  className?: string;
  onSelection?: Function;
  rows: Array<object>;
  columns: Array<{
    accessor: string;
    Header: string;
  }>;
}

function Table(props: Props) {
  const className = props.className ? ` ${props.className}` : "";
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable(
    {
      columns: props.columns,
      data: props.rows,
      disableSortRemove: true,
      initialState: {
        sortBy: React.useMemo(
          () => [
            {
              id: props.initialSortByField || "",
              desc: true,
            },
          ],
          [props.initialSortByField]
        ),
      },
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      if (props.selection !== "none") {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                title={
                  props.screenReaderField
                    ? row.values[props.screenReaderField]
                    : null
                }
              />
            ),
          },
          ...columns,
        ]);
      }
    }
  );

  React.useEffect(() => {
    if (props.onSelection) {
      props.onSelection(selectedFlatRows.map((flatRow) => flatRow.values));
    }
  }, [selectedFlatRows, props]);

  return (
    <table
      className={`usa-table usa-table--borderless${className}`}
      width="100%"
      {...getTableProps()}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, i) => (
              <th
                scope="col"
                {...column.getHeaderProps()}
                style={
                  props.selection !== "none" ? { padding: "0.5rem 1rem" } : {}
                }
              >
                {column.render("Header")}
                {props.selection !== "none" && i === 0 ? null : (
                  <button
                    className="usa-button usa-button--unstyled"
                    {...column.getSortByToggleProps()}
                    title={`Toggle SortBy ${column.Header}`}
                  >
                    <FontAwesomeIcon
                      className={`margin-left-1 hover:text-base-light ${
                        column.isSorted ? "text-base-darkest" : "text-white"
                      }`}
                      icon={
                        column.isSorted && column.isSortedDesc
                          ? faChevronDown
                          : faChevronUp
                      }
                    />
                  </button>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, j) => {
                return j === 0 && props.selection === "none" ? (
                  <th scope="row" {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </th>
                ) : (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// Taken from example: https://react-table.tanstack.com/docs/examples/row-selection
const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  { indeterminate?: boolean; title?: string }
>(({ indeterminate, title, ...rest }, ref) => {
  const defaultRef = React.useRef(null);
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    (resolvedRef as any).current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" title={title} ref={resolvedRef} {...rest} />;
});

export default Table;
