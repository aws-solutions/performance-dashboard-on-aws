import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Dashboard } from "../models";
import { useDateTimeFormatter, useSettings } from "../hooks";
import Button from "./Button";
import Search from "./Search";
import ScrollTop from "./ScrollTop";
import Table from "./Table";
import Link from "./Link";
import DropdownMenu from "../components/DropdownMenu";
import { useTranslation } from "react-i18next";

const { MenuItem, MenuLink } = DropdownMenu;

interface Props {
  dashboards: Array<Dashboard>;
  onDelete: Function;
}

function DraftsTab(props: Props) {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Array<Dashboard>>([]);
  const { settings } = useSettings();
  const dateFormatter = useDateTimeFormatter();
  const history = useHistory();
  const { dashboards } = props;

  const { t } = useTranslation();

  const createDashboard = () => {
    history.push("/admin/dashboard/create");
  };

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = useCallback((selectedDashboards: Array<Dashboard>) => {
    setSelected(selectedDashboards);
  }, []);

  return (
    <div>
      <p>{t("DraftTabDescription")}</p>
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-3 padding-top-1px">
          <Search id="search" onSubmit={onSearch} size="small" />
        </div>
        <div className="tablet:grid-col-9 text-right">
          <span>
            <DropdownMenu
              buttonText={t("Actions")}
              disabled={selected.length === 0}
              variant="outline"
            >
              <MenuLink
                href={
                  selected.length === 1
                    ? `/admin/dashboard/${selected[0].id}/history`
                    : "#"
                }
                disabled={selected.length !== 1}
              >
                {t("ViewHistoryLink")}
              </MenuLink>
              <MenuItem onSelect={() => props.onDelete(selected)}>
                {t("Delete")}
              </MenuItem>
            </DropdownMenu>
          </span>
          <span>
            <Button onClick={createDashboard}>{t("CreateDashboard")}</Button>
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
              Header: t("DashboardName"),
              accessor: "name",
              Cell: (props: any) => {
                const dashboard = props.row.original as Dashboard;
                return (
                  <Link to={`/admin/dashboard/edit/${dashboard.id}`}>
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
              Header: t("CreatedBy"),
              accessor: "createdBy",
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

export default DraftsTab;
