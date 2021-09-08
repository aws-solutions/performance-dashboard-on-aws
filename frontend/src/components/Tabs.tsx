import React, { useState } from "react";
import Tab from "./Tab";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from "./Arrows";

interface Props {
  children: React.ReactNode;
  defaultActive: string;
  showArrows?: boolean;
}

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

function Tabs(props: Props) {
  const [activeTab, setActiveTab] = useState<string>(props.defaultActive);

  const onClickTabItem = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs">
      <ScrollMenu
        LeftArrow={props.showArrows && LeftArrow}
        RightArrow={props.showArrows && RightArrow}
        onWheel={onWheel}
        wrapperClassName="border-base-lighter border-bottom margin-top-1"
      >
        {React.Children.map(props.children, (child) => {
          return (
            <Tab
              id={(child as any).props.id}
              itemId={(child as any).props.id}
              activeTab={activeTab}
              key={(child as any).props.id}
              label={(child as any).props.label}
              onClick={onClickTabItem}
              activeColor={props.activeColor}
            />
          );
        })}
      </ScrollMenu>
      <div className="tab-content">
        {React.Children.map(props.children, (child) => {
          if ((child as any).props.id !== activeTab) return undefined;
          return (child as any).props.children;
        })}
      </div>
    </div>
  );
}

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
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
