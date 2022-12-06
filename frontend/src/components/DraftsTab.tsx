/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Dashboard } from "../models";
import { useDateTimeFormatter, useSettings, useWindowSize } from "../hooks";
import Button from "./Button";
import Search from "./Search";
import Table from "./Table";
import Link from "./Link";
import DropdownMenu from "../components/DropdownMenu";
import { useTranslation } from "react-i18next";

const { MenuItem, MenuLink } = DropdownMenu;

interface Props {
    dashboards: Array<Dashboard>;
    onDelete: Function;
    onCopy: Function;
}

function DraftsTab(props: Props) {
    const [filter, setFilter] = useState("");
    const [selected, setSelected] = useState<Array<Dashboard>>([]);
    const { settings } = useSettings();
    const dateFormatter = useDateTimeFormatter();
    const history = useHistory();
    const { dashboards } = props;

    const { t } = useTranslation();

    const windowSize = useWindowSize();
    const isMobile = windowSize.width <= 600;

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
            {isMobile && (
                <div className="margin-y-3">
                    <div className="padding-top-1px">
                        <ul className="usa-button-group">
                            <li className="usa-button-group__item">
                                <Search
                                    id="search"
                                    onSubmit={onSearch}
                                    size="small"
                                    placeholder={t("Search.SearchDashboards", {
                                        state: t("draft"),
                                    })}
                                    label={t("Search.SearchDashboards", {
                                        state: t("draft"),
                                    })}
                                    wide={true}
                                />
                            </li>
                        </ul>
                    </div>
                    <div className="grid-row margin-top-105">
                        <div className="grid-col-6 padding-right-05">
                            <DropdownMenu
                                buttonText={t("Actions")}
                                disabled={selected.length === 0}
                                variant="outline"
                                className="margin-top-neg-1px"
                                ariaLabel={t("ARIA.DraftDashboardActions")}
                            >
                                <MenuLink
                                    href={
                                        selected.length === 1
                                            ? `/admin/dashboard/${selected[0].id}/history`
                                            : "#"
                                    }
                                    disabled={selected.length !== 1}
                                    aria-label={t("ARIA.ViewDraftHistory")}
                                >
                                    {t("ViewHistoryLink")}
                                </MenuLink>
                                <MenuItem
                                    onSelect={() => props.onDelete(selected)}
                                    aria-label={t("ARIA.DeleteDraftDashboard")}
                                >
                                    {t("Delete")}
                                </MenuItem>
                                <MenuItem
                                    onSelect={() => props.onCopy(selected)}
                                    aria-label={t("ARIA.CopyDraftDashboard")}
                                >
                                    {t("CopyButton")}
                                </MenuItem>
                            </DropdownMenu>
                        </div>
                        <div className="grid-col-6 padding-left-05">
                            <Button className="font-sans-xs" onClick={createDashboard}>
                                {t("CreateDashboard")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {!isMobile && (
                <div className="grid-row margin-y-3">
                    <div className="tablet:grid-col-4 padding-top-1px">
                        <ul className="usa-button-group">
                            <li className="usa-button-group__item">
                                <Search
                                    id="search"
                                    onSubmit={onSearch}
                                    size="small"
                                    placeholder={t("Search.SearchDashboards", {
                                        state: t("draft"),
                                    })}
                                    label={t("Search.SearchDashboards", {
                                        state: t("draft"),
                                    })}
                                    wide={true}
                                />
                            </li>
                        </ul>
                    </div>
                    <div className="tablet:grid-col-8 text-right">
                        <span>
                            <DropdownMenu
                                buttonText={t("Actions")}
                                disabled={selected.length === 0}
                                variant="outline"
                                ariaLabel={t("ARIA.DraftDashboardActions")}
                            >
                                <MenuLink
                                    href={
                                        selected.length === 1
                                            ? `/admin/dashboard/${selected[0].id}/history`
                                            : "#"
                                    }
                                    disabled={selected.length !== 1}
                                    aria-label={t("ARIA.ViewDraftHistory")}
                                >
                                    {t("ViewHistoryLink")}
                                </MenuLink>
                                <MenuItem
                                    onSelect={() => props.onDelete(selected)}
                                    aria-label={t("ARIA.DeleteDraftDashboard")}
                                >
                                    {t("Delete")}
                                </MenuItem>
                                <MenuItem
                                    onSelect={() => props.onCopy(selected)}
                                    aria-label={t("ARIA.CopyDraftDashboard")}
                                >
                                    {t("CopyButton")}
                                </MenuItem>
                            </DropdownMenu>
                        </span>
                        <span>
                            <Button onClick={createDashboard}>{t("CreateDashboard")}</Button>
                        </span>
                    </div>
                </div>
            )}
            <Table
                id="draft-dashboards"
                selection="multiple"
                initialSortByField="updatedAt"
                filterQuery={filter}
                rows={React.useMemo(() => dashboards, [dashboards])}
                screenReaderField="name"
                rowTitleComponents={["name", "topicAreaName", "updatedAt", "createdBy"]}
                onSelection={onSelect}
                width="100%"
                pageSize={10}
                columns={React.useMemo(
                    () => [
                        {
                            Header: t("DashboardName"),
                            accessor: "name",
                            Cell: (props: any) => {
                                const dashboard = props.row.original as Dashboard;
                                return (
                                    <Link to={`/admin/dashboard/edit/${dashboard.id}`}>
                                        <span className="text-bold text-base-darker">
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
                    [dateFormatter, settings, t],
                )}
            />
        </div>
    );
}

export default DraftsTab;
