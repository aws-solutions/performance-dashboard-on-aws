import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SettingsLayout from "../layouts/Settings";
import Button from "../components/Button";
import "./PublishingGuidanceSettings.css";
import Logo from "../components/Logo";
import Favicon from "../components/Favicon";
import { useSettings } from "../hooks";
import Spinner from "../components/Spinner";

function BrandingAndStylingSettings() {
  const history = useHistory();
  const { settings } = useSettings();
  const { t } = useTranslation();

  const onEditLogo = () => {
    history.push("/admin/settings/brandingandstyling/editlogo");
  };

  const onEditFavicon = () => {
    history.push("/admin/settings/brandingandstyling/editfavicon");
  };

  const onEditColors = () => {
    history.push("/admin/settings/brandingandstyling/editcolors");
  };

  return (
    <SettingsLayout>
      <h1>{t("BrandingAndStyling")}</h1>

      <p>{t("BrandingAndStylingDescription")}</p>
      <br />

      <h3 className="margin-top-2-important">{t("BrandingAndStylingLogo")}</h3>
      <p>{t("BrandingAndStylingLogoDescription")}</p>
      <br />

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-1 text-left">
          <Logo />
        </div>
        <div className="grid-col flex-9 padding-left-3 text-right">
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onEditLogo}
          >
            {t("Edit")}
          </Button>
        </div>
      </div>

      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#dfe1e2",
          margin: "2rem 0",
        }}
      />

      <h3 className="margin-top-2-important">
        {t("BrandingAndStylingFavicon")}
      </h3>
      <p>{t("BrandingAndStylingFaviconDescription")}</p>
      <br />

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-1 text-left">
          <Favicon />
        </div>
        <div className="grid-col flex-9 padding-left-3 text-right">
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onEditFavicon}
          >
            {t("Edit")}
          </Button>
        </div>
      </div>

      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#dfe1e2",
          margin: "2rem 0",
        }}
      />

      <h3 className="margin-top-2-important">
        {t("BrandingAndStylingColors")}
      </h3>
      <p>{t("BrandingAndStylingColorsDescription")}</p>
      <br />

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-1 text-left">
          <div className="text-bold grid-col flex-1 text-left">
            {t("BrandingAndStylingPrimaryColor")}
          </div>
          {settings && settings.colors ? (
            <div className="grid-row margin-top-0-important">
              <div
                className="radius-md"
                style={{
                  backgroundColor: settings.colors.primary,
                  margin: "10px 0px",
                  width: 25,
                  height: 25,
                }}
              ></div>
              <div className="font-sans-lg grid-col flex-9 margin-left-1 margin-top-05">
                {settings.colors.primary}
              </div>
            </div>
          ) : (
            <Spinner
              className="margin-top-3 text-center"
              label={t("LoadingSpinnerLabel")}
            />
          )}
        </div>
        <div className="grid-col flex-3 grid-col flex-3 text-right">
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onEditColors}
          >
            {t("Edit")}
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
}

export default BrandingAndStylingSettings;
