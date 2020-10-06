import React, { useState } from "react";
import Tab from "./Tab";

interface Props {
  children: Array<any>;
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
        {props.children.map((child) => {
          return (
            <Tab
              activeTab={activeTab}
              key={child.props.label}
              label={child.props.label}
              onClick={onClickTabItem}
            />
          );
        })}
      </ol>
      <div className="tab-content">
        {props.children.map((child) => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
}

export default Tabs;
