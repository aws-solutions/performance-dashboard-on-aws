import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";
import UtilsService from "../services/UtilsService";
import EnvConfig from "../services/EnvConfig";

interface FormValues {
  singular: string;
  plural: string;
}

function EditTopicAreaLabel() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await BackendService.updateSetting(
      "topicAreaLabels",
      {
        singular: values.singular,
        plural: values.plural,
      },
      new Date()
    );

    history.push("/admin/settings/topicarea", {
      alert: {
        type: "success",
        message: "Topic area name was successfully edited",
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/topicarea");
  };

  const crumbs = [
    {
      label: "Settings",
      url: "/admin/settings/topicarea",
    },
    {
      label: UtilsService.determineTopicAreaString(
        EnvConfig.topicAreasLabel,
        settings.topicAreaLabels?.plural
      ),
      url: "/admin/settings/topicarea",
    },
    {
      label: "Edit topic area name",
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Edit topic area name</h1>

        <p>
          You can customize the name "topic area" and it will be replaced
          throughout the interface. For example, "topic area" can be renamed to
          "department", "ministry", "program", "agency", etc.
        </p>

        {loadingSettings ? (
          <Spinner className="text-center margin-top-9" label="Loading" />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="edit-homepage-content-form usa-form usa-form--large"
              data-testid="EditTopicAreaLabelForm"
            >
              <TextField
                id="topicAreaSingular"
                name="singular"
                label='Rename single "topic area"'
                hint='For example, "ministry"'
                error={errors.singular && "Please specify a title"}
                defaultValue={settings.topicAreaLabels?.singular}
                register={register}
                required
              />

              <TextField
                id="topicAreaPlural"
                name="plural"
                label='Rename multiple "topic areas"'
                hint='For example, "ministries"'
                error={errors.plural && "Please specify a title"}
                defaultValue={settings.topicAreaLabels?.plural}
                register={register}
                required
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

export default EditTopicAreaLabel;
