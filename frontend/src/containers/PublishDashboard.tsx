import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDashboard, useDashboardVersions, useSettings } from "../hooks";
import { DashboardState, LocationState } from "../models";
import BackendService from "../services/BackendService";
import Alert from "../components/Alert";
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
}

function PublishDashboard() {
  const { dashboardId } = useParams<PathParams>();
  const history = useHistory<LocationState>();
  const [step, setStep] = useState<number>(0);
  const [acknowledge, setAcknowledge] = useState<boolean>(false);
  const { dashboard, reloadDashboard, loading } = useDashboard(dashboardId);
  const { settings } = useSettings();
  const { register, errors, handleSubmit, trigger } = useForm<FormValues>();

  const { versions } = useDashboardVersions(dashboard?.parentDashboardId);

  const published = versions.find((v) => v.state === DashboardState.Published);

  const onPreview = () => {
    history.push(`/admin/dashboard/${dashboardId}/preview`);
  };

  const onContinue = async () => {
    if (await trigger()) {
      // validates form
      setStep(step + 1);
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
      console.log("Failed to return to draft");
      await reloadDashboard();
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (dashboard) {
      try {
        await BackendService.publishDashboard(
          dashboardId,
          dashboard.updatedAt,
          values.releaseNotes
        );
      } catch (err) {
        console.log("Error publishing the dashboard", err);
        return;
      }

      history.push(`/admin/dashboards?tab=published`, {
        alert: {
          type: "success",
          message: `${dashboard.name} dashboard was successfully published.`,
          to: `/${dashboardId}`,
          linkLabel: "View the published dashboard",
        },
      });
    }
  };

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

      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <div className="margin-y-2">
            <Alert
              type="info"
              message={
                "This dashboard is now in the publish pending state and " +
                "cannot be edited unless returned to draft"
              }
              slim
            />
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
          <div>
            <h1 className="margin-bottom-0 display-inline-block">
              {dashboard?.name}
            </h1>
            <div className="margin-top-1">
              <span className="text-base text-italic">
                {dashboard?.topicAreaName}
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
                  label: "Review and publish",
                },
              ]}
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
                  required
                  multiline
                />
              </div>

              <div hidden={step !== 1} className="padding-y-1">
                <table className="usa-table border-hidden" width="100%">
                  <tbody>
                    <tr>
                      <td className="border-hidden text-top">
                        <div className="usa-checkbox">
                          <input
                            type="checkbox"
                            id="acknowledge"
                            name="acknowledge"
                            className="usa-checkbox__input"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setAcknowledge(e.target.checked);
                            }}
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
                            I also understand that this will overwrite the
                            existing published version of the dashboard.
                          </p>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <span hidden={step === 0}>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              </span>
              <span hidden={step === 1}>
                <Button variant="default" type="button" onClick={onContinue}>
                  Continue
                </Button>
              </span>
              <span hidden={step < 1}>
                <Button variant="default" type="submit" disabled={!acknowledge}>
                  Publish
                </Button>
              </span>
            </div>
          </form>
        </>
      )}
    </>
  );
}

export default PublishDashboard;
