import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import { useWidget, useDashboard } from "../hooks";

interface FormValues {
  title: string;
  text: string;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditText() {
  const history = useHistory();
  const { dashboardId, widgetId } = useParams<PathParams>();
  const { dashboard } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const { widget, setWidget } = useWidget(dashboardId, widgetId);

  const onSubmit = async (values: FormValues) => {
    if (!widget) {
      return;
    }

    try {
      setLoading(true);
      await BackendService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        {
          text: values.text,
        },
        widget.updatedAt
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
    setWidget({
      ...widget,
      name: title,
      content: {
        ...widget?.content,
        text,
      },
    });
  };

  if (!widget) {
    return null;
  }

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

      <h1>Edit content item</h1>
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
                defaultValue={widget.name}
                required
                register={register}
              />

              <TextField
                id="text"
                name="text"
                label="Text"
                hint="Enter text here. This field supports markdown"
                showMarkdownLink
                error={errors.text && "Please specify a text content"}
                required
                register={register}
                defaultValue={widget.content.text}
                multiline
                rows={10}
              />
            </fieldset>
            <br />
            <br />
            <hr />
            <Button disabled={loading} type="submit">
              Save
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
          <h2 className="margin-top-4 margin-left-2px">{widget.name}</h2>
          {widget.content.text ? (
            <div className="border padding-left-05">
              <MarkdownRender source={widget.content.text} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default EditText;
