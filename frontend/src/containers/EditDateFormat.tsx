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
        message: "Date and time format successfully edited",
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/dateformat");
  };

  const crumbs = [
    {
      label: "Settings",
      url: "/admin/settings",
    },
    {
      label: "Date and time format",
      url: "/admin/settings/dateformat",
    },
    {
      label: "Edit date and time format",
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Edit date and time format</h1>

        <p>
          Customize how your performance dashboard displays date and time in the
          user interface.
        </p>

        {loadingSettings ? (
          <Spinner className="margin-top-9 text-center" label="Loading" />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="usa-form usa-form--large"
            >
              <Dropdown
                id="dateFormat"
                name="dateFormat"
                label="Date format"
                hint="Choose a date format from the list"
                register={register}
                required
                options={dateFormats.map((format) => ({
                  value: format,
                  label: `${dayjs().format(format)} (${format})`,
                }))}
              />

              <Dropdown
                id="timeFormat"
                name="timeFormat"
                label="Time format"
                hint="Choose a time format from the list"
                register={register}
                required
                options={timeFormats.map((format) => ({
                  value: format,
                  label: `${dayjs().format(format)} (${format})`,
                }))}
              />

              <br />
              <Button type="submit" disabled={!settings.updatedAt}>
                Save
              </Button>
              <Button
                variant="unstyled"
                type="button"
                className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EditDateFormat;
