/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { MouseEvent } from "react";
import styles from "./Tab.module.scss";

interface Props {
    itemId: string;
    activeTab: string;
    label: string;
    onClick: Function;
    onEnter: Function;
}

function Tab({ itemId, activeTab, label, onClick, onEnter }: Props) {
    const onClickHandler = (e: MouseEvent<HTMLElement>) => {
        onClick(itemId, e.currentTarget);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
            onEnter(itemId, e.currentTarget);
        }
    };

    const className = `${styles.tab} display-inline-block padding-x-2 padding-y-105 text-bold font-sans-md`;

    return (
        <div
            id={`${itemId}-tab`}
            aria-controls={`${itemId}-panel`}
            aria-selected={activeTab === itemId}
            role="tab"
            className={className}
            onClick={onClickHandler}
            onKeyDown={onKeyDown}
            tabIndex={activeTab === itemId ? 0 : -1}
        >
            {label}
        </div>
    );
}

export default Tab;
