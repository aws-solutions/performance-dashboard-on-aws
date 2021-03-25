import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import "./PublishDashboard.css";
import PrimaryActionBar from "../components/PrimaryActionBar";

interface PathParams {
  dashboardId: string;
}

interface FormValues {
  releaseNotes: string;
  acknowledge: boolean;
}

function PublishDashboard() {
  const { dashboardId } = useParams<PathParams>();
  const history = useHistory<LocationState>();
  const [step, setStep] = useState(0);
  const { settings } = useSettings();
  const { dashboard, reloadDashboard, setDashboard } = useDashboard(
    dashboardId
  );

  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);
  const [desiredUrl, setDesiredUrl] = useState("");
  const suggestedUrl = useFriendlyUrl(dashboard, versions);

  const {
    register,
    errors,
    handleSubmit,
    trigger,
    getValues,
    watch,
  } = useForm<FormValues>();

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
            message: "Failed to save release notes, please try again",
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
          message: `"${dashboard.name}" dashboard successfully returned to draft`,
        },
        id: "top-alert",
      });
    } catch (err) {
      await reloadDashboard();
      history.push(`/admin/dashboard/${dashboardId}/publish`, {
        id: "top-alert",
        alert: {
          type: "error",
          message: "Failed to return dashboard to draft. Please try again.",
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
            message: `${dashboard.name} dashboard was successfully published.`,
            to: `/${dashboardId}`,
            linkLabel: "View the published dashboard",
          },
        });
      } catch (err) {
        await reloadDashboard();
        history.push(`/admin/dashboard/${dashboardId}/publish`, {
          id: "top-alert",
          alert: {
            type: "error",
            message: "Failed to publish dashboard. Please try again.",
          },
        });
      }
    }
  };

  if (!dashboard || !suggestedUrl) {
    return <Spinner className="text-center margin-top-9" label="Loading" />;
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: "Dashboards",
            url: "/admin/dashboards?tab=pending",
          },
          {
            label: dashboard?.name,
          },
        ]}
      />
      <PrimaryActionBar>
        <Alert
          type="info"
          message={
            "This dashboard is now in the publish pending state and " +
            "cannot be edited unless returned to draft"
          }
          slim
        />

        <AlertContainer id="top-alert" />
        <div className="grid-row">
          <div className="grid-col text-right display-flex flex-row flex-align-center padding-top-2">
            <ul className="usa-button-group flex-1">
              <li className="usa-button-group__item">
                <span className="usa-tag" style={{ cursor: "text" }}>
                  Publish Pending
                </span>
              </li>
              <li className="usa-button-group__item">
                <span className="text-underline text-middle">
                  <FontAwesomeIcon icon={faCopy} className="margin-right-1" />
                  Version {dashboard?.version}
                </span>
              </li>
            </ul>
            <span className="text-base margin-right-1">
              {dashboard &&
                `Last saved ${dayjs(dashboard.updatedAt).fromNow()}`}
            </span>
            <Button variant="outline" onClick={onPreview}>
              Preview
            </Button>
            <Button variant="outline" onClick={onReturnToDraft}>
              Return to draft
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
        <div className="margin-y-3">
          <StepIndicator
            current={step}
            segments={[
              {
                label: "Internal version notes",
              },
              {
                label: "Confirm URL",
              },
              {
                label: "Review and publish",
              },
            ]}
            showStepChart={true}
            showStepText={true}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div hidden={step !== 0}>
              <div className="margin-bottom-4">
                <TextField
                  id="releaseNotes"
                  name="releaseNotes"
                  label="Internal version notes"
                  error={errors.releaseNotes && "Please enter version notes"}
                  hint="Describe what changes you are publishing to the dashboard."
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
                  Continue
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
                  Back
                </Button>
                <Button
                  variant="default"
                  type="button"
                  onClick={() => setStep(step + 1)}
                >
                  Continue
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
                  <div className="usa-checkbox marin-top-neg-1">
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
                      }`}
                    />
                  </span>
                  {hasPublishedVersion() && (
                    <p>
                      I also understand that this will overwrite the existing
                      published version of the dashboard.
                    </p>
                  )}
                </div>
              </div>
              <div className="padding-top-2 border-top border-base-lighter margin-top-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
                <Button variant="default" type="submit" disabled={!acknowledge}>
                  Publish
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
