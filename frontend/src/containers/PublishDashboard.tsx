import React, { useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDashboard } from "../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { LocationState } from "../models";
import BadgerService from "../services/BadgerService";
import AlertContainer from "./AlertContainer";
import AdminLayout from "../layouts/Admin";
import StepIndicator from "../components/StepIndicator";
import TextField from "../components/TextField";
import Button from "../components/Button";

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
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const { dashboard } = useDashboard(dashboardId);

  const onPreview = () => {
    history.push(`/admin/dashboard/${dashboardId}/preview`);
  };

  const onReturnToDraft = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
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
    <AdminLayout>
      <div>
        <Link to="/admin/dashboards">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to dashboards
        </Link>
      </div>
      <div className="padding-y-2">
        <AlertContainer />
      </div>
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
        className="edit-details-form usa-form usa-form--large"
      >
        <div className="margin-y-2 minh-mobile">
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

          <div hidden={step !== 1}>
            <label className="usa-label text-bold">
              Internal release notes
            </label>
            <div className="usa-hint">
              Notes are only visible to internal users
            </div>
            <div className="padding-2 margin-top-1 bg-base-lightest">
              <p>{getValues().releaseNotes}</p>
            </div>
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
            <Button
              variant="default"
              type="button"
              onClick={() => setStep(step + 1)}
            >
              Continue
            </Button>
          </span>
          <span hidden={step < 1}>
            <Button variant="default" type="submit">
              Confirm & Publish
            </Button>
          </span>
        </div>
      </form>
    </AdminLayout>
  );
}

export default PublishDashboard;
