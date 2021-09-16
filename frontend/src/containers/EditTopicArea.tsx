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
          message: t("SettingsTopicAreaNameEditSuccess", { name: values.name }),
        },
      });
    } catch (err) {
      history.push(`/admin/settings/topicarea/${topicAreaId}/edit`, {
        alert: {
          type: "error",
          message: t("SettingsTopicAreaNameEditProblem", { name: values.name }),
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
            label: t("Settings"),
            url: "/admin/settings/topicarea",
          },
          {
            label: settings.topicAreaLabels.plural,
            url: "/admin/settings/topicarea",
          },
          {
            label: t("SettingsTopicAreaEdit", { name: topicarea.name }),
          },
        ]}
      />
      <AlertContainer />
      <h1>
        {" "}
        {t("SettingsTopicAreaNameEdit", {
          singularname: settings.topicAreaLabels.singular,
        })}
      </h1>
      <div className="grid-row">
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="usa-form usa-form--large"
            data-testid="EditTopicAreaForm"
          >
            <TextField
              id="name"
              name="name"
              label={t("SettingsTopicAreaName", {
                singularname: settings.topicAreaLabels.singular,
              })}
              register={register}
              error={errors.name && t("SettingsTopicAreaNameEditError")}
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
