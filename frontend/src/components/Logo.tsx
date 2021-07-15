import React, { useState, useRef, useEffect } from "react";
import { useSettings, useLogo } from "../hooks";
import defaultLogo from "../logo.svg";
import { useTranslation } from "react-i18next";

function Logo() {
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings();
  const { logo, loadingFile } = useLogo(settings.customLogoS3Key);
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
