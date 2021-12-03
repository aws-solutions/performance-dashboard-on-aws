import React, { useEffect, useState } from "react";
import TabVertical from "./TabVertical";

interface Props {
  children: React.ReactNode;
  defaultActive: string;
  activeColor?: string;
  container?: string;
}

function TabsVertical(props: Props) {
  const [activeTab, setActiveTab] = useState<string>(props.defaultActive);

  useEffect(() => {
    setActiveTab(props.defaultActive);
  }, [props.defaultActive]);

  const onClickTabItem = (tab: string, currentTab: HTMLElement) => {
    setActiveTab(tab);
  };

  const onEnterTabItem = (tab: string, currentTab: HTMLElement) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs grid-row">
      <ol className="grid-col-2 padding-left-0">
        {React.Children.map(props.children, (child) => {
          return (
            <TabVertical
              id={(child as any).props.id}
              itemId={(child as any).props.id}
              activeTab={activeTab}
              key={(child as any).props.id}
              label={(child as any).props.label}
              onClick={onClickTabItem}
              onEnter={onEnterTabItem}
              activeColor={props.activeColor}
              container={props.container}
            />
          );
        })}
      </ol>
      <div className="grid-col-10 tab-content padding-left-4">
        {React.Children.map(props.children, (child) => {
          if ((child as any).props.id !== activeTab) return undefined;
          return (child as any).props.children;
        })}
      </div>
    </div>
  );
}

export default TabsVertical;
