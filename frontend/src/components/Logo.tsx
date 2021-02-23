import React from "react";
import { useSettings, useLogo } from "../hooks";
import defaultLogo from "../logo.svg";
import Spinner from "../components/Spinner";

function Logo() {
  const { settings, loadingSettings } = useSettings();
  const { logo, loadingFile } = useLogo(settings.customLogoS3Key);

  return (
    <>
      {loadingFile || loadingSettings ? (
        <Spinner className="margin-top-3 text-center" label="Loading" />
      ) : (
        <>
          <img src={logo ? URL.createObjectURL(logo) : defaultLogo}></img>
        </>
      )}
    </>
  );
}

export default Logo;
