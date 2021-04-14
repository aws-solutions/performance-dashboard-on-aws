import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import TextField from "../components/TextField";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";

interface FormValues {
  adminContactEmailAddress: string;
}

function EditSupportContactEmail() {
  const history = useHistory();
  const { settings, reloadSettings, loadingSettings } = useSettings(true);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { t } = useTranslation();

  useEffect(() => {
    // Reset the form values when the newly fetched Settings
    // come back from the backend.
    reset({
      adminContactEmailAddress: settings.adminContactEmailAddress,
    });
  }, [reset, settings]);

  const onSubmit = async (values: FormValues) => {
    const adminContactEmailAddress = values.adminContactEmailAddress;

    await BackendService.updateSetting(
      "adminContactEmailAddress",
      adminContactEmailAddress,
      settings.updatedAt ? settings.updatedAt : new Date()
    );

    await reloadSettings();
    history.push("/admin/settings/adminsite", {
      alert: {
        type: "success",
        message: "Support contact email successfully edited.",
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/adminsite");
  };

  const crumbs = [
    {
      label: t("Settings"),
      url: "/admin/settings",
    },
    {
      label: "Admin site",
      url: "/admin/settings/adminsite",
    },
    {
      label: "Edit admin site",
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Support contact email address</h1>

        <p>
          Set an email address for internal users to contact if they experience
          technical issues. This email will appear as a 'Contact support' link
          in the footer of the internal site.
        </p>

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
              <TextField
                id="title"
                name="adminContactEmailAddress"
                label="Support Contact Email Address"
                hint="Enter a valid email address"
                register={register}
              />

              <br />
              <Button type="submit">{t("Save")}</Button>
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

export default EditSupportContactEmail;
