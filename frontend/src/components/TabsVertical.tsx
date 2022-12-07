/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, KeyboardEvent } from "react";
import TabVertical from "./TabVertical";

interface Props {
  children: React.ReactNode;
  defaultActive: string;
  ariaLabelledById: string;
}

function TabsVertical(props: Props) {
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
    if (e.key === "ArrowDown") {
      const index = getActiveTabIndex();
      if (index < tabsMap.size - 1) {
        setActiveTab(tabsMap.get(index + 1) || props.defaultActive);
      }
    } else if (e.key === "ArrowUp") {
      const index = getActiveTabIndex();
      if (index > 0) {
        setActiveTab(tabsMap.get(index - 1) || props.defaultActive);
      }
    }
  };

  const onClickTabItem = (tab: string, currentTab: HTMLElement) => {
    setActiveTab(tab);
  };

  const onEnterTabItem = (tab: string, currentTab: HTMLElement) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs grid-row">
      <ol
        className="grid-col-2 padding-left-0"
        onKeyDown={onKeyDown}
        role="tablist"
        aria-orientation="vertical"
        aria-labelledbyid={props.ariaLabelledById}
      >
        {React.Children.map(props.children, (child: any, index) => {
          tabsMap.set(index, child.props.id);
          return (
            <TabVertical
              itemId={child.props.id}
              activeTab={activeTab}
              key={child.props.id}
              label={child.props.label}
              onClick={onClickTabItem}
              onEnter={onEnterTabItem}
            />
          );
        })}
      </ol>

      {React.Children.map(props.children, (child) => {
        const childId = (child as any).props.id;
        if (childId !== activeTab) {
          return <div id={`${childId}-panel`} role="tabpanel"></div>;
        }
        return (
          <div
            id={`${childId}-panel`}
            className="grid-col-10 tab-content padding-left-4"
            role="tabpanel"
            tabIndex={0}
            aria-labelledbyid={`${childId}-tab`}
          >
            {(child as any).props.children}
          </div>
        );
      })}
    </div>
  );
}

export default TabsVertical;
