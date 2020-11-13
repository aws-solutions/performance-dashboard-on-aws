import React from "react";
import "./TablePreview.css";

type Props = {
  title: string;
  summary: string;
  headers: Array<string>;
  data?: Array<object>;
};

const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

const TablePreview = (props: Props) => {
  return (
    <div className="preview-container">
      <h2 className="margin-left-1 margin-bottom-1">{props.title}</h2>
      <p className="margin-left-1 margin-top-0 margin-bottom-3">
        {props.summary}
      </p>
      <table className="usa-table usa-table--borderless margin-left-2px">
        <thead>
          <tr>
            {props.headers.length
              ? props.headers.map((header, index) => {
                  return (
                    <th key={index} scope="col">
                      <div className="display-inline">{header}</div>
                    </th>
                  );
                })
              : null}
          </tr>
        </thead>
        <tbody>
          {props.data
            ? props.data.map((data, indexData) => {
                return (
                  <tr key={indexData}>
                    {props.headers.map((header, index) => {
                      return index === 0 ? (
                        <th key={index} scope="row">
                          {getKeyValue(header)(data)}
                        </th>
                      ) : (
                        <td key={index}>{getKeyValue(header)(data)}</td>
                      );
                    })}
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default TablePreview;
