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
import BackendService from "../services/BackendService";
import Alert from "../components/Alert";
import AlertContainer from "../containers/AlertContainer";
import StepIndicator from "../components/StepIndicator";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import dayjs from "dayjs";
import Spinner from "../components/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import MarkdownRender from "../components/MarkdownRender";
import "./PublishDashboard.css";

interface PathParams {
  dashboardId: string;
}

interface FormValues {
  releaseNotes: string;
  acknowledge: boolean;
  friendlyURL: string;
}

function PublishDashboard() {
  const { dashboardId } = useParams<PathParams>();
  const history = useHistory<LocationState>();
  const [step, setStep] = useState<number>(0);
  const { settings } = useSettings();
  const { dashboard, reloadDashboard, setDashboard } = useDashboard(
    dashboardId
  );

  const { friendlyURL } = useFriendlyUrl(dashboard);
  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);
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
  const published = versions.find((v) => v.state === DashboardState.Published);

  const onPreview = () => {
    history.push(`/admin/dashboard/${dashboardId}`);
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
          values.friendlyURL || undefined
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

  if (!dashboard) {
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

      <div className="margin-y-2">
        <Alert
          type="info"
          message={
            "This dashboard is now in the publish pending state and " +
            "cannot be edited unless returned to draft"
          }
          slim
        />

        <AlertContainer id="top-alert" />
      </div>
      <div className="grid-row">
        <div className="grid-col text-left padding-top-2">
          <ul className="usa-button-group">
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
        </div>
        <div className="grid-col text-right">
          <span className="text-base margin-right-1">
            {dashboard && `Last saved ${dayjs(dashboard.updatedAt).fromNow()}`}
          </span>
          <Button variant="outline" onClick={onPreview}>
            Preview
          </Button>
          <Button variant="outline" onClick={onReturnToDraft}>
            Return to draft
          </Button>
        </div>
      </div>
      <div>
        <h1 className="margin-bottom-0 display-inline-block">
          {dashboard.name}
        </h1>
        <div className="margin-top-1">
          <span className="text-base text-italic">
            {dashboard.topicAreaName}
          </span>
        </div>
      </div>
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="usa-form usa-form--large"
      >
        <div className="margin-y-2">
          <div hidden={step !== 0}>
            <TextField
              id="releaseNotes"
              name="releaseNotes"
              label="Internal release notes"
              error={errors.releaseNotes && "Please enter release notes"}
              hint="Describe what changes you are publishing to the dashboard."
              register={register}
              defaultValue={dashboard.releaseNotes}
              required
              multiline
            />

            <div className="margin-top-3">
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
            <TextField
              id="friendlyURL"
              name="friendlyURL"
              label="Dashboard URL"
              error={errors.friendlyURL && "Please enter a valid URL"}
              hint="Edit or confirm the URL that will be used to publish this dashboard."
              register={register}
              defaultValue={friendlyURL}
            />

            <div className="margin-top-3">
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
            <table
              className="usa-table border-hidden"
              style={{ width: "100%" }}
            >
              <tbody>
                <tr>
                  <td className="border-hidden text-top">
                    <div className="usa-checkbox">
                      <input
                        type="checkbox"
                        id="acknowledge"
                        name="acknowledge"
                        className="usa-checkbox__input"
                        ref={register}
                      />
                      <label
                        className="usa-checkbox__label margin-top-1"
                        htmlFor="acknowledge"
                        data-testid="AcknowledgementCheckboxLabel"
                      />
                    </div>
                  </td>
                  <td className="publishing-guidance border-hidden">
                    <span className=" font-sans-sm">
                      <MarkdownRender
                        source={`${settings.publishingGuidance}${
                          settings.publishingGuidance[
                            settings.publishingGuidance.length - 1
                          ] === "."
                            ? ""
                            : "."
                        }`}
                      />
                    </span>
                    {published &&
                    published.state === DashboardState.Published ? (
                      <p>
                        I also understand that this will overwrite the existing
                        published version of the dashboard.
                      </p>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="margin-top-3">
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
    </>
  );
}

export default PublishDashboard;
