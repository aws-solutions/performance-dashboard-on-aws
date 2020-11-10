import React, { ReactNode } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import "./Link.css";

interface Props {
  children: ReactNode;
  to: string | object;
  target?: string;
  ariaLabel?: string;
}

function Link(props: Props) {
  return (
    <ReactRouterLink
      target={props.target || ""}
      to={props.to}
      className="link"
      aria-label={props.ariaLabel || ""}
    >
      <span>{props.children}</span>
    </ReactRouterLink>
  );
}

export default Link;
