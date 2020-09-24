import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import BadgerService from "../services/BadgerService";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import Button from "../components/Button";
import ReactMarkdown from "react-markdown";
import { useWidget } from "../hooks";

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
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const onLoaded = useCallback(async (title: string, text: string) => {
    setTitle(title);
    setText(text);
  }, []);

  const { widget } = useWidget(dashboardId, widgetId, onLoaded);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await BadgerService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        {
          text: values.text,
        },
        widget ? widget.updatedAt : new Date()
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

  return (
    <AdminLayout>
      <Breadcrumbs />
      <h1>Edit content item</h1>
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
                defaultValue={widget?.name}
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
                defaultValue={widget?.content.text}
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
            <Button variant="unstyled" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </div>
        <div className="grid-col-6">
          <label className="text-bold">Preview</label>
          <h3>{title}</h3>
          <ReactMarkdown source={text} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditText;
