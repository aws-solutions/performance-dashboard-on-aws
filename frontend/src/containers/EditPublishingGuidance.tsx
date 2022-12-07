/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Markdown from "../components/Markdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";

interface FormValues {
    publishingGuidance: string;
}

function EditPublishingGuidance() {
    const history = useHistory();
    const { settings, reloadSettings, loadingSettings } = useSettings(true);
    const { register, handleSubmit, reset, errors } = useForm<FormValues>();
    const { t } = useTranslation();

    useEffect(() => {
        // Set the form values when the newly fetched Settings
        // come back from the backend.
        reset({
            publishingGuidance: settings.publishingGuidance,
        });
    }, [reset, settings]);

    const onSubmit = async (values: FormValues) => {
        await BackendService.editSettings(
            values.publishingGuidance,
            settings.updatedAt ? settings.updatedAt : new Date(),
        );

        await reloadSettings();
        history.push("/admin/settings/publishingguidance", {
            alert: {
                type: "success",
                message: t("PublishingGuidanceEditSuccess"),
            },
        });
    };

    const onCancel = () => {
        history.push("/admin/settings/publishingguidance");
    };

    const crumbs = [
        {
            label: t("Settings"),
            url: "/admin/settings",
        },
        {
            label: t("PublishingGuidance"),
            url: "/admin/settings/publishingguidance",
        },
        {
            label: t("PublishingGuidanceEdit"),
        },
    ];

    return (
        <div className="grid-row">
            <div className="grid-col-8">
                <Breadcrumbs crumbs={crumbs} />
                <h1 id="publishingGuidanceLabel">{t("PublishingGuidanceEdit")}</h1>

                <p>{t("PublishingGuidanceDescription")}</p>

                {loadingSettings ? (
                    <Spinner
                        className="text-center margin-top-9"
                        label={t("LoadingSpinnerLabel")}
                    />
                ) : (
                    <>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="edit-publishing-guidance-form usa-form usa-form--large"
                            data-testid="EditPublishingGuidanceForm"
                            aria-labelledby="publishingGuidanceLabel"
                        >
                            <Markdown
                                id="publishingGuidance"
                                name="publishingGuidance"
                                label={t("AcknowledgeStatement")}
                                defaultValue={settings.publishingGuidance}
                                register={register}
                                error={
                                    errors.publishingGuidance && t("EditAcknowledgeStatementError")
                                }
                                required
                                hint=""
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
                    </>
                )}
            </div>
        </div>
    );
}

export default EditPublishingGuidance;
