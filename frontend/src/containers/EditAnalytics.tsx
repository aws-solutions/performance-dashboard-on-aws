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

interface FormValues {
  trackingID: string;
}

function EditAnalytics() {
  const history = useHistory();
  const { settings, reloadSettings, loadingSettings } = useSettings(true);
  const { register, handleSubmit, errors } = useForm<FormValues>();
  const { t } = useTranslation();

  if (settings.analyticsTrackingId === "NA") {
    settings.analyticsTrackingId = "";
  }

  const onSubmit = async (values: FormValues) => {
    const trackingID = values.trackingID;

    await BackendService.updateSetting(
      "analyticsTrackingId",
      trackingID,
      settings.updatedAt ? settings.updatedAt : new Date()
    );

    await reloadSettings();
    history.push("/admin/settings/publishedsite", {
      alert: {
        type: "success",
        message: t("SettingsAnalyticsEditSuccess"),
      },
    });
  };

  const onClearAndSave = async () => {
    await BackendService.updateSetting(
      "analyticsTrackingId",
      "NA",
      settings.updatedAt ? settings.updatedAt : new Date()
    );

    await reloadSettings();
    history.push("/admin/settings/publishedsite", {
      alert: {
        type: "success",
        message: t("SettingsAnalyticsEditSuccess"),
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/publishedsite");
  };

  const crumbs = [
    {
      label: t("Settings"),
      url: "/admin/settings",
    },
    {
      label: t("SettingsPublishedSite"),
      url: "/admin/settings/publishedsite",
    },
    {
      label: t("SettingsAnalyticsEdit"),
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1 id="settingsAnalyticsLabel">{t("SettingsAnalyticsEdit")}</h1>

        <p>{t("SettingsAnalyticsDescription")}</p>

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
              data-testid="EditAnalyticsForm"
              aria-labelledby="settingsAnalyticsLabel"
            >
              <TextField
                id="trackingID"
                name="trackingID"
                label={t("SettingsAnalyticsHint")}
                defaultValue={settings.analyticsTrackingId}
                register={register}
                validate={(input: string) => {
                  return !input || input.startsWith("UA");
                }}
                error={errors.trackingID && t("SettingsAnalyticsEditError")}
                required
              />

              <br />

              <Button type="submit" disabled={loadingSettings}>
                {t("Save")}
              </Button>

              <Button
                type="button"
                disabled={loadingSettings}
                onClick={onClearAndSave}
              >
                {t("ClearAndSave")}
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

export default EditAnalytics;
