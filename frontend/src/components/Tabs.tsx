/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, KeyboardEvent } from "react";
import Tab from "./Tab";
import { ScrollMenu, type publicApiType } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from "./Arrows";

interface Props {
    children: React.ReactNode;
    defaultActive: string;
    showArrows?: boolean;
    ariaLabelledById: string;
}

function Tabs(props: Props) {
    const [scrollMenuObj, setScrollMenuObj] = useState<publicApiType>();
    const [activeTab, setActiveTab] = useState<string>(props.defaultActive);
    const tabsMap = new Map<number, string>();

    useEffect(() => {
        setActiveTab(props.defaultActive);
    }, [props.defaultActive]);

    function getActiveTabIndex(): number {
        for (let [key, value] of Array.from(tabsMap.entries())) {
            if (value === activeTab) {
                return key;
            }
        }
        return 0;
    }

    const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "ArrowRight") {
            const index = getActiveTabIndex();
            if (index < tabsMap.size - 1) {
                setActiveTab(tabsMap.get(index + 1) || props.defaultActive);
            }
        } else if (e.key === "ArrowLeft") {
            const index = getActiveTabIndex();
            if (index > 0) {
                setActiveTab(tabsMap.get(index - 1) || props.defaultActive);
            }
        }
    };

    const activateTabItem = React.useCallback(
        (tab: string, currentTab: HTMLElement) => {
            const rect = currentTab.getBoundingClientRect();
            const wrapper = scrollMenuObj?.scrollContainer?.current;

            if (rect && wrapper) {
                const wrapperRect = wrapper.getBoundingClientRect();
                if (rect.left < wrapperRect.left) {
                    scrollMenuObj?.scrollPrev();
                } else {
                    const shownWidth = wrapperRect.right - rect.left;
                    if (shownWidth < rect.width) {
                        scrollMenuObj?.scrollNext();
                    }
                }
            }
            setActiveTab(tab);
        },
        [scrollMenuObj],
    );

    return (
        <div
            className="tabs"
            onKeyDown={onKeyDown}
            role="tablist"
            aria-labelledbyid={props.ariaLabelledById}
        >
            <ScrollMenu
                LeftArrow={props.showArrows && LeftArrow}
                RightArrow={props.showArrows && RightArrow}
                onInit={setScrollMenuObj}
                onWheel={onWheel}
                wrapperClassName="border-base-lighter border-bottom margin-top-1"
            >
                {React.Children.map(props.children, (child: any, index) => {
                    tabsMap.set(index, child.props.id);
                    return (
                        <Tab
                            itemId={child.props.id}
                            activeTab={activeTab}
                            key={child.props.id}
                            label={child.props.label}
                            onClick={activateTabItem}
                            onEnter={activateTabItem}
                        />
                    );
                })}
            </ScrollMenu>

            {React.Children.map(props.children, (child) => {
                const childId = (child as JSX.Element).props.id;
                const id = `${childId}-panel`;
                const role = "tabpanel";

                if (childId !== activeTab) {
                    return <div id={id} role={role}></div>;
                }
                return (
                    <div
                        id={id}
                        className="tab-content"
                        role={role}
                        tabIndex={0}
                        aria-labelledbyid={`${childId}-tab`}
                    >
                        {(child as JSX.Element).props.children}
                    </div>
                );
            })}
        </div>
    );
}

function onWheel(apiObj: publicApiType, ev: React.WheelEvent): void {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
        ev.stopPropagation();
        return;
    }
    if (ev.deltaY < 0) {
        apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
        apiObj.scrollPrev();
    }
}

export default Tabs;
