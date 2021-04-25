import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import dayjs from "dayjs";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import Dropdown from "../components/Dropdown";
import { useTranslation } from "react-i18next";

interface FormValues {
  dateFormat: string;
  timeFormat: string;
}

const timeFormats = ["HH:mm", "h:mm A"];
const dateFormats = [
  "YYYY-MM-DD",
  "MMMM D, YYYY",
  "D MMMM YYYY",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
];

function EditDateFormat() {
  const history = useHistory();
  const { settings, reloadSettings, loadingSettings } = useSettings(true);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { t } = useTranslation();

  useEffect(() => {
    // Reset the form values when the newly fetched Settings
    // come back from the backend.
    reset({
      dateFormat: settings.dateTimeFormat.date,
      timeFormat: settings.dateTimeFormat.time,
    });
  }, [reset, settings]);

  const onSubmit = async (values: FormValues) => {
    const dateTimeFormat = {
      date: values.dateFormat,
      time: values.timeFormat,
    };

    await BackendService.updateSetting(
      "dateTimeFormat",
      dateTimeFormat,
      settings.updatedAt ? settings.updatedAt : new Date()
    );

    await reloadSettings();
    history.push("/admin/settings/dateformat", {
      alert: {
        type: "success",
        message: t("SettingsDateTimeFormatEditSuccess"),
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/dateformat");
  };

  const crumbs = [
    {
      label: t("Settings"),
      url: "/admin/settings",
    },
    {
      label: t("SettingsDateTimeFormat"),
      url: "/admin/settings/dateformat",
    },
    {
      label: t("SettingsDateTimeFormatEdit"),
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{t("SettingsDateTimeFormatEdit")}</h1>

        <p>{t("SettingsDateTimeFormatDescription")}</p>

        {loadingSettings ? (
          <Spinner
            className="margin-top-9 text-center"
            label={t("LoadingSpinnerLabel")}
          />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="usa-form usa-form--large"
            >
              <Dropdown
                id="dateFormat"
                name="dateFormat"
                label={t("SettingsDateFormat")}
                hint={t("SettingsDateFormatHint")}
                register={register}
                required
                options={dateFormats.map((format) => ({
                  value: format,
                  label: `${dayjs()
                    .locale(window.navigator.language.toLowerCase())
                    .format(format)} (${format})`,
                }))}
              />

              <Dropdown
                id="timeFormat"
                name="timeFormat"
                label={t("SettingsTimeFormat")}
                hint={t("SettingsTimeFormatHint")}
                register={register}
                required
                options={timeFormats.map((format) => ({
                  value: format,
                  label: `${dayjs()
                    .locale(window.navigator.language.toLowerCase())
                    .format(format)} (${format})`,
                }))}
              />

              <br />
              <Button type="submit" disabled={!settings.updatedAt}>
                {t("Save")}
              </Button>
              <Button
                variant="unstyled"
                type="button"
                className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                onClick={onCancel}
              >
                {t("Cancel")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EditDateFormat;
