import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import {
  useWidget,
  useDashboard,
  useFullPreview,
  useChangeBackgroundColor,
} from "../hooks";
import Spinner from "../components/Spinner";
import Link from "../components/Link";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
import Alert from "../components/Alert";

interface FormValues {
  title: string;
  showTitle: boolean;
  summary: string;
}

interface PathParams {
  dashboardId: string;
  widgetId: string;
}

function EditSection() {
  const history = useHistory();
  const { dashboardId, widgetId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const { t } = useTranslation();
  const [editingWidget, setEditingWidget] = useState(false);
  const { widget, setWidget } = useWidget(dashboardId, widgetId);
  const { fullPreview, fullPreviewButton } = useFullPreview();

  const onSubmit = async (values: FormValues) => {
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
          title: values.title,
          summary: values.summary,
          widgetIds: widget.content.widgetIds,
        },
        widget.updatedAt
      );
      setEditingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: t("EditSectionScreen.EditSectionSuccess", {
            title: values.title,
          }),
        },
      });
    } catch (err) {
      console.log(t("AddContentFailure"), err);
      setEditingWidget(false);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const onFormChange = () => {
    const { title, showTitle, summary } = getValues();
    setWidget({
      ...widget,
      name: title,
      showTitle: showTitle,
      content: {
        ...widget?.content,
        title,
        summary,
      },
    });
  };

  const crumbs = [
    {
      label: t("Dashboards"),
      url: "/admin/dashboards",
    },
    {
      label: dashboard?.name,
      url: `/admin/dashboard/edit/${dashboardId}`,
    },
  ];

  useChangeBackgroundColor();

  if (!loading && widget) {
    crumbs.push({
      label: t("EditSectionScreen.EditSection"),
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {loading || !widget || editingWidget ? (
        <Spinner
          className="text-center margin-top-9"
          label={`${
            editingWidget
              ? t("EditSectionScreen.EditingSection")
              : t("LoadingSpinnerLabel")
          }`}
        />
      ) : (
        <>
          <div className="grid-row width-desktop grid-gap">
            <div className="grid-col-6" hidden={fullPreview}>
              <PrimaryActionBar>
                <h1 className="margin-top-0">
                  {t("EditSectionScreen.EditSection")}
                </h1>
                <form
                  className="usa-form usa-form--large"
                  onChange={onFormChange}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <fieldset className="usa-fieldset">
                    {errors.title ? (
                      <Alert
                        type="error"
                        message={t("EditSectionScreen.EditSectionError")}
                        slim
                      ></Alert>
                    ) : (
                      ""
                    )}
                    <TextField
                      id="title"
                      name="title"
                      label={t("EditSectionScreen.SectionTitle")}
                      hint={t("EditSectionScreen.SectionTitleHint")}
                      error={
                        errors.title && t("EditSectionScreen.SectionTitleError")
                      }
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
                        {t("EditSectionScreen.ShowTitle")}
                      </label>
                    </div>

                    <TextField
                      id="summary"
                      name="summary"
                      label={t("EditSectionScreen.SectionSummary")}
                      hint={
                        <>
                          {t("EditSectionScreen.SectionSummaryHint")}{" "}
                          <Link target="_blank" to={"/admin/markdown"} external>
                            {t("EditSectionScreen.ViewMarkdownSyntax")}
                          </Link>
                        </>
                      }
                      register={register}
                      defaultValue={widget.content.summary}
                      multiline
                      rows={5}
                    />
                  </fieldset>
                  <br />
                  <br />
                  <hr />
                  <Button disabled={editingWidget} type="submit">
                    {t("Save")}
                  </Button>
                  <Button
                    variant="unstyled"
                    className="text-base-dark hover:text-base-darker active:text-base-darkest"
                    type="button"
                    onClick={onCancel}
                  >
                    {t("Cancel")}
                  </Button>
                </form>
              </PrimaryActionBar>
            </div>
            <div className={fullPreview ? "grid-col-12" : "grid-col-6"}>
              {fullPreviewButton}
              {widget.showTitle ? (
                <h2 className="margin-top-3 margin-left-2px">
                  {widget.content.title}
                </h2>
              ) : (
                ""
              )}
              {widget.content.summary ? (
                <div className="padding-left-05">
                  <MarkdownRender
                    className="usa-prose"
                    source={widget.content.summary}
                  />
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

export default EditSection;
