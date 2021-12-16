import React, { MouseEvent } from "react";
import { useTranslation } from "react-i18next";

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

function TabVertical(props: Props) {
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
    "display-block border-base-lighter border-y padding-x-2 padding-y-105 text-bold font-sans-md margin-bottom-neg-1px";

  let ariaLabelStr = `${props.container} ${t("Tab")} ${
    props.label.split("(")[0]
  }`;

  if (props.activeTab === props.id) {
    className += " bg-white border-left-05 padding-left-105-important";
    ariaLabelStr = `${t("Active")} ${ariaLabelStr}`;
  }

  return (
    <li
      role="tab"
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label={ariaLabelStr}
      style={{
        cursor: "pointer",
        borderLeftColor:
          props.activeTab === props.id
            ? props.activeColor
              ? `${props.activeColor}`
              : "#565c65"
            : "#dfe1e2",
      }}
    >
      {props.label}
    </li>
  );
}

export default TabVertical;
