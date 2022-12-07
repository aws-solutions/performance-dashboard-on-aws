/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { Widget, WidgetType } from "../models";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import Link from "./Link";
import { useTranslation } from "react-i18next";
import WidgetTreeActionMenu from "./WidgetTreeActionMenu";
import Button from "./Button";

interface WidgetTreeItemContentProps {
    label: string;
    widget: Widget;
    onDelete: (widget: Widget) => void;
    onDuplicate: (widget: Widget) => void;
    className?: string;
    dragHandleProps?: DraggableProvidedDragHandleProps;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

const WidgetTreeItemContent = ({
    label,
    widget,
    dragHandleProps,
    className,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
}: WidgetTreeItemContentProps) => {
    const { t } = useTranslation();

    return (
        <div
            className={`border-base-lighter border-1px shadow-1 z-200 radius-lg bg-white grid-col ${
                className ?? ""
            }`}
        >
            <div className="grid-row flex-1">
                <div className="grid-row grid-col flex-1 padding-1">
                    <div
                        className="text-base-darker grid-col flex-3 text-center display-flex flex-align-center flex-justify-center margin-left-2 margin-right-1 margin-top-1 margin-bottom-1"
                        {...dragHandleProps}
                    >
                        <FontAwesomeIcon icon={faGripVertical} size="1x" />
                    </div>
                    <div className="grid-col flex-6 text-center display-flex flex-align-center flex-justify-center font-sans-md margin-left-2 margin-top-1 margin-bottom-1">
                        {label}
                    </div>
                    <div className="grid-col flex-4 grid-row flex-column text-center margin-left-2 margin-right-2">
                        <div className="grid-col flex-6">
                            {onMoveUp ? (
                                <Button
                                    variant="unstyled"
                                    className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                                    ariaLabel={t("MoveContentItemUp", {
                                        name: widget.name,
                                    })}
                                    onClick={onMoveUp}
                                >
                                    <FontAwesomeIcon
                                        id={`${widget.id}-move-up`}
                                        size="xs"
                                        icon={faArrowUp}
                                    />
                                </Button>
                            ) : (
                                <br />
                            )}
                        </div>
                        <div className="grid-col flex-6">
                            {onMoveDown ? (
                                <Button
                                    variant="unstyled"
                                    className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                                    ariaLabel={t("MoveContentItemDown", {
                                        name: widget.name,
                                    })}
                                    onClick={onMoveDown}
                                >
                                    <FontAwesomeIcon
                                        id={`${widget.id}-move-down`}
                                        size="xs"
                                        icon={faArrowDown}
                                    />
                                </Button>
                            ) : (
                                <br />
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-base-lighter border-left"></div>
                <div className="grid-col flex-11 grid-row padding-1 margin-y-1">
                    <div
                        className="grid-col flex-8 usa-tooltip"
                        data-position="bottom"
                        title={widget.name}
                    >
                        <div className="margin-left-1 text-no-wrap overflow-hidden text-overflow-ellipsis text-bold">
                            <Link
                                ariaLabel={t("EditContent", {
                                    name: widget.name,
                                })}
                                to={`/admin/dashboard/${
                                    widget.dashboardId
                                }/edit-${widget.widgetType.toLowerCase()}/${widget.id}`}
                            >
                                {widget.name}
                            </Link>
                        </div>
                    </div>
                    <div className="grid-col flex-3 text-italic text-right">
                        {`(${t(
                            widget.widgetType === WidgetType.Chart
                                ? widget.content.chartType
                                : widget.widgetType,
                        )})`}
                    </div>
                    <div className="grid-col flex-1 margin-left-2 margin-right-2 text-right">
                        <WidgetTreeActionMenu
                            widget={widget}
                            onDuplicate={onDuplicate}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WidgetTreeItemContent;
