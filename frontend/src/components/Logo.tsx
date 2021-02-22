import React from "react";
import { useSettings, useLogo } from "../hooks";
import defaultLogo from "../logo.svg";

const Logo = () => {
  const { settings } = useSettings();
  const { logo } = useLogo(settings.customLogoS3ID);

  return <img src={logo ? URL.createObjectURL(logo) : defaultLogo}></img>;
};

export default Logo;
