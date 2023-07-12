/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { Route, RouteProps } from "react-router-dom";
import { useSettings } from "../hooks";
import { useTranslation } from "react-i18next";

interface Props extends RouteProps {
    title: string;
}

function Page({ title, ...routeProps }: Props) {
    const { t } = useTranslation();
    const { settings } = useSettings();

    useEffect(() => {
        const appTitle =
            settings.navbarTitle || t("PageTitle.Default") || "Performance Dashboard on AWS";

        document.title = title ? `${title} - ${appTitle}` : appTitle;
    }, [settings.navbarTitle, t, title]);

    return <Route {...routeProps} />;
}

export default Page;
