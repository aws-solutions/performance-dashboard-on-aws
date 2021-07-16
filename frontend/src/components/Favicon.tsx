import React, { useState, useRef, useEffect } from "react";
import { useSettings, useFavicon } from "../hooks";
import defaultFavicon from "../favicon.svg";
import { useTranslation } from "react-i18next";

function Favicon() {
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings();
  const { favicon, loadingFile } = useFavicon(settings.customFaviconS3Key);
  const [toHide, setToHide] = useState<boolean>(true);

  // firstUpdate stops useEffect from executing after the first render
  // secondUpdate stops useEffect from executing when file starts loading
  const firstUpdate = useRef(true);
  const secondUpdate = useRef(true);
  useEffect(() => {
    if (secondUpdate.current) {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      secondUpdate.current = false;
      return;
    }
    setToHide(false);
  }, [loadingFile]);

  return (
    <>
      {loadingFile || loadingSettings ? (
        <div />
      ) : (
        <>
          <img
            src={favicon ? URL.createObjectURL(favicon) : defaultFavicon}
            alt={t("OrganizationFavicon")}
            hidden={toHide}
          ></img>
        </>
      )}
    </>
  );
}

export default Favicon;
