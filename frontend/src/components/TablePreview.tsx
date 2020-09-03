import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  title: string;
  headers: Array<string>;
  data?: Array<object>;
};

const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

const TablePreview = (props: Props) => {
  return (
    <div>
      <h2 className="margin-left-3">{props.title}</h2>
      <table className="usa-table usa-table--borderless margin-left-3">
        <thead>
          <tr>
            {props.headers.length
              ? props.headers.map((header, index) => {
                  return (
                    <th key={index} scope="col">
                      <div className="display-inline">{header}</div>
                      <div className="grid-row flex-column display-inline-block height-1 text-center margin-left-1">
                        <div className="grid-col flex-6 height-1">
                          <FontAwesomeIcon icon="caret-up" size="sm" />
                        </div>
                        <div className="grid-col flex-6">
                          <FontAwesomeIcon icon="caret-down" size="sm" />
                        </div>
                      </div>
                    </th>
                  );
                })
              : null}
          </tr>
        </thead>
        <tbody>
          {props.data &&
            props.data.length &&
            props.data.map((data, indexData) => {
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
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TablePreview;
