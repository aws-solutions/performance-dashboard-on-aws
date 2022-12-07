/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import MarkdownRender from "./MarkdownRender";
import ShareButton from "./ShareButton";

type Props = {
    id: string;
    title: string;
    summary: string;
    file: File | undefined;
    summaryBelow: boolean;
    altText: string;
    scalePct: string;
};

const ImageWidget = (props: Props) => {
    const { file, summaryBelow, summary, title, altText, scalePct } = props;

    return (
        <div
            aria-label={title}
            className={`preview-container ${title ? "" : "padding-top-2"}`}
            tabIndex={-1}
        >
            {title && (
                <h2 className="margin-top-3">
                    {title}
                    <ShareButton id={`${props.id}a`} title={title} className="margin-left-1" />
                </h2>
            )}
            {!summaryBelow && (
                <MarkdownRender
                    source={summary}
                    className="usa-prose margin-top-0 margin-bottom-3 imageSummaryAbove textOrSummary"
                />
            )}
            <div>
                <img
                    src={file ? URL.createObjectURL(file) : ""}
                    alt={altText}
                    width={scalePct}
                    height="auto"
                ></img>
            </div>
            {summaryBelow && (
                <MarkdownRender
                    source={summary}
                    className="usa-prose margin-top-3 margin-bottom-0 imageSummaryBelow textOrSummary"
                />
            )}
        </div>
    );
};

export default ImageWidget;
