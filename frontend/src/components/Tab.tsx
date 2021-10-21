import React, { MouseEvent } from "react";
interface Props {
  id: string;
  itemId: string;
  activeTab: string;
  label: string;
  onClick: Function;
  activeColor?: string;
}

function Tab(props: Props) {
  const onClick = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const wrapper = e.currentTarget?.closest(
      ".react-horizontal-scrolling-menu--wrapper"
    );
    if (rect && wrapper) {
      const wrapperRect = wrapper.getBoundingClientRect();
      if (rect.left < wrapperRect.left) {
        wrapper.querySelector<HTMLElement>("button:first-child")?.click();
      } else {
        const shownWidth = wrapperRect.right - rect.left;
        if (shownWidth < rect.width) {
          wrapper.querySelector<HTMLElement>("button:last-child")?.click();
        }
      }
      console.log({
        left: rect.left,
        right: rect.right,
      });
      console.log({
        left: wrapperRect.left,
        right: wrapperRect.right,
      });
    }
    props.onClick(props.id);
  };

  let className =
    "display-inline-block padding-x-2 padding-y-105 text-bold font-sans-md";

  if (props.activeTab === props.id) {
    className += " border-base-dark border-x-0 border-top-0 border-bottom-05";
  }

  return (
    <li
      className={className}
      onClick={onClick}
      style={{
        cursor: "pointer",
        whiteSpace: "nowrap",
        borderColor: `${props.activeColor}`,
      }}
    >
      {props.label}
    </li>
  );
}

export default Tab;
