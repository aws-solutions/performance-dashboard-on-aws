/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Link from "../components/Link";
import Footer from "../layouts/Footer";
import { useTranslation } from "react-i18next";

function FourZeroFour() {
    const { t } = useTranslation();

    return (
        <>
            <div className="text-center">
                <p className="font-sans-3xl text-heavy margin-top-9 margin-bottom-1">
                    {t("PageNotFound")}
                </p>
                <hr className="width-tablet border-base-light" />
                <p className="font-sans-md">
                    {t("PageNotFoundDescription")} <Link to="/">homepage</Link>.
                </p>
            </div>
            <Footer />
        </>
    );
}

export default FourZeroFour;
