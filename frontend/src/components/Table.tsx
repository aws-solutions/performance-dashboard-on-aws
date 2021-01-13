import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
} from "react-table";

interface Props {
  selection: "multiple" | "none";
  initialSortByField?: string;
  asc?: boolean;
  screenReaderField?: string;
  filterQuery?: string;
  className?: string;
  onSelection?: Function;
  rows: Array<object>;
  width?: string;
  columns: Array<{
    accessor?: string;
    Header: string;
    Cell?: Function;
    id?: string;
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
    setGlobalFilter,
  } = useTable(
    {
      columns: props.columns,
      data: props.rows,
      disableSortRemove: true,
      initialState: {
        selectedRowIds: {},
        sortBy: React.useMemo(
          () => [
            {
              id: props.initialSortByField || "",
              desc: !props.asc,
            },
          ],
          [props.initialSortByField, props.asc]
        ),
      },
    },
    useGlobalFilter,
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

  const { onSelection, filterQuery } = props;
  React.useEffect(() => {
    setGlobalFilter(filterQuery);
  }, [filterQuery, setGlobalFilter]);

  React.useEffect(() => {
    if (onSelection) {
      const values = selectedFlatRows.map((flatRow) => flatRow.original);
      onSelection(values);
    }
  }, [selectedFlatRows, onSelection]);

  return (
    <table
      className={`usa-table usa-table--borderless${className}`}
      width={props.width}
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
                    className="margin-left-1 usa-button usa-button--unstyled"
                    {...column.getSortByToggleProps()}
                    title={`Toggle SortBy ${column.Header}`}
                  >
                    <FontAwesomeIcon
                      className={`hover:text-base-light ${
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
