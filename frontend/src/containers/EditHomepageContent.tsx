import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHomepage } from "../hooks";
import BackendService from "../services/BackendService";
import Markdown from "../components/Markdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";
import { useTranslation } from "react-i18next";

interface FormValues {
  title: string;
  description: string;
}

function EditHomepageContent() {
  const history = useHistory();
  const { homepage, loading } = useHomepage();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const { t } useTranslation();

  const onSubmit = async (values: FormValues) => {
    await BackendService.editHomepage(
      values.title,
      values.description,
      homepage ? homepage.updatedAt : new Date()
    );

    history.push("/admin/settings/publishedsite", {
      alert: {
        type: "success",
        message: {t("SettingsHomePageContentEditSuccess")},
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/publishedsite");
  };

  const crumbs = [
    {
      label: {t("Settings")},
      url: "/admin/settings/topicarea",
    },
    {
      label: {t("SettingsPublishedSite")},
      url: "/admin/settings/publishedsite",
    },
    {
      label: {t("SettingsHomePageContentEdit")},
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{t("SettingsHomePageContentEdit")}</h1>

        <p>
           {t("SettingsHomePageContentEditDescription")}
        </p>

        {loading ? (
          <Spinner className="text-center margin-top-9" label={t("LoadingSpinnerLabel")} />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="edit-homepage-content-form usa-form usa-form--large"
              data-testid="EditHomepageContentForm"
            >
              <TextField
                id="title"
                name="title"
                label={t("SettingsHomepageHeadline")}
                hint={t("SettingsHomepageHeadlineHint")}
                error={errors.title && {t("SettingsHomepageHeadlineErrors")}}
                defaultValue={homepage.title}
                register={register}
                required
              />

              <Markdown
                id="description"
                name="description"
                label={t("SettingsHomePageDescription")}
                defaultValue={homepage.description}
                register={register}
                hint=""
              />

              <br />
              <Button type="submit" disabled={loading}>
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

export default EditHomepageContent;
