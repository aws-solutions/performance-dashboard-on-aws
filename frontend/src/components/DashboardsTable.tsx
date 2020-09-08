import React from "react";
import { Link } from "react-router-dom";
import { Dashboard } from "../models";

interface Props {
  dashboards: Array<Dashboard>;
}

function DashboardsTable(props: Props) {
  return (
    <table className="usa-table usa-table--borderless" width="100%">
      <thead>
        <tr>
          <th style={{ padding: "0.5rem 1rem" }}>
            <input type="checkbox" />
          </th>
          <th>Dashboard name</th>
          <th>Topic area</th>
          <th>Last updated</th>
          <th>Created by</th>
        </tr>
      </thead>
      <tbody>
        {props.dashboards.map((dashboard) => (
          <tr key={dashboard.id}>
            <td>
              <input type="checkbox" />
            </td>
            <td>
              <Link to={`/admin/dashboard/edit/${dashboard.id}`}>
                {dashboard.name}
              </Link>
            </td>
            <td>{dashboard.topicAreaName}</td>
            <td>2020-07-31 21:20</td>
            <td>{dashboard.createdBy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DashboardsTable;
