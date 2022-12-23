/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { Widget, WidgetType } from "../models";
import { WidgetTreeItemData } from "../services/OrderingService";

import WidgetTreeItemContent from "./WidgetTreeItemContent";
import WidgetTreeSectionDivider from "./WidgetTreeSectionDivider";

import styles from "./WidgetTreeItem.module.scss";

interface WidgetTreeItemProps {
    node: WidgetTreeItemData;
    isDropDisabled?: boolean;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    onDelete: (widget: Widget) => void;
    onDuplicate: (widget: Widget) => void;
    onMove: (sourceIndex: number, destinationIndex: number) => void;
}

const WidgetTreeItem = (props: WidgetTreeItemProps) => {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = React.useState(false);
    const node = props.node;
    const widget = node.widget;

    const onMoveUp = props.canMoveUp
        ? () => props.onMove(node.dragIndex, node.dragIndex - 1)
        : undefined;
    const onMoveDown = props.canMoveDown
        ? () => props.onMove(node.dragIndex, node.dragIndex + 1)
        : undefined;

    return (
        <li className="nostyle" aria-label={widget?.name}>
            {widget && (
                <div className={props.isDropDisabled ? styles.dropDisable : ""}>
                    <Draggable draggableId={widget.id} index={node.dragIndex}>
                        {(provided, snapshot) => {
                            if (isDragging !== snapshot.isDragging) {
                                setIsDragging(snapshot.isDragging);
                            }
                            return (
                                <div
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    className={`margin-top-1 ${
                                        snapshot.isDragging ? "usa-focus" : ""
                                    }`}
                                >
                                    <WidgetTreeItemContent
                                        label={node.label}
                                        widget={widget}
                                        dragHandleProps={provided.dragHandleProps ?? undefined}
                                        onDuplicate={props.onDuplicate}
                                        onDelete={props.onDelete}
                                        onMoveUp={onMoveUp}
                                        onMoveDown={onMoveDown}
                                    />
                                    {snapshot.isDragging &&
                                        widget.widgetType === WidgetType.Section && (
                                            <div className="bg-base-lightest padding-left-4 padding-top-1 padding-bottom-8">
                                                {node.children.length === 1 && (
                                                    <div className="grid-row flex-1 flex-align-center flex-justify-center">
                                                        <div className="margin-top-4 margin-bottom-neg-2 margin-bottom-0 flex-align-center">
                                                            {t("MoveInOut")}
                                                        </div>
                                                    </div>
                                                )}
                                                {node.children
                                                    .filter((child) => !!child.widget)
                                                    .map((child) => {
                                                        return (
                                                            child.widget && (
                                                                <WidgetTreeItemContent
                                                                    label={child.label}
                                                                    widget={child.widget}
                                                                    onDuplicate={props.onDuplicate}
                                                                    onDelete={props.onDelete}
                                                                    onMoveUp={onMoveUp}
                                                                    onMoveDown={onMoveDown}
                                                                />
                                                            )
                                                        );
                                                    })}
                                            </div>
                                        )}
                                </div>
                            );
                        }}
                    </Draggable>
                    {widget.widgetType === WidgetType.Section && (
                        <div
                            className={`bg-base-lightest padding-left-4 padding-top-1 padding-bottom-8 ${
                                isDragging ? styles.hide : ""
                            }`}
                        >
                            {node.children.length === 1 && (
                                <div className="grid-row flex-1 flex-align-center flex-justify-center">
                                    <div className="margin-top-4 margin-bottom-neg-2 margin-bottom-0 flex-align-center">
                                        {t("MoveInOut")}
                                    </div>
                                </div>
                            )}
                            {node.children.length && (
                                <ol className="widget-tree" aria-label={t("SectionItems")}>
                                    {node.children.map((child) => {
                                        return (
                                            <WidgetTreeItem
                                                key={child.id}
                                                node={child}
                                                isDropDisabled={props.isDropDisabled}
                                                onDuplicate={props.onDuplicate}
                                                onDelete={props.onDelete}
                                                onMove={props.onMove}
                                                canMoveUp={true}
                                                canMoveDown={true}
                                            />
                                        );
                                    })}
                                </ol>
                            )}
                        </div>
                    )}
                </div>
            )}
            {!widget && <WidgetTreeSectionDivider id={node.id} dragIndex={node.dragIndex} />}
        </li>
    );
};

export default WidgetTreeItem;
