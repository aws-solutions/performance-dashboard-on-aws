/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import {
    useDashboard,
    useWidget,
    useImage,
    useFullPreview,
    useChangeBackgroundColor,
    useWindowSize,
} from "../hooks";
import Spinner from "../components/Spinner";
import ImageWidget from "../components/ImageWidget";
import Link from "../components/Link";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
import Alert from "../components/Alert";
import RadioButtons from "../components/RadioButtons";

interface FormValues {
    title: string;
    summary: string;
    showTitle: boolean;
    summaryBelow: boolean;
    altText: string;
    scalePct: string;
}

interface PathParams {
    dashboardId: string;
    widgetId: string;
}

function EditImage() {
    const history = useHistory();
    const { t } = useTranslation();
    const { dashboardId, widgetId } = useParams<PathParams>();
    const { dashboard, loading } = useDashboard(dashboardId);
    const { setWidget, widget } = useWidget(dashboardId, widgetId);
    const { register, errors, handleSubmit } = useForm<FormValues>();
    const { file, loadingFile } = useImage(widget?.content.s3Key.raw);

    const [newImageFile, setNewImageFile] = useState<File | undefined>(undefined);
    const [imageUploading, setImageUploading] = useState(false);

    const supportedImageFileTypes = Object.values(StorageService.imageFileTypes);

    const previewPanelId = "preview-image-panel";
    const { fullPreview, fullPreviewButton } = useFullPreview(previewPanelId);
    const windowSize = useWindowSize();
    const isMobile = windowSize.width <= 600;

    const onSubmit = async (values: FormValues) => {
        if (!widget) {
            return;
        }
        try {
            setImageUploading(true);

            const s3Key = newImageFile
                ? await StorageService.uploadImage(newImageFile)
                : widget.content.s3Key.raw;

            const fileName = newImageFile ? newImageFile.name : widget.content.fileName;

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
                    scalePct: values.scalePct,
                },
                widget.updatedAt,
            );
            setImageUploading(false);

            history.push(`/admin/dashboard/edit/${dashboardId}`, {
                alert: {
                    type: "success",
                    message: t("EditImageScreen.ImageEditedSuccessfully", {
                        title: values.title,
                    }),
                },
            });
        } catch (err) {
            console.log(t("AddContentFailure"), err);
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

    const handleSummaryBelowChange = (event: React.FormEvent<HTMLInputElement>) => {
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

    const handleImageScaleChange = (event: React.FormEvent<HTMLInputElement>) => {
        if (widget) {
            setWidget({
                ...widget,
                content: {
                    ...widget.content,
                    scalePct: (event.target as HTMLInputElement).value,
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
            label: t("EditImageScreen.EditImage"),
            url: "",
        });
    }

    return (
        <>
            <Breadcrumbs crumbs={crumbs} />

            {!widget || loading || loadingFile ? (
                <Spinner className="text-center margin-top-6" label={t("LoadingSpinnerLabel")} />
            ) : (
                <>
                    <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6" hidden={fullPreview}>
                            <PrimaryActionBar>
                                <h1 id="editImageFormHeader" className="margin-top-0">
                                    {t("EditImageScreen.EditImage")}
                                </h1>
                                <form
                                    className="usa-form usa-form--large"
                                    onSubmit={handleSubmit(onSubmit)}
                                    aria-labelledby="editImageFormHeader"
                                >
                                    <fieldset className="usa-fieldset">
                                        {errors.title || errors.altText ? (
                                            <Alert
                                                type="error"
                                                message={t("EditImageScreen.ResolveError")}
                                                slim
                                            ></Alert>
                                        ) : (
                                            ""
                                        )}

                                        <legend className="usa-hint">
                                            {t("EditImageScreen.ConfigureImage")}
                                        </legend>

                                        <TextField
                                            id="title"
                                            name="title"
                                            label={t("EditImageScreen.Title")}
                                            hint={t("EditImageScreen.Hint")}
                                            error={errors.title && t("EditImageScreen.TitleError")}
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
                                                {t("EditImageScreen.ShowTitle")}
                                            </label>
                                        </div>

                                        <div>
                                            <FileInput
                                                id="dataset"
                                                name="image"
                                                label={t("EditImageScreen.FileUpload")}
                                                accept={supportedImageFileTypes.toString()}
                                                loading={imageUploading}
                                                register={register}
                                                required
                                                hint={<span>{t("EditImageScreen.FileHint")}</span>}
                                                fileName={
                                                    newImageFile?.name
                                                        ? newImageFile.name
                                                        : widget.content.fileName
                                                }
                                                onFileProcessed={onFileProcessed}
                                            />
                                        </div>

                                        <div className="grid-row">
                                            <div className="grid-col-9">
                                                <RadioButtons
                                                    id="scalePct"
                                                    name="scalePct"
                                                    label={t("EditImageScreen.ImageSize")}
                                                    hint={t("EditImageScreen.ImageSizeHint")}
                                                    defaultValue={widget.content.scalePct}
                                                    register={register}
                                                    onChange={handleImageScaleChange}
                                                    options={[
                                                        {
                                                            value: "auto",
                                                            label: t("EditImageScreen.AsUploaded"),
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
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        bottom: "0px",
                                                    }}
                                                >
                                                    {widget.content.scalePct !== undefined &&
                                                        widget.content.scalePct !== "auto" && (
                                                            <img
                                                                src={
                                                                    `${process.env.PUBLIC_URL}/images/image-scale-` +
                                                                    widget.content.scalePct.slice(
                                                                        0,
                                                                        widget.content.scalePct
                                                                            .length - 1,
                                                                    ) +
                                                                    `.svg`
                                                                }
                                                                alt={t(
                                                                    "EditImageScreen.ImageScale",
                                                                    {
                                                                        scale: widget.content
                                                                            .scalePct,
                                                                    },
                                                                )}
                                                                width="100%"
                                                                height="auto"
                                                            />
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <TextField
                                                id="altText"
                                                name="altText"
                                                label={t("EditImageScreen.AltText")}
                                                hint={t("EditImageScreen.TextHint")}
                                                register={register}
                                                error={
                                                    errors.altText && t("EditImageScreen.TextError")
                                                }
                                                required
                                                defaultValue={widget.content.imageAltText}
                                                multiline
                                                rows={1}
                                            />

                                            <TextField
                                                id="summary"
                                                name="summary"
                                                label={t("EditImageScreen.SummaryLabel")}
                                                hint={
                                                    <>
                                                        {t("EditImageScreen.SummaryHint")}{" "}
                                                        <Link
                                                            target="_blank"
                                                            to={"/admin/markdown"}
                                                            external
                                                        >
                                                            {t("EditImageScreen.MarkdownLink")}
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
                                                    {t("EditImageScreen.ToggleSummary")}
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <br />
                                    <hr />
                                    <Button
                                        disabled={imageUploading}
                                        type="submit"
                                        className="margin-top-1"
                                    >
                                        {t("Save")}
                                    </Button>
                                    <Button
                                        variant="unstyled"
                                        className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-1"
                                        type="button"
                                        onClick={onCancel}
                                    >
                                        {t("Cancel")}
                                    </Button>
                                </form>
                            </PrimaryActionBar>
                        </div>
                        <section
                            className={fullPreview ? "tablet:grid-col-12" : "tablet:grid-col-6"}
                            aria-label={t("ContentPreview")}
                        >
                            <div hidden={false} className="sticky-preview">
                                {isMobile ? <br /> : fullPreviewButton}
                                <div id={previewPanelId}>
                                    {loadingFile ? (
                                        <Spinner
                                            className="text-center margin-top-6"
                                            label={t("LoadingSpinnerLabel")}
                                        />
                                    ) : (
                                        <ImageWidget
                                            id={widgetId}
                                            title={widget.showTitle ? widget.content.title : ""}
                                            summary={widget.content.summary}
                                            file={newImageFile ? newImageFile : file}
                                            summaryBelow={widget.content.summaryBelow}
                                            altText={widget.content.imageAltText}
                                            scalePct={widget.content.scalePct}
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </>
    );
}

export default EditImage;
