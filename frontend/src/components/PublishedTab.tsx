import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Dashboard } from "../models";
import { useDateTimeFormatter, useSettings, useWindowSize } from "../hooks";
import Search from "./Search";
import Table from "./Table";
import ScrollTop from "./ScrollTop";
import Link from "./Link";
import DropdownMenu from "../components/DropdownMenu";

const { MenuItem, MenuLink } = DropdownMenu;

interface Props {
  dashboards: Array<Dashboard>;
  onArchive: Function;
}

function PublishedTab(props: Props) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const dateFormatter = useDateTimeFormatter();
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Array<Dashboard>>([]);
  const { dashboards } = props;

  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 600;

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = useCallback((selectedDashboards: Array<Dashboard>) => {
    setSelected(selectedDashboards);
  }, []);

  return (
    <div>
      <p>
        {t("PublishedTabDescription")}{" "}
        <Link target="_blank" to={"/"} external>
          {t("PublishedTabDescriptionLink")}
        </Link>
      </p>
      {isMobile && (
        <div className="margin-y-3">
          <div className="text-left padding-top-1px">
            <ul className="usa-button-group">
              <li className="usa-button-group__item">
                <span>
                  <Search id="search" onSubmit={onSearch} size="small" />
                </span>
              </li>
            </ul>
          </div>
          <div className="grid-row margin-top-105">
            <div className="grid-col-6 padding-right-05">
              <DropdownMenu
                buttonText={t("Actions")}
                disabled={selected.length === 0}
                variant="outline"
              >
                <MenuLink
                  disabled={selected.length !== 1}
                  href={
                    selected.length === 1
                      ? `/admin/dashboard/${selected[0].id}/history`
                      : "#"
                  }
                >
                  {t("ViewHistoryLink")}
                </MenuLink>
                <MenuItem onSelect={() => props.onArchive(selected)}>
                  {t("ArchiveButton")}
                </MenuItem>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
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
              <DropdownMenu
                buttonText={t("Actions")}
                disabled={selected.length === 0}
                variant="outline"
              >
                <MenuLink
                  disabled={selected.length !== 1}
                  href={
                    selected.length === 1
                      ? `/admin/dashboard/${selected[0].id}/history`
                      : "#"
                  }
                >
                  {t("ViewHistoryLink")}
                </MenuLink>
                <MenuItem onSelect={() => props.onArchive(selected)}>
                  {t("ArchiveButton")}
                </MenuItem>
              </DropdownMenu>
            </span>
          </div>
        </div>
      )}
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
              Header: t("DashboardName"),
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
              Header: t("LastUpdatedLabel"),
              accessor: "updatedAt",
              Cell: (props: any) => dateFormatter(props.value),
            },
            {
              Header: t("PublishedBy"),
              accessor: "publishedBy",
            },
          ],
          [dateFormatter, settings, t]
        )}
      />
      <div className="text-right">
        <ScrollTop />
      </div>
    </div>
  );
}

export default PublishedTab;
