/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import { useTranslation } from "react-i18next";

function Arrow({
    children,
    disabled,
    onClick,
    className,
    ariaLabel,
}: {
    children: ReactNode;
    disabled: boolean;
    onClick: VoidFunction;
    className: string;
    ariaLabel?: string;
}) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}
            className={`usa-button--unstyled text-base-darker hover:text-base-darkest active:text-base-darkest ${
                className ? className : ""
            }`}
            style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                opacity: disabled ? "0" : "1",
                userSelect: "none",
                textAlign: "center",
                width: "16px",
                marginRight: "4px",
                marginLeft: "4px",
            }}
        >
            {children}
        </button>
    );
}

export function LeftArrow() {
    const { t } = useTranslation();
    const { scrollPrev, useIsVisible } = useContext(VisibilityContext);

    const disabled = useIsVisible("first", true);

    return (
        !disabled && (
            <Arrow
                disabled={disabled}
                onClick={() => scrollPrev()}
                className="margin-right-2"
                ariaLabel={t("ARIA.PreviosItems")}
            >
                <FontAwesomeIcon icon={faChevronLeft} size="xs" className="margin-left-05" />
            </Arrow>
        )
    );
}

export function RightArrow() {
    const { t } = useTranslation();
    const { scrollNext, useIsVisible } = useContext(VisibilityContext);

    const disabled = useIsVisible("last", false);

    return (
        !disabled && (
            <Arrow
                disabled={disabled}
                onClick={() => scrollNext()}
                className="margin-left-2"
                ariaLabel={t("ARIA.NextItems")}
            >
                <FontAwesomeIcon icon={faChevronRight} size="xs" className="margin-left-05" />
            </Arrow>
        )
    );
}
