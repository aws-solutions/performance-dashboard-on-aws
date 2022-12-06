/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import { useTranslation } from "react-i18next";

const MarkdownSyntax = () => {
    const { t } = useTranslation();

    return (
        <>
            <h1>{t("MarkdownSyntax.Label")}</h1>
            <p className="font-sans-lg">{t("MarkdownSyntax.Description")}</p>

            <h2 className="margin-top-5">{t("MarkdownSyntax.Bold")}</h2>
            <p>{t("MarkdownSyntax.BoldDescription")}</p>
            <table className="usa-table usa-table--borderless" width="100%">
                <thead>
                    <tr>
                        <th style={{ width: "50%" }}>{t("MarkdownSyntax.Markdown")}</th>
                        <th style={{ width: "50%" }}>{t("MarkdownSyntax.RenderedOutput")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{t("MarkdownSyntax.ILoveBoldText")}</td>
                        <td>
                            <MarkdownRender source={t("MarkdownSyntax.ILoveBoldText")} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2 className="margin-top-7">{t("MarkdownSyntax.Hyperlink")}</h2>
            <p>{t("MarkdownSyntax.HyperlinkDescription")}</p>
            <table className="usa-table usa-table--borderless" width="100%">
                <thead>
                    <tr>
                        <th style={{ width: "50%" }}>{t("MarkdownSyntax.Markdown")}</th>
                        <th style={{ width: "50%" }}>{t("MarkdownSyntax.RenderedOutput")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{t("MarkdownSyntax.ILoveAWS")}</td>
                        <td>
                            <MarkdownRender source={t("MarkdownSyntax.ILoveAWS")} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2 className="margin-top-7">{t("MarkdownSyntax.UnorderedList")}</h2>
            <p>{t("MarkdownSyntax.UnorderedListDescription")}</p>
            <table className="usa-table usa-table--borderless" width="100%">
                <thead>
                    <tr>
                        <th style={{ width: "50%" }}>{t("MarkdownSyntax.Markdown")}</th>
                        <th style={{ width: "50%" }}>{t("MarkdownSyntax.RenderedOutput")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div>{t("MarkdownSyntax.FirstItem")}</div>
                            <div>{t("MarkdownSyntax.SecondItem")}</div>
                            <div>{t("MarkdownSyntax.ThirdItem")}</div>
                            <div>{t("MarkdownSyntax.FourthItem")}</div>
                        </td>
                        <td>
                            <MarkdownRender
                                source={`${t("MarkdownSyntax.FirstItem")}
${t("MarkdownSyntax.SecondItem")}
${t("MarkdownSyntax.ThirdItem")}
${t("MarkdownSyntax.FourthItem")}`}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default MarkdownSyntax;
