import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import BackendService from "../services/BackendService";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import { useSettings } from "../hooks";
import { useTranslation } from "react-i18next";

interface FormValues {
  name: string;
  topicAreaId: string;
  description: string;
}

function CreateTopicArea() {
  const history = useHistory();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const { settings } = useSettings();
  const { t } = useTranslation();

  const onSubmit = async (values: FormValues) => {
    const topicarea = await BackendService.createTopicArea(values.name);

    history.push("/admin/settings/topicarea", {
      alert: {
        type: "success",
        message: t("SettingsTopicAreaNameCreateSuccess", {
          name: `${topicarea.name}`,
          topicAreaName: `${settings.topicAreaLabels.singular.toLowerCase()}`,
        }),
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/topicarea");
  };

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: t("Settings"),
            url: "/admin/settings/topicarea",
          },
          {
            label: t("TopicAreas"),
            url: "/admin/settings/topicarea",
          },
          {
            label: t("CreateNewTopicArea"),
          },
        ]}
      />
      <h1 id="createNewTopicAreaLabel">{t("CreateNewTopicArea")}</h1>

      <div className="grid-row">
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="usa-form usa-form--large"
            data-testid="CreateTopicAreaForm"
            aria-labelledby="createNewTopicAreaLabel"
          >
            <TextField
              id="name"
              name="name"
              label={t("TopicAreaName")}
              register={register}
              error={errors.name && "Please specify a name"}
              required
            />

            <br />
            <Button type="submit">{t("CreateTopicArea")}</Button>
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

export default CreateTopicArea;
