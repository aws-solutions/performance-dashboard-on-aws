import React, { useMemo, useState } from "react";
import MarkdownRender from "./MarkdownRender";
import Table from "./Table";

type Props = {
  title: string;
  summary: string;
  data?: Array<object>;
  summaryBelow: boolean;
  columnsMetadata: Array<any>;
  sortByColumn?: string;
  sortByDesc?: boolean;
};

const TableWidget = (props: Props) => {
  const { data, summaryBelow, summary, title, columnsMetadata } = props;
  const [filteredJson, setFilteredJson] = useState<Array<any>>([]);

  useMemo(() => {
    let headers =
      data && data.length ? (Object.keys(data[0]) as Array<string>) : [];
    headers = headers.filter((h) => {
      const metadata = columnsMetadata
        ? columnsMetadata.find((c) => c.columnName === h)
        : undefined;
      return !metadata || !metadata.hidden;
    });
    const newFilteredJson = new Array<any>();
    for (const row of data || new Array<any>()) {
      const filteredRow = headers.reduce((obj: any, key: any) => {
        obj[key] = row[key];
        return obj;
      }, {});
      if (filteredRow !== {}) {
        newFilteredJson.push(filteredRow);
      }
    }
    setFilteredJson(newFilteredJson);
  }, [data, props.columnsMetadata]);

  const keys = filteredJson.length
    ? Object.keys(filteredJson[0] as Array<string>)
    : [];
  const rows = useMemo(() => filteredJson || [], [filteredJson]);
  const columns = useMemo(
    () =>
      keys.map((header) => {
        return {
          Header: header,
          id: header,
          accessor: header,
          minWidth: 150,
          Cell: (props: any) => {
            const row = props.row.original;
            return row[header] !== null &&
              row[header] !== undefined &&
              row[header] !== ""
              ? row[header].toLocaleString()
              : "-";
          },
        };
      }),
    [keys]
  );

  if (!filteredJson || filteredJson.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden">
      <h2 className="margin-bottom-1">{title}</h2>
      {!summaryBelow && (
        <MarkdownRender
          source={summary}
          className="usa-prose margin-top-0 margin-bottom-3 tableSummaryAbove"
        />
      )}
      <Table
        selection="none"
        rows={rows}
        initialSortAscending={
          props.sortByDesc !== undefined ? !props.sortByDesc : true
        }
        initialSortByField={props.sortByColumn}
        disablePagination={true}
        columns={columns}
        sortByColumn={props.sortByColumn}
        sortByDesc={props.sortByDesc}
      />
      {summaryBelow && (
        <MarkdownRender
          source={summary}
          className="usa-prose margin-top-3 margin-bottom-0 tableSummaryBelow"
        />
      )}
    </div>
  );
};

export default TableWidget;
