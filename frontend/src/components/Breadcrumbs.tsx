/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumbs.scss";
import { useTranslation } from "react-i18next";

interface Props {
    crumbs: Array<{
        label?: string;
        url?: string;
    }>;
}

function Breadcrumbs(props: Props) {
    const { t } = useTranslation();
    return (
        <div className="padding-1">
            <nav className="usa-breadcrumb usa-breadcrumb--wrap" aria-label={t("Breadcrumbs")}>
                <ol className="usa-breadcrumb__list">
                    {props.crumbs?.map((crumb, index) => {
                        return crumb.url ? (
                            <li className="usa-breadcrumb__list-item" key={crumb.label || index}>
                                <Link to={crumb.url} className="usa-breadcrumb__link">
                                    <span>{crumb.label}</span>
                                </Link>
                            </li>
                        ) : (
                            <li
                                className="usa-breadcrumb__list-item usa-current"
                                aria-current="page"
                                key={crumb.label || index}
                            >
                                <span>{crumb.label}</span>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}

export default Breadcrumbs;
