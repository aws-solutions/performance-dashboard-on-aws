/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Link from "../components/Link";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks";

const APIHelpPage = () => {
    const { t } = useTranslation();
    const { settings } = useSettings();

    return (
        <>
            <h1 className="font-sans-2xl">{t("APIHelpTitle")}</h1>
            <div className="font-sans-lg usa-prose">
                <p>{t("APIHelpByline")}</p>
            </div>
            <h2>{t("APIHelpSelectDynamicDatasetTitle")}</h2>
            <div className="usa-prose">
                <p>
                    {t("APIHelpSelectDynamicDatasetBody")}{" "}
                    <a
                        href={`mailto:${settings.adminContactEmailAddress}?subject=${t(
                            "PerformanceDashboardAssistance",
                        )}`}
                        className="text-base-darker"
                    >
                        {t("APIHelpSelectDynamicDatasetSupport")}
                    </a>
                    {t("APIHelpSelectDynamicDatasetLearn")}{" "}
                    <a
                        href="https://github.com/awslabs/performance-dashboard-on-aws"
                        className="text-base-darker"
                    >
                        {t("APIHelpSelectDynamicDatasetDoc")}
                    </a>
                </p>
            </div>
            <h2>{t("APIHelpSelectStaticDatasetTitle")}</h2>
            <div className="usa-prose">
                <p>{t("APIHelpSelectStaticDatasetBody")}</p>
            </div>
            <h2>{t("APIHelpSelectFileDatasetTitle")}</h2>
            <div className="usa-prose">
                <p>
                    {t("APIHelpSelectFileDatasetBody")}{" "}
                    <Link to="/admin/formatting" target="_blank" external>
                        {t("APIHelpSelectFileDatasetDoc")}
                    </Link>
                </p>
            </div>
        </>
    );
};

export default APIHelpPage;
