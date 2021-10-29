import React, { MouseEvent } from "react";

interface Props {
  id: string;
  itemId: string;
  activeTab: string;
  label: string;
  onClick: Function;
  onEnter: Function;
  activeColor?: string;
}

function Tab(props: Props) {
  const onClick = (e: MouseEvent<HTMLElement>) => {
    props.onClick(props.id, e.currentTarget);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      props.onEnter(props.id, e.currentTarget);
    }
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
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label={
        props.activeTab === props.id
          ? "Active Dashboard Tab " + props.label.split("(")[0]
          : "Dashboard Tab " + props.label.split("(")[0]
      }
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
