/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useHistory } from "react-router-dom";
import { useSettings, useTopicAreas } from "../hooks";
import Button from "../components/Button";
import TopicareaListing from "./TopicareaListing";
import SettingsLayout from "../layouts/Settings";
import MarkdownRender from "../components/MarkdownRender";
import { useTranslation } from "react-i18next";
import Spinner from "../components/Spinner";

function TopicareaSettings() {
    const { topicareas, loading, reloadTopicAreas } = useTopicAreas();
    const { settings, loadingSettings } = useSettings();
    const history = useHistory();
    const { t } = useTranslation();

    const onTopicAreaLabelEdit = () => {
        history.push("/admin/settings/topicarea/editlabel");
    };

    return (
        <SettingsLayout>
            {loadingSettings || loading ? (
                <Spinner className="text-center margin-top-9" label={t("LoadingSpinnerLabel")} />
            ) : (
                <>
                    <h1>{t("TopicAreas")}</h1>

                    <p>{t("SettingsTopicAreaDescription")}</p>

                    <h2 className="margin-top-2-important">{t("TopicAreaName")}</h2>

                    <p>{t("SettingsTopicAreaNameDescription")}</p>

                    <div className="grid-row margin-top-0-important">
                        <div className="grid-col flex-9">
                            <h3>{t("TopicAreaNameSingle")}</h3>
                        </div>
                        <div className="grid-col flex-3 text-right">
                            <Button
                                testid={"edittopicarealabel"}
                                className="margin-top-2"
                                variant="outline"
                                onClick={onTopicAreaLabelEdit}
                                ariaLabel={t("SettingsTopicAreaNameEditGeneric")}
                            >
                                {t("Edit")}
                            </Button>
                        </div>
                    </div>
                    <div className="grid-row margin-top-0-important margin-bottom-4">
                        <div className="grid-col flex-9">
                            <div className="published-site font-sans-lg">
                                <MarkdownRender source={settings.topicAreaLabels.singular} />
                            </div>
                        </div>
                        <div className="grid-col flex-3 text-right"></div>
                    </div>
                    <div className="grid-col flex-9">
                        <h3>{t("TopicAreaNamePlural")}</h3>
                    </div>

                    <div className="grid-row margin-top-0-important margin-bottom-4">
                        <div className="grid-col flex-9">
                            <div className="published-site font-sans-lg">
                                <MarkdownRender source={settings.topicAreaLabels.plural} />
                            </div>
                        </div>
                        <div className="grid-col flex-3 text-right"></div>
                    </div>
                    <hr
                        style={{
                            border: "none",
                            height: "1px",
                            backgroundColor: "#dfe1e2",
                            margin: "2rem 0",
                        }}
                    />
                    <TopicareaListing topicareas={topicareas} reloadTopicAreas={reloadTopicAreas} />
                </>
            )}
        </SettingsLayout>
    );
}

export default TopicareaSettings;
