import React from "react";
import { useHistory } from "react-router-dom";
import { useSettings } from "../hooks";
import dayjs from "dayjs";
import SettingsLayout from "../layouts/Settings";
import Button from "../components/Button";
import AlertContainer from "./AlertContainer";
import Spinner from "../components/Spinner";
import "./PublishedSiteSettings.css";

function DateFormatSettings() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();

  const onEdit = () => {
    history.push("/admin/settings/dateformat/edit");
  };

  return (
    <SettingsLayout>
      <h1>Date and time format</h1>

      <p>
        Customize how your performance dashboard displays date and time in the
        user interface.
      </p>

      <AlertContainer />

      {loadingSettings ? (
        <Spinner
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
          }}
          label="Loading"
        />
      ) : (
        <>
          <div className="grid-row margin-top-0-important">
            <div className="grid-col flex-9">
              <p className="text-bold">Date format</p>
            </div>
            <div className="grid-col flex-3 text-right">
              <Button
                className="margin-top-2"
                variant="outline"
                onClick={onEdit}
              >
                Edit
              </Button>
            </div>
          </div>

          <div className="grid-row margin-top-0-important">
            <div className="grid-col flex-9">
              <div className="published-site font-sans-lg">
                {dayjs().format(settings.dateTimeFormat.date)} (
                {settings.dateTimeFormat.date})
              </div>
              <div className="grid-col flex-9">
                <p className="text-bold">Time format</p>
              </div>
              <div className="font-sans-lg">
                {dayjs().format(settings.dateTimeFormat.time)} (
                {settings.dateTimeFormat.time})
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
