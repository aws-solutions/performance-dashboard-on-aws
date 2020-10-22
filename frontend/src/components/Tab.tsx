import React from "react";
import "./Tab.css";

interface Props {
  id: string;
  activeTab: string;
  label: string;
  onClick: Function;
}

function Tab(props: Props) {
  const onClick = () => {
    props.onClick(props.id);
  };

  let className =
    "display-inline-block padding-x-2 padding-y-105 text-bold font-sans-md";

  if (props.activeTab === props.id) {
    className +=
      " bg-white border-base-dark border-x-0 border-top-0 border-bottom-05";
  }

  return (
    <li className={className} onClick={onClick}>
      {props.label}
    </li>
  );
}

export default Tab;
