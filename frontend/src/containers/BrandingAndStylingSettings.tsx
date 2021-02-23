import React from "react";
import { useHistory } from "react-router-dom";
import SettingsLayout from "../layouts/Settings";
import Button from "../components/Button";
import AlertContainer from "./AlertContainer";
import "./PublishingGuidanceSettings.css";
import Logo from "../components/Logo";
import { useSettings } from "../hooks";
import Spinner from "../components/Spinner";

function BrandingAndStylingSettings() {
  const history = useHistory();
  const { settings } = useSettings(true);

  const onEditLogo = () => {
    history.push("/admin/settings/brandingandstyling/editlogo");
  };

  const onEditColors = () => {
    history.push("/admin/settings/brandingandstyling/editcolors");
  };

  return (
    <SettingsLayout>
      <h1>Branding and styling</h1>

      <p>Customize your performance dashboard.</p>
      <br></br>

      <AlertContainer />

      <h3 className="margin-top-2-important">Logo</h3>
      <p>
        This logo will appear in the header next to the performance dashboard
        name and in the published site header.
      </p>
      <br />

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-1 text-left">
          <Logo />
        </div>
        <div className="grid-col flex-9 padding-left-3">
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onEditLogo}
          >
            Edit
          </Button>
        </div>
      </div>

      <h3 className="margin-top-2-important">Colors</h3>
      <p>
        Customize these colors to make your dashboards appear similar in style
        to your organization's brand and color palette.
      </p>
      <br />

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-1 text-left">
          <div className="text-bold grid-col flex-1 text-left">
            Primary color
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
            <Spinner className="margin-top-3 text-center" label="Loading" />
          )}
        </div>
        <div className="grid-col flex-3 grid-col flex-3 text-right">
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onEditColors}
          >
            Edit
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
}

export default BrandingAndStylingSettings;
