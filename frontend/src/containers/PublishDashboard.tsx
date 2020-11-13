import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDashboard } from "../hooks";
import { LocationState } from "../models";
import BackendService from "../services/BackendService";
import Alert from "../components/Alert";
import StepIndicator from "../components/StepIndicator";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import dayjs from "dayjs";
import Spinner from "../components/Spinner";

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
  const { register, errors, handleSubmit, trigger } = useForm<FormValues>();

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
          message: `${dashboard.name} dashboard was successfully published`,
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

              <div hidden={step !== 1} className="padding-y-6">
                <fieldset className="usa-fieldset">
                  <div className="usa-checkbox">
                    <input
                      type="checkbox"
                      id="acknowledge"
                      name="acknowledge"
                      className="usa-checkbox__input"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAcknowledge(e.target.checked);
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor="acknowledge"
                    >
                      I acknowledge that I have reviewed the dashboard and it is
                      ready to publish.
                    </label>
                  </div>
                </fieldset>
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
                  Submit for publishing
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
