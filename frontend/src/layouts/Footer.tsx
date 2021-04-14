import React from "react";
import packagejson from "../../package.json";
import { useSettings } from "../hooks";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";

function Footer() {
  const { settings, loadingSettings } = useSettings();
  const { t } = useTranslation();

  return (
    <footer>
      <div className="grid-container margin-bottom-9 text-base font-sans-sm">
        {loadingSettings ? (
          <Spinner
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
            }}
            label={t("LoadingSpinnerLabel")}
          />
        ) : (
          <>
            <hr className="margin-top-9 border-base-lightest" />
            Having technical issues with the system?{" "}
            <a
              href={`mailto:${settings.adminContactEmailAddress}?subject=Performance Dashboard Assistance`}
              className="text-base"
            >
              Contact support
            </a>
            <span className="float-right">v{packagejson.version}</span>
          </>
        )}
      </div>
    </footer>
  );
}

export default Footer;
