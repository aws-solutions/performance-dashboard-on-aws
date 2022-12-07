/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useHistory } from "react-router-dom";
import Link from "../components/Link";
import { usePublicHomepageSearch } from "../hooks";
import { useTranslation } from "react-i18next";
import UtilsService from "../services/UtilsService";
import Search from "../components/Search";
import { LocationState, PublicTopicArea, PublicDashboard, Dashboard } from "../models";
import Spinner from "../components/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MarkdownRender from "../components/MarkdownRender";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import "./Home.scss";
import "../styles/base.scss";

dayjs.extend(LocalizedFormat);

function HomeWithSearch() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const { homepage, loading } = usePublicHomepageSearch(query as string);
    const { t } = useTranslation();
    const history = useHistory<LocationState>();

    const topicareas = UtilsService.groupByTopicArea(homepage.dashboards);

    // Sort topic areas and their dashboards in ascending alphabetical order.
    topicareas.sort((a: PublicTopicArea, b: PublicTopicArea) => a.name.localeCompare(b.name));
    for (let topicArea of topicareas) {
        topicArea.dashboards?.sort((a: PublicDashboard, b: PublicDashboard) =>
            a.name.localeCompare(b.name),
        );
    }

    const onSearch = (query: string) => {
        history.push("/public/search?q=" + query);
    };

    const onClear = () => {
        history.push("/");
    };

    const getDashboardLink = (dashboard: PublicDashboard | Dashboard): string => {
        const link = dashboard.friendlyURL ? dashboard.friendlyURL : dashboard.id;
        return "/" + link;
    };

    return loading ? (
        <Spinner
            style={{
                position: "fixed",
                top: "30%",
                left: "50%",
            }}
            label={t("LoadingSpinnerLabel")}
        />
    ) : (
        <div className="usa-prose">
            <Link to="/">
                <FontAwesomeIcon icon={faArrowLeft} /> {t("AllDashboardsLink")}
            </Link>
            <div className="grid-row">
                <div className="grid-col-12 tablet:grid-col-8">
                    <h1 className="font-sans-3xl line-height-sans-2 margin-top-2">
                        {homepage.title}
                    </h1>
                    <MarkdownRender
                        className="font-sans-lg usa-prose"
                        source={homepage.description}
                    />
                </div>
            </div>

            <div className="grid-row">
                <div className="grid-col-12 padding-y-3 usa-prose">
                    <Search
                        id="search"
                        onSubmit={onSearch}
                        onClear={onClear}
                        size="big"
                        query=""
                        results={homepage.dashboards.length}
                        lastQuery={query ? query : undefined}
                        wide
                    />
                    {query === "" ? t("Search.EnterSearchTerm") + "." : ""}
                    <br />
                </div>
            </div>

            <div className="grid-row border">
                <div className="grid-col-12 tablet:grid-col-12 usa-prose margin-left-2 margin-right-2">
                    <div className="border-bottom border-base-light padding-2">
                        <p className="font-sans-xl line-height-sans-2 margin-top-1">
                            <b>{t("Search.SearchResults")}</b>
                        </p>
                        {homepage.dashboards.length} dashboard(s) contain "{query}" &ensp;
                    </div>

                    {topicareas.map((topicarea) => (
                        <ul id={topicarea.id} key={topicarea.id} title={topicarea.name}>
                            {topicarea.dashboards?.map((dashboard) => {
                                return (
                                    <li key={dashboard.id} style={{ listStyleType: "none" }}>
                                        <div
                                            key={dashboard.id}
                                            className="border-bottom border-base-light padding-2 margin-top-1"
                                        >
                                            <span className="bg-info-light">{topicarea.name}</span>
                                            <div className="grid-row margin-bottom-1">
                                                <div className="grid-col-11 text-bold margin-top-1">
                                                    <Link to={getDashboardLink(dashboard)}>
                                                        <b>{dashboard.name}</b>
                                                    </Link>
                                                </div>
                                                <div className="grid-col-1">
                                                    <Link to={getDashboardLink(dashboard)}>
                                                        <FontAwesomeIcon
                                                            icon={faArrowRight}
                                                            className="margin-right-1"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                            <span className="text-base text-italic">
                                                {t("Updated") +
                                                    " " +
                                                    dayjs(dashboard.updatedAt).fromNow()}
                                                <br />
                                            </span>
                                            {dashboard.queryMatches?.map((queryMatch) => {
                                                return (
                                                    <p
                                                        key={queryMatch}
                                                        className="text-base margin-left-2 margin-right-2"
                                                    >
                                                        {" "}
                                                        ... {queryMatch} ...
                                                        <br />
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeWithSearch;
