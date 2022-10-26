import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronCircleUp,
  faChevronCircleDown,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { TopicArea } from "../models";
import Button from "./Button";
import { useTranslation } from "react-i18next";

interface Props {
  topicAreas: Array<TopicArea>;
  onSelect?: Function;
}

interface SelectionHashMap {
  [topicareaId: string]: TopicArea;
}

type ColumnType = "name" | "createdBy" | "dashboards";
type Direction = "up" | "down";

function TopicareasTable(props: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<SelectionHashMap>({});
  const [sortedBy, setSortedBy] = useState<ColumnType>("dashboards");
  const [direction, setDirection] = useState<Direction>("down");

  const onSelect = (topicarea: TopicArea) => {
    const selection = { [topicarea.id]: topicarea };
    setSelected(selection);
    onSelectCallback(selection);
  };

  const isSelected = (topicarea: TopicArea) => {
    return !!selected[topicarea.id];
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

  const sortByIcon = (
    actualColunmName: string,
    expectedColumnName: string,
    direction: Direction
  ): IconDefinition => {
    if (actualColunmName !== expectedColumnName) {
      return faChevronDown;
    }
    return direction === "up" ? faChevronCircleUp : faChevronCircleDown;
  };

  return (
    <table className="usa-table usa-table--borderless" width="100%">
      <thead>
        <tr>
          <th></th>
          <th>
            <Button
              variant="unstyled"
              className="margin-left-1 hover:text-base-darker font-sans-md text-bold text-no-underline"
              onClick={() => sortBy("name")}
              ariaLabel={t("SortTopicAreaName")}
            >
              <span>{t("TopicArea")}</span>
              <FontAwesomeIcon
                className="margin-left-1"
                icon={sortByIcon(sortedBy, "name", direction)}
              />
            </Button>
          </th>
          <th>
            <Button
              variant="unstyled"
              className="margin-left-1 hover:text-base-darker font-sans-md text-bold text-no-underline"
              onClick={() => sortBy("dashboards")}
              ariaLabel={t("SortDashboards")}
            >
              <span>{t("Dashboards")}</span>
              <FontAwesomeIcon
                className="margin-left-1"
                icon={sortByIcon(sortedBy, "dashboards", direction)}
              />
            </Button>
          </th>
          <th>
            <Button
              variant="unstyled"
              className="margin-left-1 hover:text-base-darker font-sans-md text-bold text-no-underline"
              onClick={() => sortBy("createdBy")}
              ariaLabel={t("SortCreatedBy")}
            >
              <span>{t("CreatedBy")}</span>
              <FontAwesomeIcon
                className="margin-left-1"
                icon={sortByIcon(sortedBy, "createdBy", direction)}
              />
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortTopicAreas(props.topicAreas, sortedBy, direction).map(
          (topicarea) => (
            <tr key={topicarea.id}>
              <td>
                <label className="usa-sr-only" htmlFor={topicarea.id}>
                  {topicarea.name}
                </label>
                <input
                  type="radio"
                  id={topicarea.id}
                  checked={isSelected(topicarea)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!isSelected(topicarea) && e.target.checked) {
                      onSelect(topicarea);
                    }
                  }}
                />
              </td>
              <td>
                <span className="text-bold text-base-darker font-sans-md">
                  {topicarea.name}
                </span>
              </td>
              <td>
                <span className="font-sans-md">
                  {topicarea.dashboardCount || "-"}
                </span>
              </td>
              <td>
                <span className="font-sans-md">{topicarea.createdBy}</span>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

function sortTopicAreas(
  topicAreas: Array<TopicArea>,
  sortedBy: ColumnType,
  direction: Direction
): Array<TopicArea> {
  const sortedTopicAreas = [...topicAreas];
  if (sortedBy === "name") {
    sortedTopicAreas.sort((a: TopicArea, b: TopicArea) =>
      direction === "down"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  } else if (sortedBy === "createdBy") {
    sortedTopicAreas.sort((a: TopicArea, b: TopicArea) =>
      direction === "down"
        ? a.createdBy.localeCompare(b.createdBy)
        : b.createdBy.localeCompare(a.createdBy)
    );
  } else if (sortedBy === "dashboards") {
    sortedTopicAreas.sort((a: TopicArea, b: TopicArea) =>
      direction === "down"
        ? b.dashboardCount - a.dashboardCount
        : a.dashboardCount - b.dashboardCount
    );
  }
  return sortedTopicAreas;
}

export default TopicareasTable;
