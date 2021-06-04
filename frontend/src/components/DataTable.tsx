import React, { useState, useMemo } from "react";
import { ColumnMetadata } from "../models";
import { useTranslation } from "react-i18next";
import UtilsService from "../services/UtilsService";
import TickFormatter from "../services/TickFormatter";
import Button from "./Button";
import Table from "./Table";
import DropdownMenu from "../components/DropdownMenu";
import { CSVLink } from "react-csv";
const { MenuItem, MenuLink } = DropdownMenu;

interface Props {
  rows: any[];
  columns: string[];
  columnsMetadata?: ColumnMetadata[];
  fileName?: string;
}

function DataTable({ rows, columns, columnsMetadata, fileName }: Props) {
  const { t } = useTranslation();
  const [showDataTable, setShowDataTable] = useState(false);

  const tableRows = useMemo(() => rows, [rows]);
  const tableColumns = useMemo(
    () =>
      columns.map((header) => {
        return {
          Header: header,
          id: header,
          accessor: header,
          minWidth: 150,
          Cell: (props: any) => {
            const row = props.row.original;

            // Check if there is metadata for this column
            let columnMetadata;
            if (columnsMetadata) {
              columnMetadata = columnsMetadata.find(
                (cm) => cm.columnName === header
              );
            }

            return !UtilsService.isCellEmpty(row[header])
              ? TickFormatter.format(row[header], 0, false, columnMetadata)
              : "-";
          },
        };
      }),
    [columns, columnsMetadata]
  );

  const checkData = () => {
    console.log("TABLE ROWS", tableRows);
    console.log("TABLE COLUMNS", tableColumns);
  };

  return (
    <>
      <div className="text-right">
        <DropdownMenu
          buttonText={t("Actions")}
          disabled={false}
          variant="unstyled"
        >
          <MenuItem
            onSelect={() =>
              !showDataTable ? setShowDataTable(true) : setShowDataTable(false)
            }
          >
            {!showDataTable ? "Show data table " : "Hide data table"}
          </MenuItem>
          <MenuItem onSelect={() => checkData()}>
            <CSVLink data={tableRows} filename={fileName}>
              {"Download CSV"}
            </CSVLink>
          </MenuItem>
        </DropdownMenu>
      </div>

      {showDataTable && (
        <Table
          selection="none"
          rows={tableRows}
          disablePagination={true}
          columns={tableColumns}
        />
      )}
    </>
  );
}

export default DataTable;
