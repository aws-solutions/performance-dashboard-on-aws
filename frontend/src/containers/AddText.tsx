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

interface FormValues {
  title: string;
  text: string;
  showTitle: boolean;
}

interface PathParams {
  dashboardId: string;
}

function AddText() {
  const history = useHistory();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard, loading } = useDashboard(dashboardId);
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();
  const { t } = useTranslation();
  const [creatingWidget, setCreatingWidget] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [showTitle, setShowTitle] = useState(true);
  const { fullPreview, fullPreviewButton } = useFullPreview();

  const onSubmit = async (values: FormValues) => {
    try {
      setCreatingWidget(true);
      await BackendService.createWidget(
        dashboardId,
        values.title,
        WidgetType.Text,
        values.showTitle,
        {
          text: values.text,
        }
      );
      setCreatingWidget(false);

      history.push(`/admin/dashboard/edit/${dashboardId}`, {
        alert: {
          type: "success",
          message: t("AddTextScreen.AddTextSuccess", { title: values.title }),
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
    const { title, text, showTitle } = getValues();
    setTitle(title);
    setText(text);
    setShowTitle(showTitle);
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
      label: t("AddTextScreen.AddText"),
      url: "",
    });
  }

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      {creatingWidget ? (
        <Spinner
          className="text-center margin-top-6"
          label={t("AddTextScreen.CreatingText")}
        />
      ) : (
        <>
          <div className="grid-row width-desktop grid-gap">
            <div className="grid-col-6" hidden={fullPreview}>
              <PrimaryActionBar>
                <h1 className="margin-top-0">{t("AddTextScreen.AddText")}</h1>

                <div className="text-base text-italic">
                  {t("StepOfTotal", { step: "2", total: "2" })}
                </div>
                <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
                  {t("AddTextScreen.Configure")}
                </div>
                <form
                  className="usa-form usa-form--large"
                  onChange={onFormChange}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <fieldset className="usa-fieldset">
                    {errors.title || errors.text ? (
                      <Alert
                        type="error"
                        message={t("AddTextScreen.AddTextError")}
                        slim
                      ></Alert>
                    ) : (
                      ""
                    )}
                    <TextField
                      id="title"
                      name="title"
                      label={t("AddTextScreen.TextTitle")}
                      hint={t("AddTextScreen.TextTitleHint")}
                      error={errors.title && t("AddTextScreen.TextTitleError")}
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
                        {t("AddTextScreen.ShowTitle")}
                      </label>
                    </div>

                    <TextField
                      id="text"
                      name="text"
                      label={t("Text")}
                      hint={
                        <>
                          {t("AddTextScreen.TextHint")}{" "}
                          <Link target="_blank" to={"/admin/markdown"} external>
                            {t("AddTextScreen.ViewMarkdownSyntax")}
                          </Link>
                        </>
                      }
                      error={errors.text && t("AddTextScreen.TextError")}
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
                    {t("BackButton")}
                  </Button>
                  <Button disabled={creatingWidget} type="submit">
                    {t("AddTextScreen.AddText")}
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
                {text ? (
                  <div className="padding-left-05">
                    <MarkdownRender
                      className="usa-prose textOrSummary"
                      source={text}
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

export default AddText;
