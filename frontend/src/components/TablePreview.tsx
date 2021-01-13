import React, { useMemo } from "react";
import Table from "./Table";
import "./TablePreview.css";

type Props = {
  title: string;
  summary: string;
  headers: Array<string>;
  data?: Array<object>;
};

const TablePreview = (props: Props) => {
  const { headers, data } = props;

  return (
    <div className="preview-container">
      <h2 className="margin-left-1 margin-bottom-1">{props.title}</h2>
      <p className="margin-left-1 margin-top-0 margin-bottom-3">
        {props.summary}
      </p>
      <Table
        selection="none"
        rows={useMemo(() => data || [], [data])}
        className="margin-left-2px"
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
    </div>
  );
};

export default TablePreview;
