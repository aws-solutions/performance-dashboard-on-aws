import React, { useState } from "react";
import { useSettings, useFavicon, useFileLoaded } from "../hooks";
import defaultFavicon from "../favicon.svg";
import { useTranslation } from "react-i18next";

function Favicon() {
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings();
  const { favicon, loadingFile } = useFavicon(settings.customFaviconS3Key);
  const [toHide, setToHide] = useState<boolean>(true);

  useFileLoaded(setToHide, loadingFile);

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
