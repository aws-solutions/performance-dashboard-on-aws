import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { WidgetType } from "../models";
import { useDashboard } from "../hooks";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import Link from "../components/Link";

interface FormValues {
  title: string;
  text: string;
}

interface PathParams {
  dashboardId: string;
}

function AddText() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();

  const [creatingWidget, setCreatingWidget] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const onSubmit = async (values: FormValues) => {
    try {
      setCreatingWidget(true);
      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Text,
        {
          text: values.text,
        }
      );
      setCreatingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" text has been successfully added`,
        },
      });
    } catch (err) {
      console.log("Failed to save content item", err);
      setCreatingWidget(false);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const onFormChange = () => {
    const { title, text } = getValues();
    setTitle(title);
    setText(text);
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const crumbs = [
    {
      label: "Dashboards",
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/edit/${dashboardId}`,
    },
  ];

  if (!loading) {
    crumbs.push({
      label: "Add text",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Add text</h1>

      <div className="text-base text-italic">Step 2 of 2</div>
      <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
        Configure text content
      </div>
      <div className="grid-row width-desktop">
        <div className="grid-col-6">
          <form
            className="usa-form usa-form--large"
            onChange={onFormChange}
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="usa-fieldset">
              <TextField
                id="title"
                name="title"
                label="Text title"
                hint="Give your content a descriptive title."
                error={errors.title && "Please specify a content title"}
                required
                register={register}
              />

              <TextField
                id="text"
                name="text"
                label="Text"
                hint={
                  <>
                    Enter text here. This field supports markdown.
                    <Link target="_blank" to={"/admin/markdown"} external>
                      View Markdown Syntax
                    </Link>
                  </>
                }
                error={errors.text && "Please specify a text content"}
                required
                register={register}
                multiline
                rows={10}
              />
            </fieldset>
            <br />
            <br />
            <hr />
            <Button variant="outline" type="button" onClick={goBack}>
              Back
            </Button>
            <Button disabled={creatingWidget} type="submit">
              Add text
            </Button>
            <Button
              variant="unstyled"
              className="text-base-dark hover:text-base-darker active:text-base-darkest"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </form>
        </div>
        <div className="grid-col-6">
          <h4 className="margin-top-4">Preview</h4>
          <h2 className="margin-top-4 margin-left-2px">{title}</h2>
          {text ? (
            <div className="padding-left-05">
              <MarkdownRender source={text} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default AddText;
