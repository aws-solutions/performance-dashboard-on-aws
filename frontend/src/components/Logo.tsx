import React from "react";
import { useSettings, useLogo } from "../hooks";
import defaultLogo from "../logo.svg";

function Logo() {
  const { settings, loadingSettings } = useSettings();
  const { logo, loadingFile } = useLogo(settings.customLogoS3Key);

  return (
    <>
      {loadingFile || loadingSettings ? (
        <div />
      ) : (
        <>
          <img
            src={logo ? URL.createObjectURL(logo) : defaultLogo}
            alt="Organization logo"
          ></img>
        </>
      )}
    </>
  );
}

export default Logo;
