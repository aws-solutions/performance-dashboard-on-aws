import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  useDashboard,
  useDashboardVersions,
  useSettings,
  useFriendlyUrl,
} from "../hooks";
import { DashboardState, LocationState } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import BackendService from "../services/BackendService";
import Alert from "../components/Alert";
import AlertContainer from "../containers/AlertContainer";
import StepIndicator from "../components/StepIndicator";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import dayjs from "dayjs";
import Spinner from "../components/Spinner";
import MarkdownRender from "../components/MarkdownRender";
import FriendlyURLInput from "../components/FriendlyURLInput";
import PrimaryActionBar from "../components/PrimaryActionBar";
import DropdownMenu from "../components/DropdownMenu";
import "./PublishDashboard.css";

interface PathParams {
  dashboardId: string;
}

interface FormValues {
  releaseNotes: string;
  acknowledge: boolean;
}

function PublishDashboard() {
  const { t } = useTranslation();
  const { dashboardId } = useParams<PathParams>();
  const history = useHistory<LocationState>();
  const [step, setStep] = useState(0);
  const { settings } = useSettings();
  const { dashboard, reloadDashboard, setDashboard } =
    useDashboard(dashboardId);

  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);
  const [desiredUrl, setDesiredUrl] = useState("");
  const suggestedUrl = useFriendlyUrl(dashboard, versions);

  const { register, errors, handleSubmit, trigger, getValues, watch } =
    useForm<FormValues>();

  const releaseNotes = watch("releaseNotes");
  const acknowledge = watch("acknowledge");

  const onPreview = () => {
    history.push(`/admin/dashboard/${dashboardId}`);
  };

  const hasPublishedVersion = (): boolean => {
    return !!versions.find((v) => v.state === DashboardState.Published);
  };

  const onContinue = async () => {
    const isFormValid = await trigger();
    if (isFormValid && dashboard) {
      try {
        // Save release notes
        const { releaseNotes } = getValues();
        const updatedDashboard = await BackendService.publishPending(
          dashboardId,
          dashboard?.updatedAt,
          releaseNotes
        );

        setDashboard(updatedDashboard);
        setStep(step + 1);
      } catch (err) {
        await reloadDashboard();
        history.push(`/admin/dashboard/${dashboardId}/publish`, {
          id: "top-alert",
          alert: {
            type: "error",
            message: t("PublishWorkflow.FailToSaveReleaseNotesError"),
          },
        });
      }
    }
  };

  const onReturnToDraft = async () => {
    if (!dashboard) {
      return;
    }

    try {
      await BackendService.moveToDraft(dashboardId, dashboard.updatedAt);
      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: t("PublishWorkflow.ReturnToDraftSuccessAlert", {
            dashboardName: dashboard.name,
          }),
        },
        id: "top-alert",
      });
    } catch (err) {
      await reloadDashboard();
      history.push(`/admin/dashboard/${dashboardId}/publish`, {
        id: "top-alert",
        alert: {
          type: "error",
          message: t("PublishWorkflow.FailToReturnToDraftError"),
        },
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (dashboard) {
      try {
        await BackendService.publishDashboard(
          dashboardId,
          dashboard.updatedAt,
          values.releaseNotes,
          desiredUrl || suggestedUrl.friendlyURL
        );

        history.push(`/admin/dashboards?tab=published`, {
          alert: {
            type: "success",
            message: t("PublishWorkflow.PublishedSuccessAlert", {
              dashboardName: dashboard.name,
            }),
            to: `/${dashboardId}`,
            linkLabel: t("ViewPublishedDashboard"),
          },
        });
      } catch (err) {
        await reloadDashboard();
        history.push(`/admin/dashboard/${dashboardId}/publish`, {
          id: "top-alert",
          alert: {
            type: "error",
            message:
              err.response.status === 409
                ? t("PublishWorkflow.FailToPublishUrlAlreadyExists")
                : t("PublishWorkflow.FailToPublishError"),
          },
        });
      }
    }
  };

  //store previous color
  const originalBackroundColor = document.body.style.background;

  useEffect(() => {
    //change color
    document.body.style.background = "#fafafa";

    // returned function will be called on component unmount
    return () => {
      //reset color
      document.body.style.background = originalBackroundColor;
    };
  }, []);

  if (!dashboard || !suggestedUrl) {
    return (
      <Spinner
        className="text-center margin-top-9"
        label={t("LoadingSpinnerLabel")}
      />
    );
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: t("Dashboards"),
            url: "/admin/dashboards?tab=pending",
          },
          {
            label: dashboard?.name,
          },
        ]}
      />
      <PrimaryActionBar>
        <Alert type="info" message={t("PublishWorkflow.InfoAlert")} slim />
        <AlertContainer id="top-alert" />
        <div className="grid-row">
          <div className="grid-col text-right display-flex flex-row flex-align-center padding-top-2">
            <ul className="usa-button-group flex-1">
              <li className="usa-button-group__item">
                <span
                  className="usa-tag"
                  style={{ cursor: "text", marginTop: "2px" }}
                >
                  {t("PublishPendingStateLabel")}
                </span>
              </li>
              <li className="usa-button-group__item cursor-default">
                <span>
                  <FontAwesomeIcon icon={faCopy} className="margin-right-1" />
                  {t("ViewDashboardAlertVersion")} {dashboard?.version}
                </span>
              </li>
            </ul>
            <span className="text-base margin-right-1">
              {dashboard &&
                `${t("LastUpdatedLabel")} ${dayjs(dashboard.updatedAt)
                  .locale(window.navigator.language.toLowerCase())
                  .fromNow()}`}
            </span>
            <DropdownMenu buttonText={t("Actions")} variant="outline">
              <DropdownMenu.MenuLink
                href={`/admin/dashboard/${dashboard.id}/history`}
              >
                {t("ViewHistoryLink")}
              </DropdownMenu.MenuLink>
              <DropdownMenu.MenuItem onSelect={onPreview}>
                {t("PreviewButton")}
              </DropdownMenu.MenuItem>
            </DropdownMenu>
            <Button variant="outline" onClick={onReturnToDraft}>
              {t("ReturnToDraftButton")}
            </Button>
          </div>
        </div>
      </PrimaryActionBar>
      <div>
        <h1 className="margin-bottom-0 display-inline-block">
          {dashboard.name}
        </h1>
        <div className="margin-top-1 margin-bottom-4">
          <span className="text-base text-italic">
            {dashboard.topicAreaName}
          </span>
        </div>
      </div>
      <PrimaryActionBar>
        <div className="margin-top-1">
          <StepIndicator
            current={step}
            segments={[
              {
                label: t("PublishWorkflow.InternalVersionNotes"),
              },
              {
                label: t("PublishWorkflow.ConfirmURL"),
              },
              {
                label: t("PublishWorkflow.ReviewAndPublish"),
              },
            ]}
            showStepChart={true}
            showStepText={false}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div hidden={step !== 0}>
              <div className="margin-bottom-4">
                <TextField
                  id="releaseNotes"
                  name="releaseNotes"
                  label=""
                  error={
                    errors.releaseNotes &&
                    t("PublishWorkflow.MissingVersionNotesError")
                  }
                  hint={t("PublishWorkflow.InternalVersionNotesDescription")}
                  register={register}
                  defaultValue={dashboard.releaseNotes}
                  required
                  multiline
                />
              </div>

              <div className="padding-top-2 border-top border-base-lighter">
                <Button
                  variant="default"
                  type="button"
                  onClick={onContinue}
                  disabled={!releaseNotes}
                >
                  {t("ContinueButton")}
                </Button>
              </div>
            </div>

            <div hidden={step !== 1}>
              <FriendlyURLInput
                onChange={(url: string) => setDesiredUrl(url)}
                value={desiredUrl || suggestedUrl.friendlyURL}
                showWarning={hasPublishedVersion()}
              />
              <br />
              <div className="padding-top-2 border-top border-base-lighter">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setStep(step - 1)}
                >
                  {t("BackButton")}
                </Button>
                <Button
                  variant="default"
                  type="button"
                  onClick={() => setStep(step + 1)}
                >
                  {t("ContinueButton")}
                </Button>
              </div>
            </div>
            <div hidden={step !== 2} className="padding-y-1">
              <div
                className={`display-flex border-2px radius-md padding-1 ${
                  acknowledge
                    ? "border-base-dark bg-base-lighter"
                    : "border-base-lighter"
                }`}
              >
                <div>
                  <div className="usa-checkbox margin-top-neg-1">
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
                    />
                  </div>
                </div>
                <div>
                  <span className="font-sans-sm">
                    <MarkdownRender
                      className="margin-left-2 measure-2 publishing-guidance"
                      source={`${settings.publishingGuidance}${
                        settings.publishingGuidance[
                          settings.publishingGuidance.length - 1
                        ] === "."
                          ? ""
                          : "."
                      } ${
                        hasPublishedVersion()
                          ? t("PublishWorkflow.OverwriteWarning")
                          : ""
                      }`}
                    />
                  </span>
                  {}
                </div>
              </div>
              <div className="padding-top-2 border-top border-base-lighter margin-top-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setStep(step - 1)}
                >
                  {t("BackButton")}
                </Button>
                <Button variant="default" type="submit" disabled={!acknowledge}>
                  {t("PublishButton")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </PrimaryActionBar>
    </>
  );
}

export default PublishDashboard;
