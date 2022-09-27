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
  useWindowSize,
} from "../hooks";
import Spinner from "../components/Spinner";
import Link from "../components/Link";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
import Alert from "../components/Alert";
import RadioButtons from "../components/RadioButtons";

interface FormValues {
  title: string;
  showTitle: boolean;
  summary: string;
  showWithTabs: boolean;
  horizontally: string;
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
  const previewPanelId = "preview-section-panel";
  const { fullPreview, fullPreviewButton } = useFullPreview(previewPanelId);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 600;

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
          showWithTabs: values.showWithTabs,
          horizontally: values.horizontally === "horizontally",
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
    const { title, showTitle, summary, showWithTabs, horizontally } =
      getValues();
    setWidget({
      ...widget,
      name: title,
      showTitle: showTitle,
      content: {
        ...widget?.content,
        title,
        summary,
        showWithTabs,
        horizontally: horizontally === "horizontally",
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
          <div className="grid-row rid-gap">
            <div className="tablet:grid-col-6" hidden={fullPreview}>
              <PrimaryActionBar>
                <h1 id="editSectionFormHeader" className="margin-top-0">
                  {t("EditSectionScreen.EditSection")}
                </h1>
                <form
                  className="usa-form usa-form--large"
                  onChange={onFormChange}
                  onSubmit={handleSubmit(onSubmit)}
                  aria-labelledby="editSectionFormHeader"
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

                    <legend className="usa-hint">
                      {t("EditTextScreen.Configure")}
                    </legend>

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

                    <div>
                      <label className="usa-label text-bold">
                        {t("SectionOptionsLabel")}
                      </label>
                      <div className="usa-hint">
                        {t("SectionOptionsDescription")}
                      </div>
                      <div className="usa-checkbox">
                        <input
                          className="usa-checkbox__input"
                          id="showWithTabs"
                          type="checkbox"
                          name="showWithTabs"
                          defaultChecked={widget.content.showWithTabs}
                          ref={register}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="showWithTabs"
                        >
                          {t("ShowWithTabs")}
                        </label>
                      </div>
                    </div>

                    <div hidden={!widget.content.showWithTabs}>
                      <RadioButtons
                        id="horizontally"
                        name="horizontally"
                        label=""
                        register={register}
                        defaultValue={
                          widget.content.horizontally
                            ? "horizontally"
                            : "vertically"
                        }
                        required
                        options={[
                          {
                            value: "horizontally",
                            label: t("Horizontally"),
                          },
                          {
                            value: "vertically",
                            label: t("Vertically"),
                          },
                        ]}
                        className="margin-top-0"
                      />
                    </div>
                  </fieldset>
                  <br />
                  <br />
                  <hr />
                  <Button
                    disabled={editingWidget}
                    type="submit"
                    className="margin-top-1"
                  >
                    {t("Save")}
                  </Button>
                  <Button
                    variant="unstyled"
                    className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-1"
                    type="button"
                    onClick={onCancel}
                  >
                    {t("Cancel")}
                  </Button>
                </form>
              </PrimaryActionBar>
            </div>
            <section
              className={
                fullPreview ? "tablet:grid-col-12" : "tablet:grid-col-6"
              }
              aria-label={t("ContentPreview")}
            >
              {isMobile ? <br /> : fullPreviewButton}
              <div id={previewPanelId}>
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
                      className="usa-prose textOrSummary"
                      source={widget.content.summary}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}

export default EditSection;
