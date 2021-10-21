import React, { useState } from "react";
import { useSettings, useLogo, useFileLoaded } from "../hooks";
import defaultLogo from "../logo.svg";
import { useTranslation } from "react-i18next";

function Logo() {
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings();
  const { logo, loadingFile } = useLogo(settings.customLogoS3Key);
  const [toHide, setToHide] = useState<boolean>(true);

  let showLogo = false;
  if (settings.customLogoS3Key === undefined) {
    showLogo = true;
  }

  useFileLoaded(setToHide, loadingFile, loadingSettings, settings, "logo");

  return (
    <>
      {loadingFile || loadingSettings ? (
        <div />
      ) : (
        <>
          <img
            src={logo ? URL.createObjectURL(logo) : defaultLogo}
            alt={settings.customLogoAltText || t("OrganizationLogo")}
            hidden={toHide && !showLogo}
            data-testid="logoImage"
          ></img>
        </>
      )}
    </>
  );
}

export default Logo;
