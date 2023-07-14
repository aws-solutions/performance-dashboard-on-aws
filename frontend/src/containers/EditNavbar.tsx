/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";
import { useTranslation } from "react-i18next";
import UtilsService from "../services/UtilsService";
import Markdown from "../components/Markdown";

interface FormValues {
    title: string;
    contactEmail: string;
    contactUs: string;
}

function EditNavBar() {
    const history = useHistory();
    const { settings, loadingSettings } = useSettings();
    const { register, errors, handleSubmit } = useForm<FormValues>();
    const { t } = useTranslation();

    const onSubmit = async (values: FormValues) => {
        if (!settings.navbarTitle || settings.navbarTitle !== values.title) {
            await BackendService.updateSetting("navbarTitle", values.title, new Date());
        }

        if (!settings.contactEmailAddress || settings.contactEmailAddress !== values.contactEmail) {
            await BackendService.updateSetting(
                "contactEmailAddress",
                values.contactEmail,
                new Date(),
            );
        }

        if (!settings.contactUsContent || settings.contactUsContent !== values.contactUs) {
            await BackendService.updateSetting("contactUsContent", values.contactUs, new Date());
        }

        history.push("/admin/settings/publishedsite", {
            alert: {
                type: "success",
                message: t("SettingsNavBarEditSuccess"),
            },
        });
    };

    const onCancel = () => {
        history.push("/admin/settings/publishedsite");
    };

    const crumbs = [
        {
            label: t("Settings"),
            url: "/admin/settings/topicarea",
        },
        {
            label: t("SettingsPublishedSite"),
            url: "/admin/settings/publishedsite",
        },
        {
            label: t("SettingsNavBarEdit"),
        },
    ];

    return (
        <div className="grid-row">
            <div className="grid-col-8">
                <Breadcrumbs crumbs={crumbs} />
                <h1 id="settingsNavBarLabel">{t("SettingsNavBarEdit")}</h1>

                <p>{t("SettingsNavBarEditDescription")}</p>

                {loadingSettings ? (
                    <Spinner
                        className="text-center margin-top-9"
                        label={t("LoadingSpinnerLabel")}
                    />
                ) : (
                    <>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="edit-homepage-content-form usa-form usa-form--large"
                            data-testid="EditNavbarForm"
                            aria-labelledby="settingsNavBarLabel"
                        >
                            <TextField
                                id="title"
                                name="title"
                                label={t("SettingsTitle")}
                                hint={t("SettingsTitleHint")}
                                error={errors.title && t("SettingsTitleError")}
                                defaultValue={settings.navbarTitle}
                                register={register}
                                required
                            />

                            <TextField
                                id="contactEmail"
                                name="contactEmail"
                                label={t("SettingsContactEmailTitle")}
                                hint={t("SettingsContactEmailHint")}
                                defaultValue={settings.contactEmailAddress}
                                register={register}
                                error={errors.contactEmail && t("EmailInvalid")}
                                required
                                validate={UtilsService.validateEmails}
                            />

                            <Markdown
                                id="contactUs"
                                name="contactUs"
                                label={t("SettingsContactUsTitle")}
                                hint={t("SettingsContactUsHint")}
                                defaultValue={settings.contactUsContent || ""}
                                register={register}
                                error={errors.contactUs?.message}
                                required
                            />

                            <br />
                            <Button type="submit" disabled={loadingSettings}>
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

export default EditNavBar;
