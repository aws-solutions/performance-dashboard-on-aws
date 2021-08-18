import React, { useState } from "react";
import { useSettings, useFavicon, useFileLoaded } from "../hooks";
import defaultFavicon from "../favicon.svg";
import { useTranslation } from "react-i18next";

type Props = {
  forceShow: boolean;
  refetch: boolean;
};

function Favicon(props: Props) {
  const { t } = useTranslation();
  const { settings, loadingSettings } = useSettings(props.refetch);
  const { favicon, loadingFile } = useFavicon(settings.customFaviconS3Key);
  const [toHide, setToHide] = useState<boolean>(true);

  useFileLoaded(setToHide, loadingFile, loadingSettings, settings, "favicon");

  return (
    <>
      {loadingFile || loadingSettings ? (
        <div />
      ) : (
        <>
          <img
            src={favicon ? URL.createObjectURL(favicon) : defaultFavicon}
            alt={t("OrganizationFavicon")}
            hidden={toHide && !props.forceShow}
          ></img>
        </>
      )}
    </>
  );
}

export default Favicon;
