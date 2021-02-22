import React from "react";
import { useHistory } from "react-router-dom";
import { useSettings, useLogo } from "../hooks";
import SettingsLayout from "../layouts/Settings";
import Button from "../components/Button";
import AlertContainer from "./AlertContainer";
import Spinner from "../components/Spinner";
import "./PublishingGuidanceSettings.css";
import Logo from "../components/Logo";

function BrandingAndStylingSettings() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const { logo, loadingFile } = useLogo(settings.customLogoS3ID);
  console.log(settings.customLogoS3ID);

  const onEdit = () => {
    history.push("/admin/settings/brandingandstyling/editlogo");
  };

  return (
    <SettingsLayout>
      <h1>Branding and styling</h1>

      <p>Customize your performance dashboard.</p>
      <br></br>

      <AlertContainer />

      {loadingSettings || loadingFile ? (
        <Spinner className="margin-top-3 text-center" label="Loading" />
      ) : (
        <>
          <h3 className="margin-top-2-important">Logo</h3>
          <p>
            This logo will appear in the header next to the performance
            dashboard name and in the published site header.
          </p>

          <br></br>

          <div className="grid-row margin-top-0-important">
            <div className="grid-col flex-1 text-left">
              <Logo />
            </div>
            <div className="grid-col flex-9">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                className="margin-top-2"
                variant="outline"
                onClick={onEdit}
              >
                Edit
              </Button>
            </div>
          </div>
        </>
      )}
    </SettingsLayout>
  );
}

export default BrandingAndStylingSettings;
