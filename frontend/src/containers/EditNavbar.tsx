import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";

interface FormValues {
  title: string;
}

function EditNavBar() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await BackendService.updateSetting("navbarTitle", values.title, new Date());

    history.push("/admin/settings/publishedsite", {
      alert: {
        type: "success",
        message: "Navigation bar successfully edited",
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/publishedsite");
  };

  const crumbs = [
    {
      label: "Settings",
      url: "/admin/settings/topicarea",
    },
    {
      label: "Published site",
      url: "/admin/settings/publishedsite",
    },
    {
      label: "Edit navigation bar",
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Edit navigation bar</h1>

        <p>Customize the title of your dashboard.</p>

        {loadingSettings ? (
          <Spinner className="text-center margin-top-9" label="Loading" />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="edit-homepage-content-form usa-form usa-form--large"
              data-testid="EditNavbarForm"
            >
              <TextField
                id="title"
                name="title"
                label="Title"
                hint="This is the title of the website"
                error={errors.title && "Please specify a title"}
                defaultValue={settings.navbarTitle}
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

export default EditNavBar;
