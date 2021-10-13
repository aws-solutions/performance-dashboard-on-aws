import React, { useState, useMemo } from "react";
import { ColumnMetadata } from "../models";
import { useTranslation } from "react-i18next";
import UtilsService from "../services/UtilsService";
import TickFormatter from "../services/TickFormatter";
import Table from "./Table";
import DropdownMenu from "../components/DropdownMenu";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const { MenuItem } = DropdownMenu;

interface Props {
  rows: any[];
  columns: string[];
  columnsMetadata?: ColumnMetadata[];
  fileName?: string;
  showMobilePreview?: boolean;
}

function DataTable({
  rows,
  columns,
  columnsMetadata,
  fileName,
  showMobilePreview,
}: Props) {
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
              ? TickFormatter.format(
                  row[header],
                  0,
                  false,
                  "",
                  "",
                  columnMetadata
                )
              : "-";
          },
        };
      }),
    [columns, columnsMetadata]
  );

  return (
    <>
      <div
        className={
          showMobilePreview ? "margin-left-05" : "text-right margin-right-05"
        }
      >
        <DropdownMenu
          className="text-base"
          buttonText={t("Actions")}
          disabled={false}
          variant="unstyled"
        >
          <MenuItem
            onSelect={() =>
              !showDataTable ? setShowDataTable(true) : setShowDataTable(false)
            }
          >
            {!showDataTable
              ? t("ShowDataTableButton")
              : t("HideDataTableButton")}
          </MenuItem>
          <MenuItem onSelect={() => {}}>
            <FontAwesomeIcon
              icon={faDownload}
              className="margin-right-1"
              size="sm"
            />
            <CSVLink
              data={tableRows}
              filename={fileName}
              style={{ color: "#1b1b1b" }}
            >
              {t("DownloadCSV")}
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
