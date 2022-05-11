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
  dashboardId: string;
  isOpen: boolean;
  closeModal: Function;
  dashboardPublished?: Function;
  title?: string;
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

  const { dashboard, reloadDashboard } = useDashboard(props.dashboardId);
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

  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={() => {
        props.closeModal();
      }}
      className={`modal`}
      overlayClassName="overlay"
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
      aria={{
        labelledby: "title",
        describedby: "description",
        modal: "true",
      }}
    >
      <div className="clearfix" role="dialog">
        <div
          className="float-left"
          style={{
            maxWidth: "80%",
          }}
        >
          {isDraftDashboard && (
            <h2 id="publishDashboardModalHeader" className="margin-top-0">
              {props.title ?? t("PublishDashboardModal.Title")}
            </h2>
          )}
        </div>
        <div className="float-right font-sans-md">
          <Button
            variant="unstyled"
            type="button"
            className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
            ariaLabel={t("GlobalClose")}
            onClick={props.closeModal}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="margin-right-1"
              size="1x"
              style={{ marginTop: "5px" }}
            />
          </Button>
        </div>
      </div>

      {publishError && <Alert type="error" message={publishError} slim></Alert>}

      {isDraftDashboard && (
        <form
          className="usa-form usa-form--large"
          aria-labelledby="publishDashboardModalHeader"
          onSubmit={handleSubmit(onSubmit)}
        >
          <legend className="usa-hint margin-top-2">
            {t("PublishDashboardModal.Description")}
          </legend>

          <div className="font-sans-md margin-top-2 margin-bottom-6">
            <div>
              <div className="margin-bottom-4">
                <TextField
                  id="releaseNotes"
                  name="releaseNotes"
                  className={styles.wideTextArea}
                  rows={5}
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
              </div>

              <div className="margin-bottom-4">
                <FriendlyURLInput
                  id="friendlyURL"
                  name="friendlyURL"
                  label={t("PublishDashboardModal.FriendlyURL")}
                  error={errors.friendlyURL?.message}
                  hint={t("PublishDashboardModal.FriendlyURLDescription")}
                  register={register}
                  baseUrl={`${window.location.protocol}//${
                    window.location.hostname
                  }${window.location.port ? ":" + window.location.port : ""}/
              `}
                  defaultValue={suggestedUrl.friendlyURL}
                  required
                />
              </div>

              <div
                className={`display-flex border-2px radius-md padding-1 ${
                  acknowledge
                    ? "border-base-dark bg-base-lighter"
                    : "border-base-lighter"
                }`}
              >
                <div
                  className={errors.acknowledge ? "usa-form-group--error" : ""}
                >
                  <div className="usa-checkbox margin-top-neg-1">
                    <input
                      type="checkbox"
                      id="acknowledge"
                      name="acknowledge"
                      className="usa-checkbox__input"
                      ref={register}
                      required
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor="acknowledge"
                      data-testid="AcknowledgementCheckboxLabel"
                    >
                      <span className="font-sans-sm">
                        <MarkdownRender
                          className={`margin-left-4 margin-top-neg-3 measure-2 ${styles.publishingGuidance}`}
                          source={`${settings.publishingGuidance}${
                            settings.publishingGuidance[
                              settings.publishingGuidance.length - 1
                            ] === "."
                              ? ""
                              : "."
                          } ${
                            hasPublishedVersion()
                              ? t("PublishDashboardModal.OverwriteWarning")
                              : ""
                          }`}
                        />
                      </span>
                    </label>
                  </div>
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
          </div>

          <div className="padding-top-2 border-top border-base-lighter margin-top-4">
            <Button type="submit" variant="base">
              {t("PublishDashboardModal.PublishDashboardAction")}
            </Button>
          </div>
        </form>
      )}
      {!isDraftDashboard && (
        <>
          <div className="font-sans-md display-flex flex-column flex-align-center height-mobile">
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
          <Button
            type="button"
            variant="base"
            onClick={props.closeModal}
            className="padding-left-4 padding-right-4"
          >
            {t("GlobalClose")}
          </Button>
        </>
      )}
    </ReactModal>
  );
}

export default PublishDashboardModal;
