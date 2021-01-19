import React, { useMemo } from "react";
import Table from "./Table";
import "./TablePreview.css";

type Props = {
  title: string;
  summary: string;
  headers: Array<string>;
  data?: Array<object>;
  summaryBelow: boolean;
};

const TablePreview = (props: Props) => {
  const { headers, data, summaryBelow, summary, title } = props;

  return (
    <div className="preview-container">
      <h2 className="margin-left-1 margin-bottom-1">{title}</h2>
      {!summaryBelow && (
        <p className="margin-left-1 margin-top-0 margin-bottom-3">{summary}</p>
      )}
      <Table
        selection="none"
        rows={useMemo(() => data || [], [data])}
        className="margin-left-1"
        initialSortAscending
        columns={useMemo(
          () =>
            headers.map((header, i) => {
              return {
                Header: header,
                id: String(i),
                accessor: header,
                Cell: (props: any) => {
                  const row = props.row.original;
                  return row[header] || null;
                },
              };
            }),
          [headers]
        )}
      />
      {summaryBelow && (
        <p className="margin-left-1 margin-top-3 margin-bottom-0">{summary}</p>
      )}
    </div>
  );
};

export default TablePreview;
