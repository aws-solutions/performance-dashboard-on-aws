/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Tab.module.scss";

interface Props {
    itemId: string;
    activeTab: string;
    label: string;
    onClick: Function;
    onEnter: Function;
}

function Tab(props: Props) {
    const { t } = useTranslation();
    const onClick = (e: MouseEvent<HTMLElement>) => {
        props.onClick(props.itemId, e.currentTarget);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
            props.onEnter(props.itemId, e.currentTarget);
        }
    };

    let className = `${styles.tab} display-inline-block padding-x-2 padding-y-105 text-bold font-sans-md`;

    return (
        <div
            id={`${props.itemId}-tab`}
            aria-controls={`${props.itemId}-panel`}
            aria-selected={props.activeTab === props.itemId}
            role="tab"
            className={className}
            onClick={onClick}
            onKeyDown={onKeyDown}
            tabIndex={props.activeTab === props.itemId ? 0 : -1}
        >
            {props.label}
        </div>
    );
}

export default Tab;
