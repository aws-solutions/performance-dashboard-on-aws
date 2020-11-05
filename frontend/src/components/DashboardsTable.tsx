import React, { useState } from "react";
import dayjs from "dayjs";
import Link from "./Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Dashboard, DashboardState } from "../models";
import Button from "./Button";

interface Props {
  dashboards: Array<Dashboard>;
  onSelect?: Function;
}

interface SelectionHashMap {
  [dashboardId: string]: Dashboard;
}

type ColumnType = "name" | "topicArea" | "lastUpdated" | "createdBy";
type Direction = "up" | "down";

function DashboardsTable(props: Props) {
  const [selected, setSelected] = useState<SelectionHashMap>({});
  const [sortedBy, setSortedBy] = useState<ColumnType>("lastUpdated");
  const [direction, setDirection] = useState<Direction>("down");

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

  const sortBy = (columnType: ColumnType) => {
    if (sortedBy === columnType) {
      setDirection(direction === "down" ? "up" : "down");
    } else {
      setDirection("down");
      setSortedBy(columnType);
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
            <span className="font-sans-xs">Dashboard name</span>
            <Button
              variant="unstyled"
              className={`margin-left-1 hover:text-base-light ${
                sortedBy === "name" ? "text-base-darkest" : "text-white"
              }`}
              onClick={() => sortBy("name")}
            >
              <FontAwesomeIcon
                icon={
                  sortedBy === "name" && direction === "up"
                    ? faChevronUp
                    : faChevronDown
                }
              />
            </Button>
          </th>
          <th style={{ width: "30%" }}>
            <span className="font-sans-xs">Topic area</span>
            <Button
              variant="unstyled"
              className={`margin-left-1 hover:text-base-light ${
                sortedBy === "topicArea" ? "text-base-darkest" : "text-white"
              }`}
              onClick={() => sortBy("topicArea")}
            >
              <FontAwesomeIcon
                icon={
                  sortedBy === "topicArea" && direction === "up"
                    ? faChevronUp
                    : faChevronDown
                }
              />
            </Button>
          </th>
          <th>
            <span className="font-sans-xs">Last updated</span>
            <Button
              variant="unstyled"
              className={`margin-left-1 hover:text-base-light ${
                sortedBy === "lastUpdated" ? "text-base-darkest" : "text-white"
              }`}
              onClick={() => sortBy("lastUpdated")}
            >
              <FontAwesomeIcon
                icon={
                  sortedBy === "lastUpdated" && direction === "up"
                    ? faChevronUp
                    : faChevronDown
                }
              />
            </Button>
          </th>
          <th>
            <span className="font-sans-xs">Created by</span>
            <Button
              variant="unstyled"
              className={`margin-left-1 hover:text-base-light ${
                sortedBy === "createdBy" ? "text-base-darkest" : "text-white"
              }`}
              onClick={() => sortBy("createdBy")}
            >
              <FontAwesomeIcon
                icon={
                  sortedBy === "createdBy" && direction === "up"
                    ? faChevronUp
                    : faChevronDown
                }
              />
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortDashboards(props.dashboards, sortedBy, direction).map(
          (dashboard) => (
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
                <Link
                  to={dashboardLink(
                    dashboard.id,
                    dashboard.state as DashboardState
                  )}
                  className="text-no-underline"
                >
                  <span className="text-bold text-base-darkest font-sans-md">
                    {dashboard.name}
                  </span>
                </Link>
              </td>
              <td>
                <span className="font-sans-md">{dashboard.topicAreaName}</span>
              </td>
              <td>
                <span className="font-sans-md">
                  {dayjs(dashboard.updatedAt).format("YYYY-MM-DD hh:mm")}
                </span>
              </td>
              <td>
                <span className="font-sans-md">{dashboard.createdBy}</span>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

function sortDashboards(
  dashboards: Array<Dashboard>,
  sortedBy: ColumnType,
  direction: Direction
): Array<Dashboard> {
  const sortedDashboard = [...dashboards];
  if (sortedBy === "name") {
    sortedDashboard.sort((a: Dashboard, b: Dashboard) =>
      direction === "down"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  } else if (sortedBy === "topicArea") {
    sortedDashboard.sort((a: Dashboard, b: Dashboard) =>
      direction === "down"
        ? a.topicAreaName.localeCompare(b.topicAreaName)
        : b.topicAreaName.localeCompare(a.topicAreaName)
    );
  } else if (sortedBy === "lastUpdated") {
    sortedDashboard.sort((a: Dashboard, b: Dashboard) =>
      direction === "down"
        ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    );
  } else if (sortedBy === "createdBy") {
    sortedDashboard.sort((a: Dashboard, b: Dashboard) =>
      direction === "down"
        ? a.createdBy.localeCompare(b.createdBy)
        : b.createdBy.localeCompare(a.createdBy)
    );
  }
  return sortedDashboard;
}

function dashboardLink(id: string, state: DashboardState): string {
  switch (state) {
    case DashboardState.Draft:
      return `/admin/dashboard/edit/${id}`;
    case DashboardState.Published:
      return `/admin/dashboard/${id}`;
    case DashboardState.PublishPending:
      return `/admin/dashboard/${id}/publish`;
    case DashboardState.Archived:
      return `/admin/dashboard/archived/${id}`;
    default:
      return "/admin/dashboards";
  }
}

export default DashboardsTable;
