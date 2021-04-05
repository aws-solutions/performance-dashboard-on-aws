import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import { useDashboard, useWidget, useImage, useFullPreview } from "../hooks";
import Spinner from "../components/Spinner";
import ImageWidget from "../components/ImageWidget";
import Link from "../components/Link";
import PrimaryActionBar from "../components/PrimaryActionBar";

interface FormValues {
  title: string;
  summary: string;
  showTitle: boolean;
  summaryBelow: boolean;
  altText: string;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditImage() {
  const history = useHistory();

  const { dashboardId, widgetId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { setWidget, widget } = useWidget(dashboardId, widgetId);
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const { file, loadingFile } = useImage(widget?.content.s3Key.raw);

  const [newImageFile, setNewImageFile] = useState<File | undefined>(undefined);
  const [imageUploading, setImageUploading] = useState(false);

  const supportedImageFileTypes = Object.values(StorageService.imageFileTypes);

  const {
    fullPreview,
    fullPreviewToggle,
    fullPreviewButton,
  } = useFullPreview();

  const onSubmit = async (values: FormValues) => {
    if (!widget) {
      return;
    }
    try {
      setImageUploading(true);

      const s3Key = newImageFile
        ? await StorageService.uploadImage(newImageFile)
        : widget.content.s3Key.raw;

      const fileName = newImageFile
        ? newImageFile.name
        : widget.content.fileName;

      await BackendService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        values.showTitle,
        {
          title: values.title,
          s3Key: {
            raw: s3Key,
          },
          fileName: fileName,
          imageAltText: values.altText,
          summary: values.summary,
          summaryBelow: values.summaryBelow,
        },
        widget.updatedAt
      );
      setImageUploading(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" image has been successfully edited`,
        },
      });
    } catch (err) {
      console.log("Failed to edit content item", err);
      setImageUploading(false);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleChangeTitle = (event: React.FormEvent<HTMLInputElement>) => {
    if (widget) {
      setWidget({
        ...widget,
        content: {
          ...widget.content,
          title: (event.target as HTMLInputElement).value,
        },
      });
    }
  };

  const handleSummaryChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    if (widget) {
      setWidget({
        ...widget,
        content: {
          ...widget.content,
          summary: (event.target as HTMLTextAreaElement).value,
        },
      });
    }
  };

  const handleSummaryBelowChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    if (widget) {
      setWidget({
        ...widget,
        content: {
          ...widget.content,
          summaryBelow: (event.target as HTMLInputElement).checked,
        },
      });
    }
  };

  const handleShowTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (widget) {
      setWidget({
        ...widget,
        showTitle: (event.target as HTMLInputElement).checked,
        content: {
          ...widget.content,
        },
      });
    }
  };

  const onFileProcessed = (data: File) => {
    if (data) {
      setNewImageFile(data);
    }
  };

  const crumbs = [
    {
      label: "Dashboards",
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/edit/${dashboardId}`,
    },
  ];

  if (!loading) {
    crumbs.push({
      label: "Edit image",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {!widget || loading || loadingFile ? (
        <Spinner className="text-center margin-top-6" label="Loading" />
      ) : (
        <>
          <div className="grid-row width-desktop grid-gap">
            <div className="grid-col-6" hidden={fullPreview}>
              <PrimaryActionBar>
                <h1 className="margin-top-0">Edit Image</h1>
                <form
                  className="usa-form usa-form--large"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <fieldset className="usa-fieldset">
                    <TextField
                      id="title"
                      name="title"
                      label="Image title"
                      hint="Give your image a descriptive title."
                      error={errors.title && "Please specify an image title"}
                      onChange={handleChangeTitle}
                      defaultValue={widget.content.title}
                      required
                      register={register}
                    />

                    <div className="usa-checkbox">
                      <input
                        className="usa-checkbox__input"
                        id="display-title"
                        type="checkbox"
                        name="showTitle"
                        defaultChecked={widget.showTitle}
                        onChange={handleShowTitleChange}
                        ref={register()}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="display-title"
                      >
                        Show title on dashboard
                      </label>
                    </div>

                    <div>
                      <FileInput
                        id="dataset"
                        name="image"
                        label="File upload"
                        accept={supportedImageFileTypes.toString()}
                        loading={imageUploading}
                        register={register}
                        hint={<span>Must be a PNG, JPEG, or SVG file</span>}
                        fileName={
                          newImageFile?.name
                            ? newImageFile.name
                            : widget.content.fileName
                        }
                        onFileProcessed={onFileProcessed}
                      />
                    </div>

                    <div>
                      <div hidden={false}>
                        <TextField
                          id="altText"
                          name="altText"
                          label="Image alt text"
                          hint="Provide a short description of the image for users with visual impairments using a screen reader. This description will not display on the dashboard."
                          register={register}
                          defaultValue={widget.content.imageAltText}
                          multiline
                          rows={1}
                        />

                        <TextField
                          id="summary"
                          name="summary"
                          label="Image description - optional"
                          hint={
                            <>
                              Give your chart a summary to explain it in more
                              depth. It can also be read by screen readers to
                              describe the chart for those with visual
                              impairments. This field supports markdown.{" "}
                              <Link
                                target="_blank"
                                to={"/admin/markdown"}
                                external
                              >
                                View Markdown Syntax
                              </Link>
                            </>
                          }
                          register={register}
                          onChange={handleSummaryChange}
                          multiline
                          defaultValue={widget.content.summary}
                          rows={5}
                        />
                        <div className="usa-checkbox">
                          <input
                            className="usa-checkbox__input"
                            id="summary-below"
                            type="checkbox"
                            name="summaryBelow"
                            defaultChecked={widget.content.summaryBelow}
                            onChange={handleSummaryBelowChange}
                            ref={register()}
                          />
                          <label
                            className="usa-checkbox__label"
                            htmlFor="summary-below"
                          >
                            Show description below image
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <br />
                  <hr />
                  <Button disabled={imageUploading} type="submit">
                    Save
                  </Button>
                  <Button
                    variant="unstyled"
                    className="text-base-dark hover:text-base-darker active:text-base-darkest"
                    type="button"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </form>
              </PrimaryActionBar>
            </div>
            <div className={fullPreview ? "gril-col-12" : "grid-col-6"}>
              <div hidden={false}>
                {fullPreviewButton}
                <h4>Preview</h4>
                {loadingFile ? (
                  <Spinner
                    className="text-center margin-top-6"
                    label="Loading"
                  />
                ) : (
                  <ImageWidget
                    title={widget.showTitle ? widget.content.title : ""}
                    summary={widget.content.summary}
                    file={newImageFile ? newImageFile : file}
                    summaryBelow={widget.content.summaryBelow}
                    altText={widget.content.imageAltText}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditImage;
