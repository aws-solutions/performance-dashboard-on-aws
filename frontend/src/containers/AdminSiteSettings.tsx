import React from "react";
import { useHistory } from "react-router-dom";
import { useSettings } from "../hooks";
import dayjs from "dayjs";
import SettingsLayout from "../layouts/Settings";
import Button from "../components/Button";
import AlertContainer from "./AlertContainer";
import Spinner from "../components/Spinner";
import "./PublishedSiteSettings.css";
import { useTranslation } from "react-i18next";

function AdminSiteSettings() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const { t } = useTranslation();

  const onEdit = () => {
    history.push("/admin/settings/supportcontact/edit");
  };

  return (
    <SettingsLayout>
      <h1>{t("AdminSettingsScreen.Header")}</h1>

      <p>{t("AdminSettingsScreen.HeaderDescription")}</p>

      <AlertContainer />

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
          <div className="grid-row margin-top-0-important">
            <div className="grid-col flex-9">
              <p className="text-bold">
                {t("AdminSettingsScreen.SupportContactEmailAddress")}
              </p>
            </div>
            <div className="grid-col flex-3 text-right">
              <Button
                className="margin-top-2"
                variant="outline"
                onClick={onEdit}
              >
                {t("Edit")}
              </Button>
            </div>
          </div>

          <div className="grid-row margin-top-0-important">
            <div className="grid-col flex-9">
              <div className="published-site font-sans-lg">
                {settings.adminContactEmailAddress
                  ? settings.adminContactEmailAddress
                  : "-"}
              </div>
            </div>
            <div className="grid-col flex-3 text-right"></div>
          </div>
        </>
      )}
    </SettingsLayout>
  );
}

export default AdminSiteSettings;
