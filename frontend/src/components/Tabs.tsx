import React, { useState } from "react";
import Tab from "./Tab";

interface Props {
  children: React.ReactNode;
  defaultActive: string;
}

function Tabs(props: Props) {
  const [activeTab, setActiveTab] = useState<string>(props.defaultActive);

  const onClickTabItem = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs">
      <ol className="border-base-lighter border-bottom padding-left-0">
        {React.Children.map(props.children, (child) => {
          return (
            <Tab
              activeTab={activeTab}
              key={(child as any).props.label}
              label={(child as any).props.label}
              onClick={onClickTabItem}
            />
          );
        })}
      </ol>
      <div className="tab-content">
        {React.Children.map(props.children, (child) => {
          if ((child as any).props.label !== activeTab) return undefined;
          return (child as any).props.children;
        })}
      </div>
    </div>
  );
}

export default Tabs;
