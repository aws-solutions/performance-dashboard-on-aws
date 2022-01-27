import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { WidgetType } from "../models";
import BackendService from "../services/BackendService";
import {
  useDashboard,
  useFullPreview,
  useChangeBackgroundColor,
} from "../hooks";
import StorageService from "../services/StorageService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import ImageWidget from "../components/ImageWidget";
import Link from "../components/Link";
import Alert from "../components/Alert";
import PrimaryActionBar from "../components/PrimaryActionBar";
import RadioButtons from "../components/RadioButtons";
import { useTranslation } from "react-i18next";

interface FormValues {
  title: string;
  summary: string;
  altText: string;
  showTitle: boolean;
  summaryBelow: boolean;
  scalePct: string;
  imageFile: FileList;
}

interface PathParams {
  dashboardId: string;
}

function AddImage() {
  const history = useHistory();
  const { t } = useTranslation();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, watch } = useForm<FormValues>();

  const title = watch("title");
  const summary = watch("summary");
  const altText = watch("altText");
  const showTitle = watch("showTitle");
  const summaryBelow = watch("summaryBelow");
  const scalePct = watch("scalePct");
  const imageFile = watch("imageFile");

  const [imageUploading, setImageUploading] = useState(false);

  const supportedImageFileTypes = Object.values(StorageService.imageFileTypes);

  const { fullPreview, fullPreviewButton } = useFullPreview();

  const onSubmit = async (values: FormValues) => {
    try {
      if (!values.imageFile || !values.imageFile[0]) {
        throw new Error(t("AddImageScreen.ImageFileNotSpecified"));
      }

      setImageUploading(true);
      const s3Key = await StorageService.uploadImage(values.imageFile[0]);

      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Image,
        values.showTitle,
        {
          title: values.title,
          s3Key: {
            raw: s3Key,
          },
          fileName: values.imageFile[0].name,
          imageAltText: values.altText,
          summary: values.summary,
          summaryBelow: values.summaryBelow,
          scalePct: values.scalePct,
        }
      );
      setImageUploading(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: t("AddImageScreen.ImageAddedSuccessfully", {
            title: values.title,
          }),
        },
      });
    } catch (err) {
      console.log(t("AddContentFailure"), err);
      setImageUploading(false);
    }
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
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

  useChangeBackgroundColor();

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
            <h1 id="addImageFormHeader" className="margin-top-0">
              {t("AddImageScreen.AddImage")}
            </h1>

            <form
              className="usa-form usa-form--large"
              onSubmit={handleSubmit(onSubmit)}
              aria-labelledby="addImageFormHeader"
            >
              <fieldset className="usa-fieldset">
                <legend className="usa-hint">
                  {t("AddImageScreen.ConfigureImage")}
                </legend>
                {(errors.title || errors.altText || errors.imageFile) && (
                  <Alert
                    type="error"
                    message={t("AddImageScreen.ResolveError")}
                    slim
                  ></Alert>
                )}
                <TextField
                  id="title"
                  name="title"
                  label={t("AddImageScreen.Title")}
                  hint={t("AddImageScreen.Hint")}
                  error={errors.title && t("AddImageScreen.TitleError")}
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
                    id="imageFile"
                    name="imageFile"
                    label={t("AddImageScreen.FileUpload")}
                    accept={supportedImageFileTypes.toString()}
                    loading={imageUploading}
                    register={register}
                    required
                    hint={<span>{t("AddImageScreen.FileHint")}</span>}
                    fileName={
                      imageFile && imageFile.length > 0 ? imageFile[0].name : ""
                    }
                    errors={
                      errors.imageFile
                        ? [t("AddImageScreen.ImageFileNotSpecified")]
                        : []
                    }
                  />
                </div>

                <div className="grid-row">
                  <div className="grid-col-9">
                    <RadioButtons
                      id="scalePct"
                      name="scalePct"
                      label={t("AddImageScreen.ImageSize")}
                      hint={t("AddImageScreen.ImageSizeHint")}
                      defaultValue={"auto"}
                      register={register}
                      options={[
                        {
                          value: "auto",
                          label: t("AddImageScreen.AsUploaded"),
                        },
                        {
                          value: "100%",
                          label: t("percentage", { pct: "100" }),
                        },
                        {
                          value: "75%",
                          label: t("percentage", { pct: "75" }),
                        },
                        {
                          value: "50%",
                          label: t("percentage", { pct: "50" }),
                        },
                        {
                          value: "25%",
                          label: t("percentage", { pct: "25" }),
                        },
                      ]}
                    />
                  </div>
                  <div className="grid-col-3 margin-top-10">
                    <div style={{ position: "absolute", bottom: "0px" }}>
                      {scalePct !== undefined && scalePct !== "auto" && (
                        <img
                          src={
                            `${process.env.PUBLIC_URL}/images/image-scale-` +
                            scalePct.slice(0, scalePct.length - 1) +
                            `.svg`
                          }
                          alt={t("AddImageScreen.ImageScale", {
                            scale: scalePct,
                          })}
                          width="100%"
                          height="auto"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div hidden={!imageFile}>
                    <TextField
                      id="altText"
                      name="altText"
                      label={t("AddImageScreen.AltText")}
                      hint={t("AddImageScreen.TextHint")}
                      register={register}
                      error={errors.altText && t("AddImageScreen.TextError")}
                      required
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
                disabled={imageUploading}
                type="submit"
                disabledToolTip={t("AddImageScreen.DisabledToolTip")}
              >
                {t("AddImageScreen.AddImage")}
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
        <section
          className={fullPreview ? "grid-col-12" : "grid-col-6"}
          aria-label={t("ContentPreview")}
        >
          <div className="sticky-preview">
            {fullPreviewButton}
            <ImageWidget
              title={showTitle ? title : ""}
              summary={summary}
              file={imageFile && imageFile[0]}
              summaryBelow={summaryBelow}
              altText={altText}
              scalePct={scalePct}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default AddImage;
