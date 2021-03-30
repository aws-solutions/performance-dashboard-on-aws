import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHomepage } from "../hooks";
import BackendService from "../services/BackendService";
import Markdown from "../components/Markdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";

interface FormValues {
  title: string;
  description: string;
}

function EditHomepageContent() {
  const history = useHistory();
  const { homepage, loading } = useHomepage();
  const { register, errors, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await BackendService.editHomepage(
      values.title,
      values.description,
      homepage ? homepage.updatedAt : new Date()
    );

    history.push("/admin/settings/publishedsite", {
      alert: {
        type: "success",
        message: "Homepage content successfully edited",
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
      label: "Edit homepage content",
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Edit homepage content</h1>

        <p>
          This components appear on the homepage of your published site and
          explain what your published site is about.
        </p>

        {loading ? (
          <Spinner className="text-center margin-top-9" label="Loading" />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="edit-homepage-content-form usa-form usa-form--large"
              data-testid="EditHomepageContentForm"
            >
              <TextField
                id="title"
                name="title"
                label="Headline"
                hint="Give your homepage a descriptive headline."
                error={errors.title && "Please specify a name"}
                defaultValue={homepage.title}
                register={register}
                required
              />

              <Markdown
                id="description"
                name="description"
                label="Description"
                defaultValue={homepage.description}
                register={register}
                hint=""
              />

              <br />
              <Button type="submit" disabled={loading}>
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

export default EditHomepageContent;
