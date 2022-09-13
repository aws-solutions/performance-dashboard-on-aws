import React from "react";
import { useHistory } from "react-router-dom";
import { useSettings } from "../hooks";
import dayjs from "dayjs";
import SettingsLayout from "../layouts/Settings";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import "./PublishedSiteSettings.css";
import { useTranslation } from "react-i18next";

function DateFormatSettings() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const { t } = useTranslation();

  const onEdit = () => {
    history.push("/admin/settings/dateformat/edit");
  };

  return (
    <SettingsLayout>
      <h1>{t("SettingsDateTimeFormat")}</h1>

      <p>{t("SettingsDateTimeFormatDescription")}</p>

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
              <h2>{t("SettingsDateFormat")}</h2>
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
                {dayjs()
                  .locale(window.navigator.language.toLowerCase())
                  .format(settings.dateTimeFormat.date)}{" "}
                ({settings.dateTimeFormat.date})
              </div>
              <div className="grid-col flex-9">
                <h2>{t("SettingsTimeFormat")}</h2>
              </div>
              <div className="font-sans-lg">
                {dayjs()
                  .locale(window.navigator.language.toLowerCase())
                  .format(settings.dateTimeFormat.time)}{" "}
                ({settings.dateTimeFormat.time})
              </div>
            </div>
            <div className="grid-col flex-3 text-right"></div>
          </div>
        </>
      )}
    </SettingsLayout>
  );
}

export default DateFormatSettings;
