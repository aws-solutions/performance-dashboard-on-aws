import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings, useFavicon } from "../hooks";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import defaultFavicon from "../favicon.svg";
import { useTranslation } from "react-i18next";

function EditFavicon() {
  const { t } = useTranslation();
  const history = useHistory();
  const { settings, reloadSettings, loadingSettings } = useSettings(true);
  const { loadingFile, favicon, faviconFileName } = useFavicon(
    settings.customFaviconS3Key
  );
  const { register, handleSubmit } = useForm();

  const [currentFavicon, setCurrentFavicon] = useState(favicon);
  const [imageUploading, setImageUploading] = useState(false);

  const onSubmit = async () => {
    if (currentFavicon) {
      try {
        setImageUploading(true);

        const s3Key = await StorageService.uploadFavicon(
          currentFavicon,
          settings.customFaviconS3Key
        );

        await BackendService.updateSetting(
          "customFaviconS3Key",
          s3Key,
          new Date()
        );
        await reloadSettings();

        setImageUploading(false);

        history.push("/admin/settings/brandingandstyling", {
          alert: {
            type: "success",
            message: t("SettingsFaviconEditSuccess"),
          },
        });
      } catch (err) {
        setImageUploading(false);

        history.push("/admin/settings/brandingandstyling", {
          alert: {
            type: "error",
            message: t("SettingsFaviconEditFailed"),
          },
        });
      }
    } else {
      history.push("/admin/settings/brandingandstyling");
    }
  };

  const onCancel = () => {
    history.push("/admin/settings/brandingandstyling");
  };

  const crumbs = [
    {
      label: t("Settings"),
      url: "/admin/settings",
    },
    {
      label: t("BrandingAndStyle"),
      url: "/admin/settings/brandingandstyling",
    },
    {
      label: t("SettingsFaviconEdit"),
    },
  ];

  const onFileProcessed = (data: File) => {
    if (data) {
      setCurrentFavicon(data);
    }
  };

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{t("SettingsFaviconEdit")}</h1>

        <p>{t("SettingsFaviconDescription")}</p>
      </div>

      {loadingSettings || loadingFile ? (
        <Spinner
          className="text-center margin-top-9"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <>
          <div className="grid-col-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="usa-form usa-form--large"
            >
              <FileInput
                id="dataset"
                name="image"
                label={t("SettingsFaviconFileUpload")}
                accept=".png,.jpeg,.jpg,.svg"
                loading={imageUploading}
                register={register}
                hint={<span>{t("SettingsFaviconFileUploadHint")}</span>}
                fileName={
                  currentFavicon
                    ? currentFavicon.name
                    : faviconFileName
                    ? faviconFileName
                    : defaultFavicon.replace(/^.*[\\/]/, "")
                }
                onFileProcessed={onFileProcessed}
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
          </div>
          <div className="grid-col-5">
            <h4 className="margin-top-4">{t("SettingsFaviconPreview")}</h4>
            <div className="grid-row">
              <div className="logo">
                {currentFavicon && (
                  <img
                    src={URL.createObjectURL(currentFavicon)}
                    alt="favicon"
                  ></img>
                )}
                {!currentFavicon && (
                  <img
                    src={
                      favicon ? URL.createObjectURL(favicon) : defaultFavicon
                    }
                    alt={t("SettingsFaviconOrganization")}
                  ></img>
                )}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  paddingTop: "2px",
                }}
              >
                {settings.navbarTitle}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EditFavicon;
