/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode, useState, useEffect, useContext } from "react";
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
    const { initComplete, isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

    const [disabled, setDisabled] = useState(isFirstItemVisible);
    useEffect(() => {
        setDisabled(isFirstItemVisible);
    }, [isFirstItemVisible]);

    return (
        !disabled && (
            <Arrow
                disabled={!initComplete || (initComplete && isFirstItemVisible)}
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
    const { initComplete, isLastItemVisible, scrollNext } = useContext(VisibilityContext);

    const [disabled, setDisabled] = useState(isLastItemVisible);
    useEffect(() => {
        setDisabled(isLastItemVisible);
    }, [isLastItemVisible]);

    return (
        !disabled && (
            <Arrow
                disabled={!initComplete || (initComplete && isLastItemVisible)}
                onClick={() => scrollNext()}
                className="margin-left-2"
                ariaLabel={t("ARIA.NextItems")}
            >
                <FontAwesomeIcon icon={faChevronRight} size="xs" className="margin-left-05" />
            </Arrow>
        )
    );
}
