/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { NavHashLink } from "react-router-hash-link";

interface WidgetNameId {
    name: string;
    id: string;
    isInsideSection: boolean;
    sectionWithTabs: string;
}

interface Props {
    stickyPosition: number;
    offset: number;
    widgetNameIds: Array<WidgetNameId>;
    activeWidgetId: string;
    onBottomOfThePage: Function;
    isTop: boolean;
    area: number;
    marginRight: number;
    displayTableOfContents: boolean;
    onClick?: Function;
}

function Navigation({
    stickyPosition,
    offset,
    widgetNameIds,
    activeWidgetId,
    onBottomOfThePage,
    isTop,
    area,
    displayTableOfContents,
    onClick,
    marginRight,
}: Props) {
    // forcefully highlight the last tab in table of contents when user reaches
    // the bottom of the page
    const handleScroll = () => {
        const isBottom =
            Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (isBottom && widgetNameIds.length) {
            onBottomOfThePage(widgetNameIds[widgetNameIds.length - 1].id);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollWithOffset = (el: HTMLElement) => {
        const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
        const yOffset = -offset;
        window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
    };

    const onClickHandler = (active: string) => {
        if (onClick) {
            onClick(active);
        }
    };

    if (!isTop) {
        return (
            <div
                className={`tablet:grid-col-${area}`}
                style={{
                    position: "sticky",
                    top: stickyPosition,
                    float: "right",
                    marginRight: `-${marginRight}%`,
                    borderLeft: "1px solid rgba(200, 200, 200, 1)",
                }}
                hidden={!displayTableOfContents}
            >
                <nav aria-label="Secondary navigation">
                    <ul
                        className="usa-sidenav"
                        style={{
                            fontSize: "0.9rem",
                            borderStyle: "none",
                            margin: "3.5em 0 3.5em 0",
                        }}
                    >
                        {widgetNameIds.map((widget) => {
                            return (
                                <li
                                    className={`usa-sidenav__item ${
                                        widget.id === activeWidgetId ? "usa-current" : ""
                                    }`}
                                    key={widget.id + "link"}
                                    style={{
                                        borderStyle: "none",
                                    }}
                                    onClick={() => onClickHandler(widget.id)}
                                >
                                    <NavHashLink
                                        to={
                                            "#" +
                                            (widget.isInsideSection && widget.sectionWithTabs
                                                ? widget.sectionWithTabs
                                                : widget.id)
                                        }
                                        scroll={(el) => scrollWithOffset(el)}
                                        style={{
                                            paddingLeft: widget.isInsideSection ? "32px" : "10px",
                                        }}
                                    >
                                        {widget.name}
                                    </NavHashLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        );
    } else {
        return (
            <nav aria-label="Secondary navigation" hidden={!displayTableOfContents}>
                <ul
                    className="usa-sidenav"
                    style={{
                        fontSize: "0.9rem",
                        borderStyle: "none",
                        marginLeft: 0,
                    }}
                >
                    {widgetNameIds.map((widget) => {
                        return (
                            <li
                                className={`usa-sidenav__item ${
                                    widget.id === activeWidgetId ? "usa-current" : ""
                                }`}
                                key={widget.id + "link"}
                                style={{
                                    borderStyle: "none",
                                }}
                                onClick={() => onClickHandler(widget.id)}
                            >
                                <NavHashLink
                                    to={
                                        "#" +
                                        (widget.isInsideSection && widget.sectionWithTabs
                                            ? widget.sectionWithTabs
                                            : widget.id)
                                    }
                                    scroll={(el) => scrollWithOffset(el)}
                                    style={{
                                        paddingLeft: widget.isInsideSection ? "36px" : "16px",
                                    }}
                                >
                                    {widget.name}
                                </NavHashLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }
}

export default Navigation;
