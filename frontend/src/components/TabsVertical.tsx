import React, { useState } from "react";
import TabVertical from "./TabVertical";

interface Props {
  children: React.ReactNode;
  defaultActive: string;
  activeColor?: string;
}

function TabsVertical(props: Props) {
  const [activeTab, setActiveTab] = useState<string>(props.defaultActive);

  const onClickTabItem = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs grid-row">
      <ol className="grid-col-2 padding-left-0">
        {React.Children.map(props.children, (child) => {
          return (
            <TabVertical
              id={(child as any).props.id}
              activeTab={activeTab}
              key={(child as any).props.id}
              label={(child as any).props.label}
              onClick={onClickTabItem}
              activeColor={props.activeColor}
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
