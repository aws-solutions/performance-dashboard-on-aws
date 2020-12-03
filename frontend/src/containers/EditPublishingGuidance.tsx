import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Markdown from "../components/Markdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";

interface FormValues {
  publishingGuidance: string;
}

function EditPublishingGuidance() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await BackendService.editSettings(
      values.publishingGuidance,
      settings ? settings.updatedAt : new Date()
    );

    history.push("/admin/settings/publishingguidance", {
      alert: {
        type: "success",
        message: "Publishing guidance successfully edited",
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/publishingguidance");
  };

  const crumbs = [
    {
      label: "Settings",
      url: "/admin/settings/topicarea",
    },
    {
      label: "Publishing guidance",
      url: "/admin/settings/publishingguidance",
    },
    {
      label: "Edit publishing guidance",
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Edit publishing guidance</h1>

        <p>
          Publishing guidance is text that users must acknowledge before they
          publish a dashboard. For example, use this text to remind them to
          check for errors or mistakes, sensitive or confidential data, or
          guidance specific to your organization.
        </p>

        {loadingSettings ? (
          <Spinner className="text-center margin-top-9" label="Loading" />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="edit-publishing-guidance-form usa-form usa-form--large"
              data-testid="EditPublishingGuidanceForm"
            >
              <Markdown
                id="publishingGuidance"
                name="publishingGuidance"
                label="Acknowledgement statement"
                defaultValue={settings.publishingGuidance}
                register={register}
                hint=""
              />

              <br />
              <Button type="submit" disabled={loadingSettings}>
                Save
              </Button>
              <Button
                variant="unstyled"
                type="button"
                className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EditPublishingGuidance;
