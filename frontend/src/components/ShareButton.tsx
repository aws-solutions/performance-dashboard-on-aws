import React, { useEffect, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ShareButton.module.scss";
import Button from "./Button";

interface Props {
  id: string;
  title: string;
  className?: string;
  size?:
    | "xs"
    | "lg"
    | "sm"
    | "1x"
    | "2x"
    | "3x"
    | "4x"
    | "5x"
    | "6x"
    | "7x"
    | "8x"
    | "9x"
    | "10x";
}

const scrollElementIntoView = (element: HTMLElement | null) => {
  if (element) {
    element.scrollIntoView({ block: "start", behavior: "smooth" });
    const top = element.getBoundingClientRect().top;
    if (top <= 0 && top >= window.innerHeight) {
      setTimeout(() => scrollElementIntoView(element), 100);
    }
  }
};

function ShareButton(props: Props) {
  const history = useHistory();
  const { t } = useTranslation();
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === `#${props.id}`) {
      const element = document.getElementById(props.id);
      setTimeout(() => {
        scrollElementIntoView(element);
      }, 500);
      setTimeout(() => {
        scrollElementIntoView(element);
      }, 1000);
    }
  }, [pathname, hash, key, props.id]);

  function getWidgetUrl() {
    const widgetUrl = `${window.location.href.replace(
      window.location.hash,
      ""
    )}#${props.id}`;
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
    <>
      <Button
        variant="unstyled"
        className={`text-base-darker ${styles.shareButton} ${props.className}`}
        onClick={copyWidgetUrlToClipboard}
        ariaLabel={t("CopyLink", { title: props.title })}
      >
        <FontAwesomeIcon icon={faLink} size={props.size} />
      </Button>
      <span id={props.id} className={styles.anchor}></span>
    </>
  );
}

export default ShareButton;
