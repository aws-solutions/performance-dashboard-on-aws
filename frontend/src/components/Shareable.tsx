import React, { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import "./Shareable.scss";
import Button from "./Button";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  children: ReactNode | string;
  id: string;
  title: string;
  className?: string;
}

function Shareable(props: Props) {
  const history = useHistory();
  const { t } = useTranslation();

  function getAnchorId() {
    return `section-${getShortId()}`;
  }

  function getShortId() {
    return props.id.substring(0, 8);
  }

  function getWidgetUrl() {
    const widgetUrl = `${window.location.href.replace(
      window.location.hash,
      ""
    )}#${getAnchorId()}`;
    return widgetUrl;
  }
  function copyWidgetUrlToClipboard() {
    navigator.clipboard.writeText(getWidgetUrl());
    history.replace(`${history.location.pathname}#${getAnchorId()}`, {
      alert: {
        type: "success",
        message: t("LinkCopied", { title: props.title }),
      },
    });
  }

  return (
    <div className={`shareable-container ${props.className}`}>
      <span id={getAnchorId()} className="anchor"></span>
      <Button
        className="share-button"
        variant="unstyled"
        onClick={copyWidgetUrlToClipboard}
        ariaLabel={t("CopyLink", { title: props.title })}
      >
        <FontAwesomeIcon icon={faLink} />
      </Button>
      <div className="shareable-content">{props.children}</div>
    </div>
  );
}

export default Shareable;
