import React, { useState, useMemo } from "react";
import { ColumnMetadata } from "../models";
import { useTranslation } from "react-i18next";
import UtilsService from "../services/UtilsService";
import TickFormatter from "../services/TickFormatter";
import Button from "./Button";
import Table from "./Table";

interface Props {
  rows: any[];
  columns: string[];
  columnsMetadata?: ColumnMetadata[];
}

function DataTable({ rows, columns, columnsMetadata }: Props) {
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

  return (
    <>
      <div className="text-right">
        {!showDataTable && (
          <Button
            type="button"
            variant="unstyled"
            onClick={() => setShowDataTable(true)}
            className="margin-top-1"
          >
            {t("ShowDataTableButton")}
          </Button>
        )}
        {showDataTable && (
          <Button
            type="button"
            variant="unstyled"
            onClick={() => setShowDataTable(false)}
            className="margin-top-1"
          >
            {t("HideDataTableButton")}
          </Button>
        )}
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
