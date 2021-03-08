import React, { useState, useCallback } from "react";
import { Dashboard } from "../models";
import { useDateTimeFormatter, useSettings } from "../hooks";
import Button from "./Button";
import Search from "./Search";
import Table from "./Table";
import ScrollTop from "./ScrollTop";
import Link from "./Link";

interface Props {
  dashboards: Array<Dashboard>;
  onArchive: Function;
}

function PublishedTab(props: Props) {
  const { settings } = useSettings();
  const dateFormatter = useDateTimeFormatter();
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Array<Dashboard>>([]);
  const { dashboards } = props;

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = useCallback((selectedDashboards: Array<Dashboard>) => {
    setSelected(selectedDashboards);
  }, []);

  return (
    <div>
      <p>
        These are all of the published dashboards. You can view all dashboards
        but you need editor access in order to update a published dashboard.{" "}
        <Link target="_blank" to={"/"} external>
          View the published site
        </Link>
      </p>
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-7 text-left padding-top-1px">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span>
                <Search id="search" onSubmit={onSearch} size="small" />
              </span>
            </li>
          </ul>
        </div>
        <div className="tablet:grid-col-5 text-right">
          <span>
            <Button
              variant="outline"
              disabled={selected.length === 0}
              onClick={() => props.onArchive(selected)}
            >
              Archive
            </Button>
          </span>
        </div>
      </div>
      <Table
        selection="multiple"
        initialSortByField="updatedAt"
        filterQuery={filter}
        rows={React.useMemo(() => dashboards, [dashboards])}
        screenReaderField="name"
        onSelection={onSelect}
        width="100%"
        columns={React.useMemo(
          () => [
            {
              Header: "Dashboard name",
              accessor: "name",
              Cell: (props: any) => {
                const dashboard = props.row.original as Dashboard;
                return (
                  <Link to={`/admin/dashboard/${dashboard.id}`}>
                    <span className="text-bold text-base-darkest">
                      {dashboard.name}
                    </span>
                  </Link>
                );
              },
            },
            {
              Header: settings.topicAreaLabels.singular,
              accessor: "topicAreaName",
            },
            {
              Header: "Last Updated",
              accessor: "updatedAt",
              Cell: (props: any) => dateFormatter(props.value),
            },
            {
              Header: "Published by",
              accessor: "publishedBy",
            },
          ],
          [dateFormatter, settings]
        )}
      />
      <div className="text-right">
        <ScrollTop />
      </div>
    </div>
  );
}

export default PublishedTab;
