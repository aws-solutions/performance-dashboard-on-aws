import React from "react";
import { useSettings, useFavicon } from "../hooks";
import defaultFavicon from "../favicon.svg";
import { useTranslation } from "react-i18next";

function Favicon() {
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings();
  const { favicon, loadingFile } = useFavicon(settings.customFaviconS3Key);

  return (
    <>
      {loadingFile || loadingSettings ? (
        <div />
      ) : (
        <>
          <img
            src={favicon ? URL.createObjectURL(favicon) : defaultFavicon}
            alt={t("OrganizationFavicon")}
          ></img>
        </>
      )}
    </>
  );
}

export default Favicon;
