import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";
import { useTranslation } from "react-i18next";

interface FormValues {
  singular: string;
  plural: string;
}

function EditTopicAreaLabel() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const { t } = useTranslation();

  const onSubmit = async (values: FormValues) => {
    await BackendService.updateSetting(
      "topicAreaLabels",
      {
        singular: values.singular,
        plural: values.plural,
      },
      new Date()
    );

    history.push("/admin/settings/topicarea", {
      alert: {
        type: "success",
        message: t("EditSettingsTopicAreaNameScreen.Success"),
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/topicarea");
  };

  const crumbs = [
    {
      label: t("Settings"),
      url: "/admin/settings/topicarea",
    },
    {
      label: settings.topicAreaLabels.plural,
      url: "/admin/settings/topicarea",
    },
    {
      label: t("SettingsTopicAreaNameEditGeneric"),
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{t("SettingsTopicAreaNameEditGeneric")}</h1>

        <p>{t("EditSettingsTopicAreaNameScreen.Description")}</p>

        {loadingSettings ? (
<<<<<<< HEAD
          <Spinner
            className="text-center margin-top-9"
            label={t("LoadingSpinnerLabel")}
          />
=======
          <Spinner className="text-center margin-top-9" label={t("LoadingSpinnerLabel")} />
>>>>>>> 7521165... Made formatting changes
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="edit-homepage-content-form usa-form usa-form--large"
              data-testid="EditTopicAreaLabelForm"
            >
              <TextField
                id="topicAreaSingular"
                name="singular"
                label={t("EditSettingsTopicAreaNameScreen.RenameSingle")}
                hint={t("EditSettingsTopicAreaNameScreen.RenameSingleExample")}
                error={
                  errors.singular &&
                  t("EditSettingsTopicAreaNameScreen.RenameError")
                }
                defaultValue={settings.topicAreaLabels.singular}
                register={register}
                required
              />

              <TextField
                id="topicAreaPlural"
                name="plural"
                label={t("EditSettingsTopicAreaNameScreen.RenamePlural")}
                hint={t("EditSettingsTopicAreaNameScreen.RenamePluralExample")}
                error={
                  errors.plural &&
                  t("EditSettingsTopicAreaNameScreen.RenameError")
                }
                defaultValue={settings.topicAreaLabels.plural}
                register={register}
                required
              />

              <br />
              <Button type="submit" disabled={loadingSettings}>
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

export default EditTopicAreaLabel;
