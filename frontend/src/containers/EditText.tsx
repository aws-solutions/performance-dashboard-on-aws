import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import { useWidget, useDashboard } from "../hooks";
import Spinner from "../components/Spinner";
import Link from "../components/Link";

interface FormValues {
  title: string;
  text: string;
  showTitle: boolean;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditText() {
  const history = useHistory();
  const { dashboardId, widgetId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const [editingWidget, setEditingWidget] = useState(false);
  const { widget, setWidget } = useWidget(dashboardId, widgetId);

  const onSubmit = async (values: FormValues) => {
    console.log("SUBMITTING:", values);
    if (!widget) {
      return;
    }

    try {
      setEditingWidget(true);
      await BackendService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        values.showTitle,
        {
          text: values.text,
        },
        widget.updatedAt
      );
      setEditingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: `"${values.title}" text has been successfully edited`,
        },
      });
    } catch (err) {
      console.log("Failed to save content item", err);
      setEditingWidget(false);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const onFormChange = () => {
    const { title, text, showTitle } = getValues();
    console.log(title, showTitle);
    setWidget({
      ...widget,
      name: title,
      showTitle: showTitle,
      content: {
        ...widget?.content,
        text,
      },
    });
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

  if (!loading && widget) {
    crumbs.push({
      label: "Edit text",
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Edit text</h1>

      {loading || !widget ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
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

                  <div className="usa-checkbox">
                    <input
                      className="usa-checkbox__input"
                      id="display-title"
                      type="checkbox"
                      name="showTitle"
                      defaultChecked={widget.showTitle}
                      ref={register()}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor="display-title"
                    >
                      Show title on dashboard
                    </label>
                  </div>

                  <TextField
                    id="text"
                    name="text"
                    label="Text"
                    hint={
                      <>
                        Enter text here. This field supports markdown.{" "}
                        <Link target="_blank" to={"/admin/markdown"} external>
                          View Markdown Syntax
                        </Link>
                      </>
                    }
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
                <Button disabled={editingWidget} type="submit">
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
              {widget.showTitle ? (
                <h2 className="margin-top-4 margin-left-2px">{widget.name}</h2>
              ) : (
                ""
              )}
              {widget.content.text ? (
                <div className="padding-left-05">
                  <MarkdownRender source={widget.content.text} />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditText;
