import React, { ReactNode, useEffect, MouseEvent, ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import "./Shareable.scss";
import { useHistory, useLocation } from "react-router-dom";
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
  const { pathname, hash, key, state } = useLocation();

  const shortId = props.id.substring(0, 8);
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
    console.log(window.location.href);
    console.log(window.location.href.replace(window.location.hash, ""));
    history.replace(window.location.pathname, {
      alert: {
        type: "success",
        message: t("LinkCopied", { title: props.title }),
      },
    });
    event.preventDefault();
  }

  return (
    <div className={`shareable-container ${props.className}`}>
      <span id={anchorId} className="anchor"></span>
      <a
        className="share-button text-base-darker"
        onClick={copyWidgetUrlToClipboard}
        href={getWidgetUrl()}
        aria-label={t("CopyLink", { title: props.title })}
      >
        <FontAwesomeIcon icon={faLink} />
      </a>
      <div className="shareable-content">{props.children}</div>
    </div>
  );
}

export default Shareable;
