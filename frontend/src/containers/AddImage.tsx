import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { WidgetType } from "../models";
import BackendService from "../services/BackendService";
import { useDashboard, useFullPreview } from "../hooks";
import StorageService from "../services/StorageService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import ImageWidget from "../components/ImageWidget";
import Link from "../components/Link";
import Alert from "../components/Alert";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";

interface FormValues {
  title: string;
  summary: string;
  altText: string;
  showTitle: boolean;
  summaryBelow: boolean;
}

interface PathParams {
  dashboardId: string;
}

function AddImage() {
  const history = useHistory();
  const { t } = useTranslation();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [summary, setSummary] = useState("");
  const [showTitle, setShowTitle] = useState(true);
  const [summaryBelow, setSummaryBelow] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const supportedImageFileTypes = Object.values(StorageService.imageFileTypes);

  const {
    fullPreview,
    fullPreviewToggle,
    fullPreviewButton,
  } = useFullPreview();

  const onSubmit = async (values: FormValues) => {
    try {
      if (!imageFile) {
        throw new Error("Image file not specified");
      }
      setImageUploading(true);
      const s3Key = await StorageService.uploadImage(imageFile);

      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Image,
        values.showTitle,
        {
          title: title,
          s3Key: {
            raw: s3Key,
          },
          fileName: imageFile.name,
          imageAltText: altText,
          summary: summary,
          summaryBelow: summaryBelow,
        }
      );
      setImageUploading(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" image has been successfully added`,
        },
      });
    } catch (err) {
      console.log("Failed to save content item", err);
      setImageUploading(false);
    }
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleChangeTitle = (event: React.FormEvent<HTMLInputElement>) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  const handleAltTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    setAltText((event.target as HTMLInputElement).value);
  };

  const handleSummaryChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setSummary((event.target as HTMLTextAreaElement).value);
  };

  const handleSummaryBelowChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setSummaryBelow((event.target as HTMLInputElement).checked);
  };

  const handleShowTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setShowTitle((event.target as HTMLInputElement).checked);
  };

  const onFileProcessed = (data: File) => {
    if (data) {
      setImageFile(data);
    }
  };

  const crumbs = [
    {
      label: t("Dashboards"),
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/edit/${dashboardId}`,
    },
  ];

  if (!loading) {
    crumbs.push({
      label: t("AddImageScreen.AddImage"),
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <div className="grid-row width-desktop grid-gap">
        <div className="grid-col-6" hidden={fullPreview}>
          <PrimaryActionBar>
            <h1 className="margin-top-0">{t("AddImageScreen.AddImage")}</h1>

            <div className="text-base text-italic">
              {t("AddImageScreen.StepTwo")}
            </div>
            <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
              {t("AddImageScreen.ConfigureImage")}
            </div>
            <form
              className="usa-form usa-form--large"
              onSubmit={handleSubmit(onSubmit)}
            >
              <fieldset className="usa-fieldset">
                {errors.title || errors.summary ? (
                  <Alert
                    type="error"
                    message={t("AddImageScreen.ResolveError")}
                  ></Alert>
                ) : (
                  ""
                )}
                <TextField
                  id="title"
                  name="title"
                  label={t("AddImageScreen.Title")}
                  hint={t("AddImageScreen.Hint")}
                  error={errors.title && t("AddImageScreen.TitleError")}
                  onChange={handleChangeTitle}
                  required
                  register={register}
                />

                <div className="usa-checkbox">
                  <input
                    className="usa-checkbox__input"
                    id="display-title"
                    type="checkbox"
                    name="showTitle"
                    defaultChecked={true}
                    onChange={handleShowTitleChange}
                    ref={register()}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="display-title"
                  >
                    {t("AddImageScreen.ShowTitle")}
                  </label>
                </div>

                <div>
                  <FileInput
                    id="dataset"
                    name="dataset"
                    label={t("AddImageScreen.FileUpload")}
                    accept={supportedImageFileTypes.toString()}
                    loading={imageUploading}
                    register={register}
                    hint={<span>{t("AddImageScreen.FileHint")}</span>}
                    fileName={imageFile && imageFile.name}
                    onFileProcessed={onFileProcessed}
                  />
                </div>

                <div>
                  {false && false ? (
                    <div className="usa-alert usa-alert--warning margin-top-3">
                      <div className="usa-alert__body">
                        <p className="usa-alert__text">
                          {t("AddImageScreen.TableHint")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div hidden={!imageFile}>
                    <TextField
                      id="altText"
                      name="altText"
                      label={t("AddImageScreen.AltText")}
                      hint={t("AddImageScreen.TextHint")}
                      register={register}
                      error={errors.altText && t("AddImageScreen.TextError")}
                      required
                      onChange={handleAltTextChange}
                      multiline
                      rows={1}
                    />

                    <TextField
                      id="summary"
                      name="summary"
                      label={t("AddImageScreen.SummaryLabel")}
                      hint={
                        <>
                          {t("AddImageScreen.SummaryHint")}{" "}
                          <Link target="_blank" to={"/admin/markdown"} external>
                            {t("AddImageScreen.MarkdownLink")}
                          </Link>
                        </>
                      }
                      register={register}
                      onChange={handleSummaryChange}
                      multiline
                      rows={5}
                    />
                    <div className="usa-checkbox">
                      <input
                        className="usa-checkbox__input"
                        id="summary-below"
                        type="checkbox"
                        name="summaryBelow"
                        defaultChecked={false}
                        onChange={handleSummaryBelowChange}
                        ref={register()}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="summary-below"
                      >
                        {t("AddImageScreen.ToggleSummary")}
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
              <br />
              <hr />
              <Button variant="outline" type="button" onClick={goBack}>
                {t("AddImageScreen.Back")}
              </Button>
              <Button
                disabled={!imageFile || imageUploading}
                type="submit"
                disabledToolTip={t("AddImageScreen.DisabledToolTip")}
              >
                {t("AddImageScreen.AddImageButton")}
              </Button>
              <Button
                variant="unstyled"
                className="text-base-dark hover:text-base-darker active:text-base-darkest"
                type="button"
                onClick={onCancel}
              >
                {t("AddImageScreen.Cancel")}
              </Button>
            </form>
          </PrimaryActionBar>
        </div>
        <div className={fullPreview ? "gril-col-12" : "grid-col-6"}>
          {fullPreviewButton}
          <ImageWidget
            title={showTitle ? title : ""}
            summary={summary}
            file={imageFile}
            summaryBelow={summaryBelow}
            altText={altText}
          />
        </div>
      </div>
    </>
  );
}

export default AddImage;
