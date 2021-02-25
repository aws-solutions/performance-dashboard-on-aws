import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings, useLogo } from "../hooks";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import defaultLogo from "../logo.svg";

function EditLogo() {
  const history = useHistory();
  const { settings, reloadSettings } = useSettings(true);
  const { loadingFile, logo } = useLogo(settings.customLogoS3Key);
  const { register, handleSubmit } = useForm();

  const [currentLogo, setCurrentLogo] = useState(logo);
  const [imageUploading, setImageUploading] = useState(false);

  const onSubmit = async () => {
    if (currentLogo) {
      try {
        setImageUploading(true);

        const s3Key = await StorageService.uploadLogo(currentLogo);

        await BackendService.updateSetting(
          "customLogoS3Key",
          s3Key,
          new Date()
        );
        await reloadSettings();

        setImageUploading(false);

        history.push("/admin/settings/brandingandstyling", {
          alert: {
            type: "success",
            message: "Logo successfully modified",
          },
        });
      } catch (err) {
        setImageUploading(false);

        history.push("/admin/settings/brandingandstyling", {
          alert: {
            type: "error",
            message: "Failed to update logo",
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
      label: "Settings",
      url: "/admin/settings",
    },
    {
      label: "Branding and style",
      url: "/admin/settings/brandingandstyling",
    },
    {
      label: "Edit logo",
    },
  ];

  const onFileProcessed = (data: File) => {
    if (data) {
      setCurrentLogo(data);
    }
  };

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Edit logo</h1>

        <p>
          This logo will appear in the header next to the performance dashboard
          name and in the published site header.
        </p>
      </div>

      {loadingFile ? (
        <div></div>
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
                label="File upload"
                accept=".png,.jpeg,.jpg,.svg"
                loading={imageUploading}
                register={register}
                hint={<span>Must be a PNG, JPEG, or SVG file</span>}
                fileName={
                  currentLogo
                    ? currentLogo.name
                    : defaultLogo.replace(/^.*[\\\/]/, "")
                }
                onFileProcessed={onFileProcessed}
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
          </div>
          <div className="grid-col-5">
            <h4 className="margin-top-4">Preview</h4>
            <div className="grid-row">
              <div className="grid-col-2 text-left">
                {currentLogo && (
                  <img src={URL.createObjectURL(currentLogo)}></img>
                )}
                {!currentLogo && (
                  <img
                    src={logo ? URL.createObjectURL(logo) : defaultLogo}
                    alt="Organization logo"
                  ></img>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EditLogo;
