import React, { useEffect, useState, KeyboardEvent } from "react";
import Tab from "./Tab";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from "./Arrows";

interface Props {
  children: React.ReactNode;
  defaultActive: string;
  ariaLabel: string;
  showArrows?: boolean;
}

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

function Tabs(props: Props) {
  const [scrollMenuObj, setScrollMenuObj] = useState<scrollVisibilityApiType>();
  const [activeTab, setActiveTab] = useState<string>(props.defaultActive);
  const tabsMap = new Map<number, string>();

  useEffect(() => {
    setActiveTab(props.defaultActive);
  }, [props.defaultActive]);

  const onClickTabItem = (tab: string, currentTab: HTMLElement) => {
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
  };

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

  const onEnterTabItem = (tab: string, currentTab: HTMLElement) => {
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
  };

  return (
    <div
      className="tabs"
      onKeyDown={onKeyDown}
      role="tablist"
      aria-label={props.ariaLabel}
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
              onClick={onClickTabItem}
              onEnter={onEnterTabItem}
            />
          );
        })}
      </ScrollMenu>

      {React.Children.map(props.children, (child) => {
        const childId = (child as any).props.id;
        if (childId !== activeTab) {
          return <div id={`${childId}-panel`} role="tabpanel"></div>;
        }
        return (
          <div id={`${childId}-panel`} className="tab-content" role="tabpanel">
            {(child as any).props.children}
          </div>
        );
      })}
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
