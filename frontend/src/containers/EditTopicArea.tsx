import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTopicArea } from "../hooks";
import BackendService from "../services/BackendService";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import AlertContainer from "./AlertContainer";
import { useSettings } from "../hooks";
import { useTranslation } from "react-i18next";

interface FormValues {
  name: string;
  topicAreaId: string;
  description: string;
}

interface PathParams {
  topicAreaId: string;
}

function EditTopicArea() {
  const history = useHistory();
  const { topicAreaId } = useParams<PathParams>();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const { topicarea } = useTopicArea(topicAreaId);
  const { settings } = useSettings();
  const { t } = useTranslation();

  const onSubmit = async (values: FormValues) => {
    try {
      await BackendService.renameTopicArea(topicAreaId, values.name);
      history.push("/admin/settings/topicarea", {
        alert: {
          type: "success",
<<<<<<< HEAD
          message: t("SettingsTopicAreaNameEditSuccess", { name: values.name }),
=======
          message: {t("SettingsTopicAreaNameEditSuccess", { name: ${values.name})},
>>>>>>> 13668bd... Added localization to EditTopicArea
        },
      });
    } catch (err) {
      history.push(`/admin/settings/topicarea/${topicAreaId}/edit`, {
        alert: {
          type: "error",
<<<<<<< HEAD
          message: t("SettingsTopicAreaNameEditProblem", { name: values.name }),
=======
          message: {t("SettingsTopicAreaNameEditProblem", { name: ${values.name})},
>>>>>>> 13668bd... Added localization to EditTopicArea
        },
      });
    }
  };

  const onCancel = () => {
    history.push("/admin/settings/topicarea");
  };

  if (!topicarea) {
    return null;
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
<<<<<<< HEAD
            label: t("Settings"),
=======
            label: {t("Settings")},
>>>>>>> 13668bd... Added localization to EditTopicArea
            url: "/admin/settings/topicarea",
          },
          {
            label: settings.topicAreaLabels.plural,
            url: "/admin/settings/topicarea",
          },
          {
<<<<<<< HEAD
            label: t("SettingsTopicAreaEdit", { name: topicarea.name }),
=======
            label: {t("SettingsTopicAreaEdit", { name: ${topicarea.name})},
>>>>>>> 13668bd... Added localization to EditTopicArea
          },
        ]}
      />
      <AlertContainer />
<<<<<<< HEAD
      <h1>
        {" "}
        {t("SettingsTopicAreaNameEdit", {
          singularname: settings.topicAreaLabels.singular,
        })}
      </h1>
=======
      <h1> {t("SettingsTopicAreaNameEdit", { singularname: ${settings.topicAreaLabels.singular })}</h1>
>>>>>>> 13668bd... Added localization to EditTopicArea
      <div className="grid-row">
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="usa-form usa-form--large"
          >
            <TextField
              id="name"
              name="name"
<<<<<<< HEAD
              label={t("SettingsTopicAreaName", {
                singularname: settings.topicAreaLabels.singular,
              })}
              register={register}
              error={errors.name && t("SettingsTopicAreaNameEditError")}
=======
              label={t("SettingsTopicAreaNameEdit", { singularname: ${settings.topicAreaLabels.singular })}
              register={register}
              error={errors.name && {t("SettingsTopicAreaNameEditError")}}
>>>>>>> 13668bd... Added localization to EditTopicArea
              defaultValue={topicarea?.name}
              required
            />

            <br />
            <Button type="submit">{t("Save")}</Button>
            <Button
              className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
              variant="unstyled"
              type="button"
              onClick={onCancel}
            >
              {t("Cancel")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditTopicArea;
