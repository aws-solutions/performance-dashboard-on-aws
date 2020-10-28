import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { WidgetType } from "../models";
import { useDashboard } from "../hooks";
import BadgerService from "../services/BadgerService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import Button from "../components/Button";
import ReactMarkdown from "react-markdown";

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
  const { dashboard } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await BadgerService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Text,
        {
          text: values.text,
        }
      );
      history.push(`/admin/dashboard/edit/${dashboardId}`);
    } catch (err) {
      console.log("Failed to save widget", err);
      setLoading(false);
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

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: "Dashboards",
            url: "/admin/dashboards",
          },
          {
            label: dashboard?.name,
            url: `/admin/dashboard/edit/${dashboardId}`,
          },
          {
            label: "Add content item",
          },
        ]}
      />

      <h1>Add content</h1>
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
                hint="Enter text here. This field supports markdown"
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
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
            <Button disabled={loading} type="submit">
              Add text
            </Button>
            <Button variant="unstyled" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </div>
        <div className="grid-col-6">
          <h4 className="margin-top-4">Preview</h4>
          <h2 className="margin-top-4 margin-left-2px">{title}</h2>
          {text ? (
            <div className="border padding-left-05">
              <ReactMarkdown source={text} />
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
