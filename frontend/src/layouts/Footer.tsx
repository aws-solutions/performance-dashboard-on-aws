/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import packagejson from "../../package.json";
import { useSettings } from "../hooks";
import { useTranslation } from "react-i18next";

function Footer() {
    const { settings, loadingSettings } = useSettings();
    const { t } = useTranslation();

    return (
        <footer>
            <div className="grid-container margin-bottom-9 text-base font-sans-sm">
                {loadingSettings ? (
                    ""
                ) : (
                    <>
                        <hr className="margin-top-9 border-base-lightest" />
                        {t("AdminFooter.HelpMessage")}{" "}
                        <a
                            href={`mailto:${
                                settings.adminContactEmailAddress ?? settings.contactEmailAddress
                            }?subject=${t("AdminFooter.PerformanceDashboardAssistance")}`}
                            className="usa-link"
                        >
                            {t("AdminFooter.ContactSupport")}
                        </a>
                        <span className="float-right">v{packagejson.version}</span>
                    </>
                )}
            </div>
        </footer>
    );
}

export default Footer;
