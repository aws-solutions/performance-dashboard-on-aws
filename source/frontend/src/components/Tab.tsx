import React, { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import "./Tab.scss";

interface Props {
  id: string;
  itemId: string;
  activeTab: string;
  label: string;
  onClick: Function;
  onEnter: Function;
  activeColor?: string;
  container?: string;
}

function Tab(props: Props) {
  const { t } = useTranslation();
  const onClick = (e: MouseEvent<HTMLElement>) => {
    props.onClick(props.id, e.currentTarget);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      props.onEnter(props.id, e.currentTarget);
    }
  };

  let className =
    "tab display-inline-block padding-x-2 padding-y-105 text-bold font-sans-md";

  let ariaLabelStr = `${props.container} ${t("Tab")} ${
    props.label.split("(")[0]
  }`;

  if (props.activeTab === props.id) {
    className += " tab-active ";
    ariaLabelStr = `${t("Active")} ${ariaLabelStr}`;
  }

  return (
    <div
      role="tab"
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label={ariaLabelStr}
      style={{
        cursor: "pointer",
        whiteSpace: "nowrap",
        borderColor: `${props.activeColor}`,
      }}
    >
      {props.label}
    </div>
  );
}

export default Tab;
