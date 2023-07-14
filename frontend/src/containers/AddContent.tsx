/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDashboard, useChangeBackgroundColor } from "../hooks";
import Breadcrumbs from "../components/Breadcrumbs";
import Button from "../components/Button";
import PrimaryActionBar from "../components/PrimaryActionBar";
import RadioButtonsTile from "../components/RadioButtonsTile";
import Alert from "../components/Alert";

interface FormValues {
    widgetType: string;
}

interface PathParams {
    dashboardId: string;
}

function AddContent() {
    const { t } = useTranslation();
    const history = useHistory();
    const { dashboardId } = useParams<PathParams>();
    const { dashboard, loading } = useDashboard(dashboardId);
    const { register, handleSubmit, watch } = useForm<FormValues>();
    const [error, setError] = useState("");

    const widgetType = watch("widgetType");

    useEffect(() => {
        if (error && widgetType) {
            setError("");
        }
    }, [widgetType, error]);

    const onSubmit = async (values: FormValues) => {
        if (values.widgetType === "chart") {
            history.push(`/admin/dashboard/${dashboardId}/add-chart`);
        } else if (values.widgetType === "table") {
            history.push(`/admin/dashboard/${dashboardId}/add-table`);
        } else if (values.widgetType === "text") {
            history.push(`/admin/dashboard/${dashboardId}/add-text`);
        } else if (values.widgetType === "image") {
            history.push(`/admin/dashboard/${dashboardId}/add-image`);
        } else if (values.widgetType === "metrics") {
            history.push(`/admin/dashboard/${dashboardId}/add-metrics`);
        } else if (values.widgetType === "section") {
            history.push(`/admin/dashboard/${dashboardId}/add-section`);
        } else {
            setError(t("AddContentScreen.InvalidWidgetType"));
        }
    };

    const onCancel = () => {
        history.push(`/admin/dashboard/edit/${dashboardId}`);
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
            label: t("AddContentScreen.Title"),
            url: "",
        });
    }

    return (
        <>
            <Breadcrumbs crumbs={crumbs} />
            <div className="grid-row">
                <PrimaryActionBar className="tablet:grid-col-6 grid-col-12">
                    <h1 id="addContentFormHeader" className="margin-top-0">
                        {t("AddContentScreen.Title")}
                    </h1>

                    <form
                        className="usa-form usa-form--large"
                        aria-labelledby="addContentFormHeader"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <fieldset className="usa-fieldset">
                            <legend className="margin-y-1 text-semibold display-inline-block font-sans-lg">
                                {t("AddContentScreen.Instructions")}
                            </legend>

                            {error && <Alert type="error" message={error} slim></Alert>}

                            <RadioButtonsTile
                                isHorizontally={false}
                                register={register}
                                options={[
                                    {
                                        id: "text",
                                        value: "text",
                                        name: "widgetType",
                                        dataTestId: "textRadioButton",
                                        label: t("Text"),
                                        description: t("AddContentScreen.TextDescription"),
                                    },
                                    {
                                        id: "metrics",
                                        value: "metrics",
                                        name: "widgetType",
                                        dataTestId: "metricsRadioButton",
                                        label: t("Metrics"),
                                        description: t("AddContentScreen.MetricsDescription"),
                                    },
                                    {
                                        id: "chart",
                                        value: "chart",
                                        name: "widgetType",
                                        dataTestId: "chartRadioButton",
                                        label: t("Chart"),
                                        description: t("AddContentScreen.ChartDescription"),
                                    },
                                    {
                                        id: "table",
                                        value: "table",
                                        name: "widgetType",
                                        dataTestId: "tableRadioButton",
                                        label: t("Table"),
                                        description: t("AddContentScreen.TableDescription"),
                                    },
                                    {
                                        id: "image",
                                        value: "image",
                                        name: "widgetType",
                                        dataTestId: "imageRadioButton",
                                        label: t("Image"),
                                        description: t("AddContentScreen.ImageDescription"),
                                    },
                                    {
                                        id: "section",
                                        value: "section",
                                        name: "widgetType",
                                        dataTestId: "sectionRadioButton",
                                        label: t("Section"),
                                        description: t("AddContentScreen.SectionDescription"),
                                    },
                                ]}
                            />
                        </fieldset>
                        <br />
                        <hr />
                        <Button
                            variant="base"
                            type="submit"
                            disabledToolTip={
                                !widgetType ? t("AddContentScreen.DisabledToolTip") : ""
                            }
                            className="margin-top-1"
                        >
                            {t("ContinueButton")}
                        </Button>
                        <Button
                            variant="unstyled"
                            type="button"
                            onClick={onCancel}
                            className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-1 "
                        >
                            {t("Cancel")}
                        </Button>
                    </form>
                </PrimaryActionBar>
                <div className="tablet:grid-col-6">
                    {widgetType === "text" && (
                        <img
                            src={`${process.env.PUBLIC_URL}/images/text-content-item.svg`}
                            alt={t("AddContentScreen.TextImageAlt")}
                        />
                    )}

                    {widgetType === "metrics" && (
                        <img
                            src={`${process.env.PUBLIC_URL}/images/metrics-content-item.svg`}
                            alt={t("AddContentScreen.MetricsImageAlt")}
                        />
                    )}

                    {widgetType === "chart" && (
                        <img
                            src={`${process.env.PUBLIC_URL}/images/chart-content-item.svg`}
                            alt={t("AddContentScreen.ChartImageAlt")}
                        />
                    )}

                    {widgetType === "table" && (
                        <img
                            src={`${process.env.PUBLIC_URL}/images/table-content-item.svg`}
                            alt={t("AddContentScreen.TableImageAlt")}
                        />
                    )}

                    {widgetType === "image" && (
                        <img
                            src={`${process.env.PUBLIC_URL}/images/image-content-item.svg`}
                            alt={t("AddContentScreen.ImageAlt")}
                        />
                    )}

                    {widgetType === "section" && (
                        <img
                            src={`${process.env.PUBLIC_URL}/images/section-content-item.svg`}
                            alt={t("AddContentScreen.SectionAlt")}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default AddContent;
