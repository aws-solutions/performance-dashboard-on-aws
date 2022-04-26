import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
  usePagination,
  Row,
} from "react-table";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../hooks";
import { CSVLink } from "react-csv";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Pagination from "./Pagination";

interface Props {
  selection: "multiple" | "single" | "none";
  initialSortByField?: string;
  initialSortAscending?: boolean;
  screenReaderField?: string;
  rowTitleComponents?: Array<string>;
  filterQuery?: string;
  className?: string;
  onSelection?: Function;
  rows: Array<object>;
  pageSize?: 5 | 10 | 20 | 25 | 50 | 100;
  disablePagination?: boolean;
  disableBorderless?: boolean;
  width?: string | number | undefined;
  columns: Array<{
    accessor?: string | Function;
    Header: string;
    Cell?: Function;
    id?: string;
    minWidth?: string | number | undefined;
  }>;
  hiddenColumns?: Set<string>;
  addNumbersColumn?: boolean;
  sortByColumn?: string;
  sortByDesc?: boolean;
  setSortByColumn?: Function;
  setSortByDesc?: Function;
  reset?: Function;
  mobileNavigation?: boolean;
  keepBorderBottom?: boolean;
  title?: string;
  settingTable?: boolean;
}

function Table(props: Props) {
  const { t } = useTranslation();
  const windowSize = useWindowSize();
  const isMobile = props.mobileNavigation || windowSize.width <= 600;
  const borderlessClassName = !props.disableBorderless
    ? " usa-table--borderless"
    : "";
  const className = props.className ? ` ${props.className}` : "";
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    initialSortByField,
    initialSortAscending,
    sortByColumn,
    sortByDesc,
    setSortByColumn,
    setSortByDesc,
    reset,
  } = props;

  const initialSortBy = useMemo(() => {
    return initialSortByField
      ? [
          {
            id: initialSortByField,
            desc: !initialSortAscending,
          },
        ]
      : [];
  }, [initialSortByField, initialSortAscending]);

  const createLongTitleName = (row: Row<object>, accessors: Array<string>) => {
    let title = "";
    accessors.map((accessor: string) => {
      title += row.values[accessor] + " - ";
    });
    return title.substring(0, title.length - 3);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    toggleSortBy,
    prepareRow,
    rows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    selectedFlatRows,
    setGlobalFilter,
    toggleAllRowsSelected,
  } = useTable(
    {
      columns: props.columns,
      data: props.rows,
      disableSortRemove: true,
      initialState: props.disablePagination
        ? {
            selectedRowIds: {},
            sortBy: initialSortBy,
          }
        : {
            selectedRowIds: {},
            sortBy: initialSortBy,
            pageIndex: 0,
            pageSize: props.pageSize || 25,
          },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (props.selection === "single") {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: ({}) => <div></div>,
            Cell: ({ row }) => (
              <div>
                <IndeterminateRadio
                  onClick={() => {
                    toggleAllRowsSelected(false);
                    row.toggleRowSelected();
                  }}
                  aria-labelledby={
                    props.rowTitleComponents
                      ? createLongTitleName(row, props.rowTitleComponents)
                      : props.screenReaderField
                      ? row.values[props.screenReaderField]
                      : null
                  }
                  {...row.getToggleRowSelectedProps()}
                />
              </div>
            ),
          },
          ...columns,
        ]);
      } else if (props.selection === "multiple") {
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
                  props.rowTitleComponents
                    ? createLongTitleName(row, props.rowTitleComponents)
                    : props.screenReaderField
                    ? row.values[props.screenReaderField]
                    : null
                }
                aria-labelledby={
                  props.rowTitleComponents
                    ? createLongTitleName(row, props.rowTitleComponents)
                    : props.screenReaderField
                    ? row.values[props.screenReaderField]
                    : null
                }
              />
            ),
          },
          ...columns,
        ]);
      } else if (props.addNumbersColumn) {
        hooks.visibleColumns.push((columns) => [
          {
            id: "numbersListing",
            Header: () => {
              return <div>1</div>;
            },
            Cell: ({ row }) => {
              return <div>{row.index + 2}</div>;
            },
          },
          ...columns,
        ]);
      }
    }
  );

  useEffect(() => {
    if (setSortByColumn && setSortByDesc && reset) {
      for (const headerGroup of headerGroups) {
        for (const header of headerGroup.headers) {
          if (
            header.isSorted &&
            (sortByColumn !== header.id || sortByDesc !== header.isSortedDesc)
          ) {
            reset({
              sortData: header.id
                ? `${header.id}###${header.isSortedDesc ? "desc" : "asc"}`
                : "",
            });
            setSortByColumn(header.id);
            setSortByDesc(header.isSortedDesc);
            break;
          }
        }
      }
    }
  }, [rows]);

  useEffect(() => {
    if (sortByColumn) {
      toggleSortBy(sortByColumn, sortByDesc);
    }
  }, [sortByColumn, sortByDesc]);

  const { onSelection, filterQuery } = props;
  useEffect(() => {
    setGlobalFilter(filterQuery);
  }, [filterQuery, setGlobalFilter]);

  useEffect(() => {
    if (onSelection) {
      const values = selectedFlatRows.map((flatRow) => flatRow.original);
      onSelection(values);
    }
  }, [selectedFlatRows, onSelection]);

  const currentRows = props.disablePagination ? rows : page;

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <table
        className={`usa-table${borderlessClassName}${className}`}
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
                  aria-sort={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "desc"
                        : "asc"
                      : ""
                  }
                  style={
                    props.selection !== "none"
                      ? {
                          padding: "0.5rem 1rem",
                        }
                      : {
                          minWidth: column.minWidth,
                          backgroundColor: "",
                        }
                  }
                >
                  <span>
                    {
                      /**
                       * The split is to remove the quotes from the
                       * string, the filter to remove the resulted
                       * empty ones, and the join to form it again.
                       */
                      typeof column.render("Header") === "string"
                        ? (column.render("Header") as string)
                            .split('"')
                            .filter(Boolean)
                            .join()
                        : column.render("Header")
                    }
                  </span>
                  {(props.selection !== "none" && i === 0) ||
                  (column.id && column.id.startsWith("checkbox")) ||
                  (column.id &&
                    column.id.startsWith("numbersListing")) ? null : (
                    <button
                      className="margin-left-1 usa-button usa-button--unstyled"
                      {...column.getSortByToggleProps()}
                      title={t("ToggleSortBy", { columnName: column.Header })}
                      aria-label={t("ToggleSortBy", {
                        columnName: column.Header,
                      })}
                      type="button"
                    >
                      <FontAwesomeIcon
                        className={`hover:text-base ${
                          column.isSorted ? "text-base-darker" : "text-base"
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
          {currentRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return j === 0 && props.selection === "none" ? (
                    <th
                      style={{
                        backgroundColor: `${
                          props.addNumbersColumn ? "#f0f0f0" : ""
                        }`,
                      }}
                      scope="row"
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </th>
                  ) : (
                    <td
                      style={{
                        backgroundColor: "",
                      }}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {!props.disablePagination && rows.length && pageCount > 1 ? (
            <Pagination
              numPages={pageCount}
              currentPage={currentPage}
              numPageLinksShown={7}
              gotoPage={gotoPage}
              setCurrentPage={setCurrentPage}
            />
          ) : (
            <>
              {props.title && (
                <tr role="row">
                  <td
                    role="cell"
                    colSpan={
                      props.columns.length -
                      (props.hiddenColumns ? props.hiddenColumns.size : 0) +
                      (props.title ? 0 : 1)
                    }
                    className={`button-cell-padding${
                      props.keepBorderBottom ? "" : " button-cell-border"
                    }`}
                  >
                    <div className="grid-row text-base-darker text-italic padding-y-05 padding-right-1">
                      <div
                        className={`${
                          isMobile
                            ? "text-center margin-top-05"
                            : "grid-col-6 text-left"
                        }`}
                      >
                        <div style={{ display: "inline-flex" }}>
                          <FontAwesomeIcon
                            icon={faDownload}
                            className="margin-right-1"
                            size="xs"
                          />
                        </div>
                        <div style={{ display: "inline-flex" }}>
                          <div className="margin-right-05">
                            <CSVLink
                              className="text-base-darker"
                              data={props.rows}
                              filename={props.title}
                            >
                              {t("DownloadCSV")}
                            </CSVLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
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

const IndeterminateRadio = React.forwardRef<
  HTMLInputElement,
  {
    indeterminate?: boolean;
    title?: string;
    checked?: boolean;
    onClick?: Function;
  }
>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    (resolvedRef as any).current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="radio" ref={resolvedRef as any} {...rest} />
    </>
  );
});

export default Table;
