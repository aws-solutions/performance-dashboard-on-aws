import React from "react";
<<<<<<< HEAD
import "./Tab.css";
=======
>>>>>>> d4f0481e73a92bcfa412727851bf2babdd7df514

interface Props {
  activeTab: string;
  label: string;
  onClick: Function;
}

function Tab(props: Props) {
  const onClick = () => {
    props.onClick(props.label);
  };

  let className =
    "display-inline-block padding-x-2 padding-y-105 text-bold font-sans-md";

  if (props.activeTab === props.label) {
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
