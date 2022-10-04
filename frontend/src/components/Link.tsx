import React, { ReactNode } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import "./Link.scss";
import { useTranslation } from "react-i18next";

interface Props {
  children: ReactNode | string;
  to: string | object;
  target?: string;
  ariaLabel?: string;
  external?: boolean;
}

function Link(props: Props) {
  const { t } = useTranslation();

  return (
    <ReactRouterLink
      target={props.target || ""}
      to={props.to}
      className="usa-link action-link"
      aria-label={props.ariaLabel}
    >
      <span>{props.children}</span>
      {props.external && (
        <FontAwesomeIcon
          icon={faExternalLinkAlt}
          className="margin-left-05"
          size="xs"
          aria-label={t("ARIA.OpenInNewTab")}
          aria-hidden={false}
        />
      )}
    </ReactRouterLink>
  );
}

export default Link;
