import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDashboard } from "../hooks";
import { LocationState } from "../models";
import BadgerService from "../services/BadgerService";
import AlertContainer from "./AlertContainer";
import StepIndicator from "../components/StepIndicator";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";

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
  const { dashboard, reloadDashboard } = useDashboard(dashboardId);
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
      await BadgerService.moveToDraft(dashboardId, dashboard.updatedAt);
      history.push(`/admin/dashboard/edit/${dashboardId}`);
    } catch (err) {
      console.log("Failed to return to draft");
      await reloadDashboard();
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (dashboard) {
      try {
        await BadgerService.publishDashboard(
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

  if (!dashboard) {
    return null;
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
            label: "Publish workflow",
          },
        ]}
      />

      <AlertContainer />
      <div className="grid-row">
        <div className="grid-col text-left padding-top-2">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span className="usa-tag">Publish Pending</span>
            </li>
          </ul>
        </div>
        <div className="grid-col text-right">
          <Button variant="base" onClick={onPreview}>
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
                <label className="usa-checkbox__label" htmlFor="acknowledge">
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
              variant="base"
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
  );
}

export default PublishDashboard;
