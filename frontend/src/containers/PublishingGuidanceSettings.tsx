import React from "react";
import { useHistory } from "react-router-dom";
import { useSettings } from "../hooks";
import SettingsLayout from "../layouts/Settings";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import Spinner from "../components/Spinner";
import "./PublishingGuidanceSettings.css";
import { useTranslation } from "react-i18next";

function PublishingGuidanceSettings() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const { t } = useTranslation();

  const onEdit = () => {
    history.push("/admin/settings/publishingguidance/edit");
  };

  return (
    <SettingsLayout>
      <h1>{t("PublishingGuidance")}</h1>

      <p>{t("PublishingGuidanceDescription")}</p>

      {loadingSettings ? (
        <Spinner
          className="margin-top-3 text-center"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <>
          <div className="grid-row margin-top-0-important">
            <div className="grid-col flex-9">
              <p className="text-bold">{t("AcknowledgeStatement")}</p>
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
              <div className="publishing-guidance font-sans-lg">
                <MarkdownRender source={settings.publishingGuidance} />
              </div>
            </div>
            <div className="grid-col flex-3 text-right"></div>
          </div>
        </>
      )}
    </SettingsLayout>
  );
}

export default PublishingGuidanceSettings;
