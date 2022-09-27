import React, { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import styles from "./TabVertical.module.scss";

interface Props {
  itemId: string;
  activeTab: string;
  label: string;
  onClick: Function;
  onEnter: Function;
}

function TabVertical(props: Props) {
  const { t } = useTranslation();
  const onClick = (e: MouseEvent<HTMLElement>) => {
    props.onClick(props.itemId, e.currentTarget);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      props.onEnter(props.itemId, e.currentTarget);
    }
  };

  let className = `${styles.tab} display-block border-y padding-x-2 padding-y-105 text-bold font-sans-md margin-bottom-neg-1px`;

  let ariaLabelStr = `${t("Tab")} ${props.label.split("(")[0]}`;

  if (props.activeTab === props.itemId) {
    className += ` bg-white border-left-05 padding-left-105-important border-base-darker`;
    ariaLabelStr = `${t("Active")} ${ariaLabelStr}`;
  } else {
    className += ` border-base-lighter`;
  }

  return (
    <li
      id={`${props.itemId}-tab`}
      aria-label={ariaLabelStr}
      aria-controls={`${props.itemId}-panel`}
      aria-selected={props.activeTab === props.itemId}
      role="tab"
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {props.label}
    </li>
  );
}

export default TabVertical;
