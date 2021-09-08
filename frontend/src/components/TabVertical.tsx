import React from "react";

interface Props {
  id: string;
  activeTab: string;
  label: string;
  onClick: Function;
}

function TabVertical(props: Props) {
  const onClick = () => {
    props.onClick(props.id);
  };

  let className =
    "display-block border-base-lighter border-y padding-x-2 padding-y-105 text-bold font-sans-md margin-bottom-neg-1px";

  if (props.activeTab === props.id) {
    className += " bg-white border-left-05 padding-left-105-important";
  }

  return (
    <li
      className={className}
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderLeftColor: props.activeTab === props.id ? "#565c65" : "#dfe1e2",
      }}
    >
      {props.label}
    </li>
  );
}

export default TabVertical;
