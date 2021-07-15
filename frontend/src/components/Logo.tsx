import React, { useState, useRef, useEffect } from "react";
import { useSettings, useLogo, useFileLoaded } from "../hooks";
import defaultLogo from "../logo.svg";
import { useTranslation } from "react-i18next";

function Logo() {
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings();
  const { logo, loadingFile } = useLogo(settings.customLogoS3Key);
  const [toHide, setToHide] = useState<boolean>(true);

  useFileLoaded(setToHide, loadingFile);

  return (
    <>
      {loadingFile || loadingSettings || toHide ? (
        <div />
      ) : (
        <>
          <img
            src={logo ? URL.createObjectURL(logo) : defaultLogo}
            alt={t("OrganizationLogo")}
          ></img>
        </>
      )}
    </>
  );
}

export default Logo;
