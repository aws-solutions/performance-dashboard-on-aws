import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings, useLogo } from "../hooks";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import defaultLogo from "../logo.svg";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import TextField from "../components/TextField";

function EditLogo() {
  const { t } = useTranslation();
  const history = useHistory();
  const { settings, reloadSettings, loadingSettings } = useSettings(true);
  const { loadingFile, logo, logoFileName } = useLogo(settings.customLogoS3Key);
  const { register, errors, handleSubmit } = useForm();

  const [currentLogo, setCurrentLogo] = useState(logo);
  const [imageUploading, setImageUploading] = useState(false);
  const [altText, setAltText] = useState("");

  const onSubmit = async () => {
    let refreshSettings = false;
    if (altText) {
      try {
        await BackendService.updateSetting(
          "customLogoAltText",
          altText,
          new Date()
        );
        refreshSettings = true;
      } catch (err) {
        history.push("/admin/settings/brandingandstyling", {
          alert: {
            type: "error",
            message: t("SettingsLogoEditFailed"),
          },
        });
      }
    }

    if (currentLogo) {
      try {
        setImageUploading(true);

        const s3Key = await StorageService.uploadLogo(
          currentLogo,
          settings.customLogoS3Key
        );

        await BackendService.updateSetting(
          "customLogoS3Key",
          s3Key,
          new Date()
        );

        setImageUploading(false);

        refreshSettings = true;
      } catch (err) {
        setImageUploading(false);

        history.push("/admin/settings/brandingandstyling", {
          alert: {
            type: "error",
            message: t("SettingsLogoEditFailed"),
          },
        });
      }
    }

    if (refreshSettings) {
      try {
        await reloadSettings();
        history.push("/admin/settings/brandingandstyling", {
          alert: {
            type: "success",
            message: t("SettingsLogoEditSuccess"),
          },
        });
      } catch (err) {
        history.push("/admin/settings/brandingandstyling", {
          alert: {
            type: "error",
            message: t("SettingsLogoEditFailed"),
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
      label: t("SettingsLogoEdit"),
    },
  ];

  const onFileProcessed = (data: File) => {
    if (data) {
      setCurrentLogo(data);
    }
  };

  const handleAltTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    setAltText((event.target as HTMLInputElement).value);
  };

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{t("SettingsLogoEdit")}</h1>

        <p>{t("SettingsLogoDescription")}</p>
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
                label={t("SettingsLogoFileUpload")}
                accept=".png,.jpeg,.jpg,.svg"
                loading={imageUploading}
                register={register}
                required
                hint={<span>{t("SettingsLogoFileUploadHint")}</span>}
                fileName={
                  currentLogo
                    ? currentLogo.name
                    : logoFileName
                    ? logoFileName
                    : defaultLogo.replace(/^.*[\\/]/, "")
                }
                onFileProcessed={onFileProcessed}
              />

              <TextField
                id="altText"
                name="altText"
                label={t("SettingsLogoAltText")}
                hint={t("SettingsLogoTextHint")}
                register={register}
                error={errors.altText && t("SettingsLogoTextError")}
                required
                onChange={handleAltTextChange}
                defaultValue={settings.customLogoAltText}
                multiline
                rows={1}
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
            <h4 className="margin-top-4">{t("SettingsLogoPreview")}</h4>
            <div className="grid-row">
              <Header className="usa-header usa-header--basic padding-left-2 padding-right-2">
                <div className="usa-logo margin-top-2" id="basic-logo">
                  <em className="usa-logo__text display-flex flex-align-center">
                    <div className="logo">
                      {currentLogo && (
                        <img
                          src={URL.createObjectURL(currentLogo)}
                          alt={altText || t("SettingsLogoOrganization")}
                        ></img>
                      )}
                      {!currentLogo && (
                        <img
                          src={logo ? URL.createObjectURL(logo) : defaultLogo}
                          alt={altText || t("SettingsLogoOrganization")}
                        ></img>
                      )}
                    </div>
                    {settings.navbarTitle}
                  </em>
                </div>
              </Header>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EditLogo;
