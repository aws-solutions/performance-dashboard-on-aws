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
            headers.map((header) => {
              return {
                Header: header,
                accessor: header,
              };
            }),
          [headers]
        )}
      />
    </div>
  );
};

export default TablePreview;
