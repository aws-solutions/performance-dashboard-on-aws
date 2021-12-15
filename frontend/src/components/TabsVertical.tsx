import React, { useEffect, useState, KeyboardEvent } from "react";
import TabVertical from "./TabVertical";

interface Props {
  children: React.ReactNode;
  defaultActive: string;
  activeColor?: string;
  container?: string;
}

function TabsVertical(props: Props) {
  const [activeTab, setActiveTab] = useState<string>(props.defaultActive);
  const tabsMap = new Map<number, string>();

  useEffect(() => {
    setActiveTab(props.defaultActive);
  }, [props.defaultActive]);

  function getActiveTabIndex(): number {
    let index = 0;
    tabsMap.forEach((value: string, key: number) => {
      if (value === activeTab) {
        index = key;
        return;
      }
    });
    return index;
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    console.log(e.key);
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
      >
        {React.Children.map(props.children, (child: any, index) => {
          tabsMap.set(index, child.props.id);
          return (
            <TabVertical
              aria-controls={child.props.id}
              id={child.props.id}
              itemId={child.props.id}
              activeTab={activeTab}
              key={child.props.id}
              label={child.props.label}
              onClick={onClickTabItem}
              onEnter={onEnterTabItem}
              activeColor={props.activeColor}
              container={props.container}
            />
          );
        })}
      </ol>
      <div className="grid-col-10 tab-content padding-left-4" role="tabpanel">
        {React.Children.map(props.children, (child) => {
          if ((child as any).props.id !== activeTab) return undefined;
          return (child as any).props.children;
        })}
      </div>
    </div>
  );
}

export default TabsVertical;
