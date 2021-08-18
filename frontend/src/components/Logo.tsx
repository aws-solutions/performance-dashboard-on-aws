import React, { useState } from "react";
import { useSettings, useLogo, useFileLoaded } from "../hooks";
import defaultLogo from "../logo.svg";
import { useTranslation } from "react-i18next";

type Props = {
  forceShow: boolean;
  refetch: boolean;
};

function Logo(props: Props) {
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings(props.refetch);
  const { logo, loadingFile } = useLogo(settings.customLogoS3Key);
  const [toHide, setToHide] = useState<boolean>(true);

  useFileLoaded(setToHide, loadingFile, loadingSettings, settings, "logo");

  return (
    <>
      {loadingFile || loadingSettings ? (
        <div />
      ) : (
        <>
          <img
            src={logo ? URL.createObjectURL(logo) : defaultLogo}
            alt={t("OrganizationLogo")}
            hidden={toHide && !props.forceShow}
          ></img>
        </>
      )}
    </>
  );
}

export default Logo;
