import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleRight,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
  usePagination,
} from "react-table";

interface Props {
  selection: "multiple" | "single" | "none";
  initialSortByField?: string;
  initialSortAscending?: boolean;
  screenReaderField?: string;
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
  selectedHeaders?: Set<string>;
  hiddenColumns?: Set<string>;
  addNumbersColumn?: boolean;
  sortByColumn?: string;
  sortByDesc?: boolean;
  setSortByColumn?: Function;
  setSortByDesc?: Function;
  reset?: Function;
}

function Table(props: Props) {
  const borderlessClassName = !props.disableBorderless
    ? " usa-table--borderless"
    : "";
  const className = props.className ? ` ${props.className}` : "";
  const [currentPage, setCurrentPage] = useState<string>("1");

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
                  props.screenReaderField
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

  const getCellBackground = useCallback(
    (id: string, defaultColor: string) => {
      if (id.startsWith("checkbox")) {
        for (const selectedHeader of Array.from(props.selectedHeaders ?? [])) {
          if (id.includes(selectedHeader)) {
            return "#97d4ea";
          }
        }
        return defaultColor;
      } else {
        return props.selectedHeaders?.has(id) ? "#97d4ea" : defaultColor;
      }
    },
    [props.selectedHeaders]
  );

  return (
    <>
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
                  style={
                    props.selection !== "none"
                      ? {
                          padding: "0.5rem 1rem",
                        }
                      : {
                          minWidth: column.minWidth,
                          backgroundColor: `${getCellBackground(
                            column.id,
                            ""
                          )}`,
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
                      title={`Toggle SortBy ${column.Header}`}
                      type="button"
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
          {currentRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return j === 0 && props.selection === "none" ? (
                    <th
                      style={{
                        backgroundColor: `${getCellBackground(
                          cell.column.id,
                          props.addNumbersColumn ? "#f0f0f0" : ""
                        )}`,
                      }}
                      scope="row"
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </th>
                  ) : (
                    <td
                      style={{
                        backgroundColor: `${getCellBackground(
                          cell.column.id,
                          props.hiddenColumns?.has(cell.column.id)
                            ? "#adadad"
                            : ""
                        )}`,
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
        </tbody>
      </table>
      {!props.disablePagination && rows.length ? (
        <div className="grid-row font-sans-sm">
          <div className="grid-col-3 text-left text-base text-italic">
            {`Showing ${pageIndex * pageSize + 1}-${Math.min(
              pageIndex * pageSize + pageSize,
              rows.length
            )} of ${rows.length}`}
          </div>
          <div className="grid-col-6 text-center">
            <button
              className="margin-right-1"
              onClick={() => {
                setCurrentPage("1");
                gotoPage(0);
              }}
              disabled={!canPreviousPage}
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
            <button
              className="margin-right-2"
              onClick={() => {
                setCurrentPage(`${pageIndex}`);
                previousPage();
              }}
              disabled={!canPreviousPage}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span className="margin-right-2px">Page </span>
            <span className="margin-right-1">
              <input
                type="text"
                value={`${currentPage}`}
                className="margin-right-2px"
                onChange={(e) => {
                  setCurrentPage(e.target.value);
                }}
                style={{ width: "33px" }}
                pattern="\d*"
              />
              {` of ${pageOptions.length} `}
            </span>
            <button
              className="usa-button usa-button--unstyled margin-right-2 text-base-darker hover:text-base-darkest active:text-base-darkest"
              onClick={() => {
                if (currentPage) {
                  const currentPageNumber = Number(currentPage);
                  if (
                    !isNaN(currentPageNumber) &&
                    currentPageNumber >= 1 &&
                    currentPageNumber <= pageOptions.length
                  ) {
                    gotoPage(currentPageNumber - 1);
                  }
                }
              }}
            >
              Go
            </button>
            <button
              className="margin-right-1"
              onClick={() => {
                setCurrentPage(`${pageIndex + 2}`);
                nextPage();
              }}
              disabled={!canNextPage}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button
              onClick={() => {
                setCurrentPage(`${pageCount}`);
                gotoPage(pageCount - 1);
              }}
              disabled={!canNextPage}
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </div>
          <div className="grid-col-3 text-right">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
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
