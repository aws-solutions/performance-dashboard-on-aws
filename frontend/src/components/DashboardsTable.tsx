import React, { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { Dashboard } from "../models";
import Button from "./Button";

interface Props {
  dashboards: Array<Dashboard>;
  onSelect?: Function;
}

interface SelectionHashMap {
  [dashboardId: string]: Dashboard;
}

function DashboardsTable(props: Props) {
  const [selected, setSelected] = useState<SelectionHashMap>({});

  const onSelect = (dashboard: Dashboard) => {
    const selection = { [dashboard.id]: dashboard, ...selected };
    setSelected(selection);
    onSelectCallback(selection);
  };

  const onDeselect = (dashboard: Dashboard) => {
    const { [dashboard.id]: removed, ...selection } = selected;
    setSelected(selection);
    onSelectCallback(selection);
  };

  const onSelectAll = () => {
    const selection: SelectionHashMap = {};
    props.dashboards.forEach((dashboard) => {
      selection[dashboard.id] = dashboard;
    });
    setSelected(selection);
    onSelectCallback(selection);
  };

  const onDeselectAll = () => {
    setSelected({});
    onSelectCallback({});
  };

  const isSelected = (dashboard: Dashboard) => {
    return !!selected[dashboard.id];
  };

  const onSelectCallback = (selection: SelectionHashMap) => {
    if (props.onSelect) {
      props.onSelect(Object.values(selection));
    }
  };

  return (
    <table className="usa-table usa-table--borderless" width="100%">
      <thead>
        <tr>
          <th style={{ padding: "0.5rem 1rem" }}>
            <label className="usa-sr-only" htmlFor="selectAll">
              Select all dashboards
            </label>
            <input
              type="checkbox"
              id="selectAll"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.checked ? onSelectAll() : onDeselectAll();
              }}
            />
          </th>
          <th style={{ width: "30%" }}>
            Dashboard name
            <Button
              variant="unstyled"
              className="margin-left-1"
              onClick={() => console.log("TODO: Implement sort by name")}
            >
              <FontAwesomeIcon icon={faSort} />
            </Button>
          </th>
          <th style={{ width: "30%" }}>
            Topic area
            <Button
              variant="unstyled"
              className="margin-left-1"
              onClick={() => console.log("TODO: Implement sort by topic area")}
            >
              <FontAwesomeIcon icon={faSort} />
            </Button>
          </th>
          <th>
            Last updated
            <Button
              variant="unstyled"
              className="margin-left-1"
              onClick={() =>
                console.log("TODO: Implement sort by last updated")
              }
            >
              <FontAwesomeIcon icon={faSort} />
            </Button>
          </th>
          <th>
            Created by
            <Button
              variant="unstyled"
              className="margin-left-1"
              onClick={() => console.log("TODO: Implement sort by createdBy")}
            >
              <FontAwesomeIcon icon={faSort} />
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {props.dashboards.map((dashboard) => (
          <tr key={dashboard.id}>
            <td>
              <label className="usa-sr-only" htmlFor={dashboard.id}>
                {dashboard.name}
              </label>
              <input
                type="checkbox"
                id={dashboard.id}
                checked={isSelected(dashboard)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    onSelect(dashboard);
                  } else {
                    onDeselect(dashboard);
                  }
                }}
              />
            </td>
            <td>
              <Link to={`/admin/dashboard/edit/${dashboard.id}`}>
                {dashboard.name}
              </Link>
            </td>
            <td>{dashboard.topicAreaName}</td>
            <td>{moment(dashboard.updatedAt).format("YYYY-MM-DD hh:mm")}</td>
            <td>{dashboard.createdBy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DashboardsTable;
