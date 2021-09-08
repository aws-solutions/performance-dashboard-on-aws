import React, { ReactNode, useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

function Arrow({
  children,
  disabled,
  onClick,
  className,
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
  className: string;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`usa-button--unstyled text-base-darker hover:text-base-darkest active:text-base-darkest ${
        className ? className : ""
      }`}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: disabled ? "0" : "1",
        userSelect: "none",
        textAlign: "center",
        width: "16px",
        marginRight: "4px",
        marginLeft: "4px",
      }}
    >
      {children}
    </button>
  );
}

export function LeftArrow() {
  const { initComplete, isFirstItemVisible, scrollPrev } =
    useContext(VisibilityContext);

  const [disabled, setDisabled] = useState(isFirstItemVisible);
  useEffect(() => {
    setDisabled(isFirstItemVisible);
  }, [isFirstItemVisible]);

  return (
    !disabled && (
      <Arrow
        disabled={!initComplete || (initComplete && isFirstItemVisible)}
        onClick={() => scrollPrev()}
        className="margin-right-2"
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          size="xs"
          className="margin-left-05"
        />
      </Arrow>
    )
  );
}

export function RightArrow() {
  const { initComplete, isLastItemVisible, scrollNext } =
    useContext(VisibilityContext);

  const [disabled, setDisabled] = useState(isLastItemVisible);
  useEffect(() => {
    setDisabled(isLastItemVisible);
  }, [isLastItemVisible]);

  return (
    !disabled && (
      <Arrow
        disabled={!initComplete || (initComplete && isLastItemVisible)}
        onClick={() => scrollNext()}
        className="margin-left-2"
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          size="xs"
          className="margin-left-05"
        />
      </Arrow>
    )
  );
}
