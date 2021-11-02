import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { WidgetType } from "../models";
import {
  useDashboard,
  useFullPreview,
  useChangeBackgroundColor,
} from "../hooks";
import BackendService from "../services/BackendService";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import Link from "../components/Link";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import PrimaryActionBar from "../components/PrimaryActionBar";
import { useTranslation } from "react-i18next";
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
}

function AddSection() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const { t } = useTranslation();
  const [creatingWidget, setCreatingWidget] = useState(false);
  const [title, setTitle] = useState("");
  const [showTitle, setShowTitle] = useState(true);
  const [summary, setSummary] = useState("");
  const [showWithTabs, setShowWithTabs] = useState(false);
  const [horizontally, setHorizontally] = useState("horizontally");
  const { fullPreview, fullPreviewButton } = useFullPreview();

  const onSubmit = async (values: FormValues) => {
    try {
      setCreatingWidget(true);
      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Section,
        values.showTitle,
        {
          title: values.title,
          summary: values.summary,
          showWithTabs: values.showWithTabs,
          horizontally: values.horizontally === "horizontally",
        }
      );
      setCreatingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: t("AddSectionScreen.AddSectionSuccess", {
            title: values.title,
          }),
        },
      });
    } catch (err) {
      console.log(t("AddContentFailure"), err);
      setCreatingWidget(false);
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const onFormChange = () => {
    const { title, showTitle, summary, showWithTabs, horizontally } =
      getValues();
    setTitle(title);
    setShowTitle(showTitle);
    setSummary(summary);
    setShowWithTabs(showWithTabs);
    setHorizontally(horizontally);
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
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

  if (!loading) {
    crumbs.push({
      label: t("AddSectionScreen.AddSection"),
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {creatingWidget ? (
        <Spinner
          className="text-center margin-top-6"
          label={t("AddSectionScreen.CreatingSection")}
        />
      ) : (
        <>
          <div className="grid-row width-desktop grid-gap">
            <div className="grid-col-6" hidden={fullPreview}>
              <PrimaryActionBar>
                <h1 className="margin-top-0">
                  {t("AddSectionScreen.AddSection")}
                </h1>

                <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
                  {t("AddSectionScreen.Configure")}
                </div>
                <form
                  className="usa-form usa-form--large"
                  onChange={onFormChange}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <fieldset className="usa-fieldset">
                    {errors.title ? (
                      <Alert
                        type="error"
                        message={t("AddSectionScreen.AddSectionError")}
                        slim
                      ></Alert>
                    ) : (
                      ""
                    )}
                    <TextField
                      id="title"
                      name="title"
                      label={t("AddSectionScreen.SectionTitle")}
                      hint={t("AddSectionScreen.SectionTitleHint")}
                      error={
                        errors.title && t("AddSectionScreen.SectionTitleError")
                      }
                      required
                      register={register}
                    />

                    <div className="usa-checkbox">
                      <input
                        className="usa-checkbox__input"
                        id="display-title"
                        type="checkbox"
                        name="showTitle"
                        defaultChecked={true}
                        ref={register()}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="display-title"
                      >
                        {t("AddSectionScreen.ShowTitle")}
                      </label>
                    </div>

                    <TextField
                      id="summary"
                      name="summary"
                      label={t("AddSectionScreen.SectionSummary")}
                      hint={
                        <>
                          {t("AddSectionScreen.SectionSummaryHint")}{" "}
                          <Link target="_blank" to={"/admin/markdown"} external>
                            {t("AddSectionScreen.ViewMarkdownSyntax")}
                          </Link>
                        </>
                      }
                      register={register}
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
                          defaultChecked={false}
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

                    <div hidden={!showWithTabs}>
                      <RadioButtons
                        id="horizontally"
                        name="horizontally"
                        label=""
                        register={register}
                        defaultValue={"horizontally"}
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
                  <Button variant="outline" type="button" onClick={goBack}>
                    {t("BackButton")}
                  </Button>
                  <Button disabled={creatingWidget} type="submit">
                    {t("AddSectionScreen.AddSection")}
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
              <div>
                {fullPreviewButton}
                {showTitle ? (
                  <h2 className="margin-top-3 margin-left-2px">{title}</h2>
                ) : (
                  ""
                )}
                {summary ? (
                  <div className="padding-left-05">
                    <MarkdownRender
                      className="usa-prose textOrSummary"
                      source={summary}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AddSection;
