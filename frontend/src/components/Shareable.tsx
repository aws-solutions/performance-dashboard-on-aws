import React, { ReactNode, useEffect, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Utils from "../services/UtilsService";
import styles from "./Shareable.module.scss";

interface Props {
  children: ReactNode | string;
  id: string;
  title: string;
  className?: string;
}

function Shareable(props: Props) {
  const history = useHistory();
  const { t } = useTranslation();
  const { pathname, hash, key } = useLocation();

  const shortId = Utils.getShorterId(props.id);
  const anchorId = `section-${shortId}`;

  function scrollElementIntoView(element: HTMLElement | null) {
    if (element) {
      element.scrollIntoView({ block: "start", behavior: "smooth" });
      const top = element.getBoundingClientRect().top;
      if (top <= 0 && top >= window.innerHeight) {
        setTimeout(() => scrollElementIntoView(element), 100);
      }
    }
  }

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === `#${anchorId}`) {
      const element = document.getElementById(anchorId);
      setTimeout(() => {
        scrollElementIntoView(element);
      }, 500);
      setTimeout(() => {
        scrollElementIntoView(element);
      }, 1000);
    }
  }, [pathname, hash, key, anchorId]);

  function getWidgetUrl() {
    const widgetUrl = `${window.location.href.replace(
      window.location.hash,
      ""
    )}#${anchorId}`;
    return widgetUrl;
  }

  function copyWidgetUrlToClipboard(event: MouseEvent) {
    navigator.clipboard.writeText(getWidgetUrl());
    history.replace(window.location.pathname, {
      alert: {
        type: "success",
        message: t("LinkCopied", { title: props.title }),
      },
    });
    event.preventDefault();
  }

  return (
    <div className={`${styles.shareableContainer} ${props.className ?? ""}`}>
      <span id={anchorId} className={styles.anchor}></span>
      <a
        className={`text-base-darker ${styles.shareButton}`}
        onClick={copyWidgetUrlToClipboard}
        href={getWidgetUrl()}
        aria-label={t("CopyLink", { title: props.title })}
        tabIndex={0}
      >
        <FontAwesomeIcon icon={faLink} />
      </a>
      <div className="shareable-content">{props.children}</div>
    </div>
  );
}

export default Shareable;
