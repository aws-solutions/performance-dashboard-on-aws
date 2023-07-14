/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import Link from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePublicDashboard, useWindowSize } from "../hooks";
import { useTranslation } from "react-i18next";
import WidgetRender from "../components/WidgetRender";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";
import Navigation from "../components/Navigation";
import { Waypoint } from "react-waypoint";
import { PublicDashboard, Widget, WidgetType } from "../models";
import AlertContainer from "./AlertContainer";

interface PathParams {
    friendlyURL: string;
}

function ViewDashboard() {
    const { friendlyURL } = useParams<PathParams>();
    const { t } = useTranslation();
    const { dashboard, loading, dashboardNotFound } = usePublicDashboard(friendlyURL);
    const [activeWidgetId, setActiveWidgetId] = useState("");
    const [activeTabId, setActiveTabId] = useState("");
    const windowSize = useWindowSize();
    const isMobile = windowSize.width <= 600;

    const moveNavBarWidth = 1024;

    if (dashboardNotFound) {
        return <Redirect to="/404/page-not-found" />;
    }

    const getSectionWithTabs = (widget: Widget, dashboard: PublicDashboard): string => {
        const section: Widget | undefined = dashboard.widgets.find((w) => w.id === widget.section);
        if (section) {
            return section.content.showWithTabs ? section.id : "";
        }
        return "";
    };

    const onClickHandler = (active: string) => {
        setActiveTabId(active);
        setActiveWidgetId(active);
    };

    const onBottomOfThePage = (bottom: string) => {
        const widget = dashboard?.widgets.find((w: Widget) => w.id === bottom);
        if (widget) {
            if (widget.section) {
                const parent = dashboard?.widgets.find((w: Widget) => w.id === widget.section);
                if (parent) {
                    setActiveWidgetId(parent.id);
                }
            } else {
                setActiveWidgetId(bottom);
            }
        }
    };

    return loading || dashboard === undefined ? (
        <Spinner
            style={{
                position: "fixed",
                top: "30%",
                left: "50%",
            }}
            label={t("LoadingSpinnerLabel")}
        />
    ) : (
        <>
            <AlertContainer />

            <Link to="/">
                <FontAwesomeIcon icon={faArrowLeft} /> {t("AllDashboardsLink")}
            </Link>
            <DashboardHeader
                name={dashboard.name}
                topicAreaName={dashboard.topicAreaName}
                description={dashboard.description}
                lastUpdated={dashboard.updatedAt}
            />
            <hr />
            <Navigation
                stickyPosition={80}
                offset={80}
                area={2}
                marginRight={0}
                widgetNameIds={dashboard.widgets.map((widget) => {
                    return {
                        name: widget.name,
                        id: widget.id,
                        isInsideSection: !!widget.section,
                        sectionWithTabs: getSectionWithTabs(widget, dashboard),
                    };
                })}
                activeWidgetId={activeWidgetId}
                onBottomOfThePage={onBottomOfThePage}
                isTop={windowSize.width <= moveNavBarWidth}
                displayTableOfContents={dashboard.displayTableOfContents}
                onClick={onClickHandler}
            />
            {dashboard.widgets
                .filter((w) => !w.section)
                .map((widget, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                width:
                                    isMobile || !dashboard.displayTableOfContents ? "100%" : "75%",
                            }}
                        >
                            {widget.widgetType === WidgetType.Section &&
                            !widget.content.showWithTabs ? (
                                <div className="margin-top-4 usa-prose" id={widget.id}>
                                    <WidgetRender
                                        widget={widget}
                                        widgets={dashboard.widgets}
                                        setActiveWidgetId={setActiveWidgetId}
                                        topOffset="80px"
                                        bottomOffset={`${windowSize.height - 90}px`}
                                        defaultActive={activeTabId}
                                    />
                                </div>
                            ) : (
                                <Waypoint
                                    onEnter={() => {
                                        setActiveWidgetId(widget.id);
                                    }}
                                    topOffset="80px"
                                    bottomOffset={`${windowSize.height - 90}px`}
                                    fireOnRapidScroll={false}
                                >
                                    <div className="margin-top-4 usa-prose" id={widget.id}>
                                        <WidgetRender
                                            widget={widget}
                                            widgets={dashboard.widgets}
                                            setActiveWidgetId={setActiveWidgetId}
                                            topOffset="80px"
                                            bottomOffset={`${windowSize.height - 90}px`}
                                            defaultActive={activeTabId}
                                        />
                                    </div>
                                </Waypoint>
                            )}
                        </div>
                    );
                })}
        </>
    );
}

export default ViewDashboard;
