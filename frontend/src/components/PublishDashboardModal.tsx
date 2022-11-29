/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import ReactModal from "react-modal";
import "./Modal.css";
import { useTranslation } from "react-i18next";
import MarkdownRender from "./MarkdownRender";
import FriendlyURLInput from "./FriendlyURLInput";
import TextField from "./TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  useDashboard,
  useDashboardVersions,
  useFriendlyUrl,
  useSettings,
  useWindowSize,
} from "../hooks";
import { DashboardState } from "../models";

import styles from "./PublishDashboardModal.module.scss";
import BackendService from "../services/BackendService";
import Alert from "./Alert";
import Link from "./Link";

interface PathParams {
  id: string;
  dashboardId: string;
  isOpen: boolean;
  closeModal: () => void;
  dashboardPublished?: Function;
}

interface FormValues {
  releaseNotes: string;
  friendlyURL: string;
  acknowledge: boolean;
}

function PublishDashboardModal(props: PathParams) {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const validationSchema = Yup.object().shape({
    releaseNotes: Yup.string().required(
      t("PublishDashboardModal.MissingVersionNotesError")
    ),
    friendlyURL: Yup.string()
      .required(t("PublishDashboardModal.FriendlyURLRequired"))
      .matches(/\w+(-|\w+)*/gm, t("PublishDashboardModal.InvalidFriendlyURL")),
    acknowledge: Yup.bool().oneOf(
      [true],
      t("PublishDashboardModal.AcknowledgementRequired")
    ),
  });

  // functions to build form returned by useForm() hook
  const { register, errors, handleSubmit, watch } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  const { dashboard } = useDashboard(props.dashboardId);
  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);
  const suggestedUrl = useFriendlyUrl(dashboard, versions);

  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 600;

  const acknowledge = watch("acknowledge");

  const [publishError, setPublishError] = useState<string | undefined>();
  const [isDraftDashboard, setIsDraftDashboard] = useState<boolean>(true);

  const hasPublishedVersion = (): boolean => {
    return !!versions.find((v) => v.state === DashboardState.Published);
  };

  const onSubmit = async (values: FormValues) => {
    setPublishError(undefined);
    if (dashboard) {
      try {
        await BackendService.publishDashboard(
          dashboard.id,
          dashboard.updatedAt,
          values.releaseNotes,
          values.friendlyURL
        );

        setIsDraftDashboard(false);
        if (props.dashboardPublished) {
          props.dashboardPublished();
        }
      } catch (err) {
        setPublishError(
          err?.response?.status === 409
            ? t("PublishDashboardModal.FailToPublishUrlAlreadyExists")
            : t("PublishDashboardModal.FailToPublishError")
        );
      }
    }
  };

  const publishingGuidanceWithVersionOverride = `${
    settings.publishingGuidance.endsWith(".")
      ? settings.publishingGuidance
      : settings.publishingGuidance + "."
  }${
    hasPublishedVersion()
      ? " " + t("PublishDashboardModal.OverwriteWarning")
      : ""
  }`;

  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={() => {
        props.closeModal();
      }}
      className={`font-sans-md ${styles.modalLarge} ${
        isMobile ? "margin-0 padding-0 border-0" : ""
      }`}
      overlayClassName={`${styles.modalOverlay} ${isMobile ? "padding-0" : ""}`}
      portalClassName={styles.modalPortal}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
      aria={{
        labelledby: `${props.id}-header`,
        describedby: `${props.id}-description`,
        modal: "true",
      }}
    >
      <div className="usa-modal__content">
        <div
          className={`usa-modal__main margin-0 ${
            isMobile ? "padding-left-2 padding-right-2" : ""
          }`}
        >
          {isDraftDashboard && (
            <form
              className={`usa-form ${styles.maxw40rem}`}
              aria-labelledby={`${props.id}-header`}
              aria-describedby={`${props.id}-description`}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.minh35rem}>
                <h1
                  className="usa-modal__heading font-sans-lg"
                  id={`${props.id}-header`}
                >
                  {isDraftDashboard && t("PublishDashboardModal.Title")}
                </h1>
                <div className="usa-prose" id={`${props.id}-description`}>
                  {window.EnvironmentConfig?.authenticationRequired
                    ? t("PublishDashboardModal.PrivateDescription")
                    : t("PublishDashboardModal.Description")}
                </div>
                {publishError && (
                  <Alert type="error" message={publishError} slim></Alert>
                )}
                <TextField
                  id="releaseNotes"
                  name="releaseNotes"
                  className={styles.wideText}
                  rows={3}
                  label={t("PublishDashboardModal.InternalVersionNotes")}
                  error={errors.releaseNotes?.message}
                  hint={t(
                    "PublishDashboardModal.InternalVersionNotesDescription"
                  )}
                  register={register}
                  defaultValue={dashboard?.releaseNotes}
                  multiline
                  required
                />
                <FriendlyURLInput
                  id="friendlyURL"
                  name="friendlyURL"
                  groupClassName={styles.maxw40rem}
                  label={t("PublishDashboardModal.FriendlyURL")}
                  error={errors.friendlyURL?.message}
                  register={register}
                  baseUrl={`${window.location.protocol}//${
                    window.location.hostname
                  }${window.location.port ? ":" + window.location.port : ""}/
              `}
                  defaultValue={suggestedUrl.friendlyURL}
                  required
                />
                <div
                  className={`display-flex border-2px radius-md padding-1 usa-form-group ${
                    acknowledge
                      ? "border-base-dark bg-base-lighter"
                      : "border-base-lighter"
                  } ${styles.acknowledgeDiv} ${
                    !isMobile ? styles.maxh10rem : ""
                  }`}
                >
                  <div className="usa-checkbox margin-top-2">
                    <input
                      type="checkbox"
                      id="acknowledge"
                      name="acknowledge"
                      className="usa-checkbox__input"
                      ref={register}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor="acknowledge"
                      data-testid="AcknowledgementCheckboxLabel"
                    >
                      <span className="font-sans-sm">
                        <MarkdownRender
                          className={`margin-left-4 margin-top-neg-3 ${styles.publishingGuidance}`}
                          source={publishingGuidanceWithVersionOverride}
                        />
                      </span>
                    </label>
                  </div>
                </div>
                {errors.acknowledge && (
                  <span
                    className="usa-error-message"
                    id="input-error-message"
                    role="alert"
                  >
                    {errors.acknowledge.message}
                  </span>
                )}
              </div>
              <div className="usa-modal__footer">
                <ul className="usa-button-group">
                  <li className="usa-button-group__item">
                    <Button type="submit" variant="base">
                      {t("PublishDashboardModal.PublishDashboardAction")}
                    </Button>
                  </li>
                </ul>
              </div>
            </form>
          )}
          {!isDraftDashboard && (
            <div className={`usa-form ${styles.maxw40rem}`}>
              <div
                className={`font-sans-md display-flex flex-row ${
                  isMobile ? "" : "flex-align-center " + styles.minh35rem
                } ${styles.minh35rem}`}
              >
                <div
                  className={`font-sans-md display-flex flex-column flex-align-center width-full`}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/publish-success.svg`}
                    alt={t("PublishDashboardModal.PublishSuccess")}
                    className="margin-top-6"
                  />
                  <span className="font-ui-lg text-center margin-top-2">
                    {t("PublishDashboardModal.PublishSuccess")}
                  </span>
                  <span className="usa-hint text-center margin-top-1">
                    {t("PublishDashboardModal.PublishSuccessDescription")}
                  </span>
                  <div className="margin-top-1">
                    <Link
                      target="_blank"
                      to={`/${props.dashboardId}`}
                      ariaLabel={`${t(
                        "PublishDashboardModal.ViewPublishedDashboard"
                      )} ${t("ARIA.OpenInNewTab")}`}
                      external
                    >
                      {t("PublishDashboardModal.ViewPublishedDashboard")}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="usa-modal__footer">
                <ul className="usa-button-group">
                  <li className="usa-button-group__item">
                    <Button
                      type="button"
                      variant="base"
                      onClick={props.closeModal}
                      className="padding-left-4 padding-right-4"
                    >
                      {t("GlobalClose")}
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="unstyled"
          type="button"
          className="usa-modal__close"
          ariaLabel={t("GlobalClose")}
          onClick={props.closeModal}
        >
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </Button>
      </div>
    </ReactModal>
  );
}

export default PublishDashboardModal;
