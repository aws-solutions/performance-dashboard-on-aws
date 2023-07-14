/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Dashboard } from "../models";
import { useDateTimeFormatter, useSettings, useWindowSize } from "../hooks";
import Search from "./Search";
import Table from "./Table";
import Link from "./Link";
import DropdownMenu from "../components/DropdownMenu";

const { MenuItem, MenuLink } = DropdownMenu;

interface Props {
    dashboards: Array<Dashboard>;
    onArchive: Function;
    onCopy: Function;
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
                <Link
                    target="_blank"
                    to="/"
                    external
                    ariaLabel={`${t("PublishedTabDescriptionLink")} ${t("ARIA.OpenInNewTab")}`}
                >
                    {t("PublishedTabDescriptionLink")}
                </Link>
            </p>
            {isMobile && (
                <div className="margin-y-3">
                    <div className="text-left padding-top-1px">
                        <ul className="usa-button-group">
                            <li className="usa-button-group__item">
                                <Search
                                    id="search"
                                    onSubmit={onSearch}
                                    size="small"
                                    placeholder={t("Search.SearchDashboards", {
                                        state: t("published"),
                                    })}
                                    label={t("Search.SearchDashboards", {
                                        state: t("published"),
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
                                ariaLabel={t("ARIA.PublishedDashboardActions")}
                            >
                                <MenuLink
                                    disabled={selected.length !== 1}
                                    href={
                                        selected.length === 1
                                            ? `/admin/dashboard/${selected[0].id}/history`
                                            : "#"
                                    }
                                    aria-label={t("ARIA.ViewPublishedHistory")}
                                >
                                    {t("ViewHistoryLink")}
                                </MenuLink>
                                <MenuItem
                                    onSelect={() => props.onArchive(selected)}
                                    aria-label={t("ARIA.ArchivePublishedDashboard")}
                                >
                                    {t("ArchiveButton")}
                                </MenuItem>
                                <MenuItem
                                    onSelect={() => props.onCopy(selected)}
                                    aria-label={t("ARIA.CopyPublishedDashboard")}
                                >
                                    {t("CopyButton")}
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
                                <Search
                                    id="search"
                                    onSubmit={onSearch}
                                    size="small"
                                    placeholder={t("Search.SearchDashboards", {
                                        state: t("published"),
                                    })}
                                    label={t("Search.SearchDashboards", {
                                        state: t("published"),
                                    })}
                                    wide={true}
                                />
                            </li>
                        </ul>
                    </div>
                    <div className="tablet:grid-col-5 text-right">
                        <span>
                            <DropdownMenu
                                buttonText={t("Actions")}
                                disabled={selected.length === 0}
                                variant="outline"
                                ariaLabel={t("ARIA.PublishedDashboardActions")}
                            >
                                <MenuLink
                                    disabled={selected.length !== 1}
                                    href={
                                        selected.length === 1
                                            ? `/admin/dashboard/${selected[0].id}/history`
                                            : "#"
                                    }
                                    aria-label={t("ARIA.ViewPublishedHistory")}
                                >
                                    {t("ViewHistoryLink")}
                                </MenuLink>
                                <MenuItem
                                    onSelect={() => props.onArchive(selected)}
                                    aria-label={t("ARIA.ArchivePublishedDashboard")}
                                >
                                    {t("ArchiveButton")}
                                </MenuItem>
                                <MenuItem
                                    onSelect={() => props.onCopy(selected)}
                                    aria-label={t("ARIA.CopyPublishedDashboard")}
                                >
                                    {t("CopyButton")}
                                </MenuItem>
                            </DropdownMenu>
                        </span>
                    </div>
                </div>
            )}
            <Table
                id="published-dashboards"
                selection="multiple"
                initialSortByField="updatedAt"
                filterQuery={filter}
                rows={React.useMemo(() => dashboards, [dashboards])}
                screenReaderField="name"
                rowTitleComponents={["name", "topicAreaName", "updatedAt", "publishedBy"]}
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
                                    <Link to={`/admin/dashboard/${dashboard.id}`}>
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
                            Header: t("PublishedBy"),
                            accessor: "publishedBy",
                        },
                    ],
                    [dateFormatter, settings, t],
                )}
            />
        </div>
    );
}

export default PublishedTab;
