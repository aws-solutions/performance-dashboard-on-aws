/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    useTopicAreas,
    useDashboard,
    useSettings,
    useChangeBackgroundColor,
    useFullPreview,
    useWindowSize,
} from "../hooks";
import BackendService from "../services/BackendService";
import TextField from "../components/TextField";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import DashboardHeader from "../components/DashboardHeader";
import PrimaryActionBar from "../components/PrimaryActionBar";
import Link from "../components/Link";
import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import AlertContainer from "./AlertContainer";
import { TopicAreaSortingCriteria } from "../models";

interface FormValues {
    name: string;
    topicAreaId: string;
    displayTableOfContents: boolean;
    description: string;
}

interface PathParams {
    dashboardId: string;
}

function EditDetails() {
    const history = useHistory();
    const { settings } = useSettings();
    const { topicareas } = useTopicAreas();
    const { dashboardId } = useParams<PathParams>();
    const { dashboard, loading } = useDashboard(dashboardId);
    const [activeWidgetId, setActiveWidgetId] = useState("");
    const previewPanelId = "preview-details-panel";
    const { fullPreview, fullPreviewButton } = useFullPreview(previewPanelId);
    const { register, errors, handleSubmit, watch, reset } = useForm<FormValues>();
    const windowSize = useWindowSize();
    const isMobile = windowSize.width <= 600;

    const sortedTopicAreas = [...topicareas].sort(TopicAreaSortingCriteria);

    const name = watch("name");
    const description = watch("description");
    const topicAreaId = watch("topicAreaId");
    const displayTableOfContents = watch("displayTableOfContents");

    useEffect(() => {
        if (dashboard) {
            const name = dashboard.name;
            const description = dashboard.description;
            const topicAreaId = dashboard.topicAreaId;
            const displayTableOfContents = dashboard.displayTableOfContents;
            reset({
                name,
                description,
                topicAreaId,
                displayTableOfContents,
            });
        }
    }, [dashboard, reset]);

    const { t } = useTranslation();

    const onDisplayTableOfContentsChange = (value: boolean) => {
        if (!dashboard) {
            return;
        }
    };

    const onSubmit = async (values: FormValues) => {
        await BackendService.editDashboard(
            dashboardId,
            values.name,
            values.topicAreaId,
            values.displayTableOfContents,
            values.description || "",
            dashboard ? dashboard.updatedAt : new Date(),
            {},
        );

        history.push(`/admin/dashboard/edit/${dashboardId}`, {
            alert: {
                type: "success",
                message: `"${values.name}" ${t("EditDetailsSuccess")}`,
            },
            id: "top-alert",
        });
    };

    const getTopicAreaName = (topicAreaId: string) => {
        return topicareas.find((t) => t.id === topicAreaId)?.name || "";
    };

    const onCancel = () => {
        history.push(`/admin/dashboard/edit/${dashboardId}`);
    };

    useChangeBackgroundColor();

    if (loading || !dashboard || !topicareas || topicareas.length === 0) {
        return <Spinner className="text-center margin-top-9" label={t("LoadingSpinnerLabel")} />;
    }

    return (
        <>
            <AlertContainer />
            <Breadcrumbs
                crumbs={[
                    {
                        label: t("Dashboards"),
                        url: "/admin/dashboards",
                    },
                    {
                        label: dashboard.name,
                        url: `/admin/dashboard/edit/${dashboard?.id}`,
                    },
                    {
                        label: t("EditHeader"),
                    },
                ]}
            />

            <div className="grid-row grid-gap">
                <div className="tablet:grid-col-6" hidden={fullPreview}>
                    <div className="grid-row">
                        <div className="grid-col-12">
                            <PrimaryActionBar>
                                <h1 id="editHeaderLabel" className="margin-top-0">
                                    {t("EditHeader")
                                        .split(" ")
                                        .map((word) => {
                                            return word[0].toUpperCase() + word.substring(1);
                                        })
                                        .join(" ")}
                                </h1>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="edit-details-form usa-form usa-form--large"
                                    data-testid="EditDetailsForm"
                                    aria-labelledby="editHeaderLabel"
                                >
                                    <TextField
                                        id="name"
                                        name="name"
                                        label={t("DashboardName")}
                                        error={errors.name && t("ErrorNameSpecify")}
                                        defaultValue={dashboard.name}
                                        register={register}
                                        required
                                    />

                                    <Dropdown
                                        id="topicAreaId"
                                        name="topicAreaId"
                                        label={settings.topicAreaLabels.singular}
                                        hint={`${t(
                                            "SelectExistingLeading",
                                        )} ${settings.topicAreaLabels.singular.toLowerCase()}`}
                                        defaultValue={dashboard.topicAreaId}
                                        register={register}
                                        options={sortedTopicAreas.map((topicarea) => ({
                                            value: topicarea.id,
                                            label: topicarea.name,
                                        }))}
                                        required
                                    />

                                    <div className="usa-form-group">
                                        <label className="usa-label text-bold">
                                            {t("TableOfContents")}
                                        </label>
                                        <div className="usa-hint">
                                            {t("TableOfContentsDescription")}
                                        </div>
                                        <div className="grid-row">
                                            <div className="grid-col text-left">
                                                <div className="usa-checkbox">
                                                    <br />
                                                    <input
                                                        className="usa-checkbox__input"
                                                        id="display-table-of-contents"
                                                        type="checkbox"
                                                        name="displayTableOfContents"
                                                        defaultChecked={
                                                            dashboard &&
                                                            dashboard.displayTableOfContents
                                                        }
                                                        ref={register}
                                                        onChange={(e) =>
                                                            onDisplayTableOfContentsChange(
                                                                e.target.checked,
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        className="usa-checkbox__label margin-top-0"
                                                        htmlFor="display-table-of-contents"
                                                    >
                                                        {t("DisplayTableOfContents")}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <TextField
                                        id="description"
                                        name="description"
                                        label={t("DescriptionOptional")}
                                        defaultValue={dashboard.description}
                                        hint={
                                            <>
                                                {t("CreateEditDashboardDetails")}{" "}
                                                <Link
                                                    target="_blank"
                                                    to={"/admin/markdown"}
                                                    external
                                                >
                                                    {t("CreateEditDashboardDetailsLink")}
                                                </Link>
                                            </>
                                        }
                                        register={register}
                                        multiline
                                        rows={10}
                                    />

                                    <br />
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="margin-top-1"
                                    >
                                        {t("Save")}
                                    </Button>
                                    <Button
                                        variant="unstyled"
                                        type="button"
                                        className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-1"
                                        onClick={onCancel}
                                    >
                                        {t("Cancel")}
                                    </Button>
                                </form>
                            </PrimaryActionBar>
                        </div>
                    </div>
                </div>
                <section
                    className={fullPreview ? "tablet:grid-col-12" : "tablet:grid-col-6"}
                    aria-label={t("ContentPreview")}
                >
                    {isMobile ? <br /> : fullPreviewButton}
                    <div id={previewPanelId} className="margin-top-2">
                        <DashboardHeader
                            name={name}
                            topicAreaName={getTopicAreaName(topicAreaId)}
                            description={description}
                        />
                        <hr
                            style={{
                                border: "none",
                                height: "1px",
                                backgroundColor: "#dfe1e2",
                                margin: "2rem 0",
                            }}
                        />
                        <Navigation
                            stickyPosition={80}
                            offset={80}
                            area={2}
                            marginRight={0}
                            widgetNameIds={dashboard.widgets.map((widget) => {
                                return {
                                    name: widget.name,
                                    id: widget.id,
                                    isInsideSection: !!widget.section,
                                    sectionWithTabs: "",
                                };
                            })}
                            activeWidgetId={activeWidgetId}
                            isTop={false}
                            displayTableOfContents={displayTableOfContents}
                            onBottomOfThePage={() => {}}
                            onClick={setActiveWidgetId}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}

export default EditDetails;
