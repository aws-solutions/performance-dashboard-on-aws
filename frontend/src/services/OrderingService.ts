/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Metric, Widget, WidgetType } from "../models";

export interface WidgetTreeItemData {
    id: string;
    dragIndex: number;
    label: string;
    children: WidgetTreeItemData[];
    /*
     * If not widget the node is a section end
     */
    widget?: Widget;
    section?: string;
}
export interface WidgetTreeData {
    map: { [key: number]: WidgetTreeItemData };
    nodes: Array<WidgetTreeItemData>;
    length: number;
}

function moveMetric(metrics: Array<Metric>, index: number, newIndex: number): Array<Metric> {
    // If new position is out of bounds, don't move anything.
    if (newIndex < 0 || newIndex >= metrics.length) {
        return metrics;
    }

    // Create a new metrics array so we don't modify the one
    // passed as parameter.
    const reordered = [...metrics];
    const source = reordered[index];
    reordered.splice(index, 1);
    reordered.splice(newIndex, 0, source);

    return reordered;
}

function buildTree(widgets: Widget[]) {
    const data: WidgetTreeData = {
        map: {},
        nodes: [],
        length: 0,
    };
    const sections: { [id: string]: WidgetTreeItemData } = {};

    widgets
        .filter((widget) => !widget.section)
        .forEach((widget, index) => {
            const node: WidgetTreeItemData = {
                id: widget.id,
                dragIndex: 0,
                label: (index + 1).toString(),
                children: [],
                widget: widget,
                section: "",
            };
            data.nodes.push(node);
            sections[widget.id] = node;
        });

    widgets
        .filter((widget) => widget.section)
        .forEach((widget) => {
            const parent = sections[widget.section ?? ""];
            const node: WidgetTreeItemData = {
                id: widget.id,
                dragIndex: 0,
                label: `${parent.label}.${parent.children.length + 1}`,
                children: [],
                widget: widget,
                section: widget.section,
            };
            parent.children.push(node);
        });

    let lastIndex = 0;
    data.nodes.forEach((node) => {
        node.dragIndex = lastIndex++;
        data.map[node.dragIndex] = node;

        node.children.forEach((child) => {
            child.dragIndex = lastIndex++;
            data.map[child.dragIndex] = child;
        });

        if (node.widget && node.widget.widgetType === WidgetType.Section) {
            const divider: WidgetTreeItemData = {
                id: `end-${node.id}`,
                dragIndex: lastIndex++,
                label: "",
                children: [],
                section: node.id,
            };
            node.children.push(divider);
        }
    });

    data.length = lastIndex;
    return data;
}

/**
 * Builds the widget list
 * @param nodes WidgetTreeItemData[]
 * @returns Widget[]
 */
function buildWidgetList(nodes: WidgetTreeItemData[]): Widget[] {
    const widgets: Widget[] = [];
    const sections: { [key: string]: Widget } = {};
    nodes.forEach((node) => {
        if (node.widget) {
            if (node.section !== node.widget.section) {
                node.widget = { ...node.widget, section: node.section };
            }
            const newWidget = { ...node.widget, order: widgets.length };
            if (node.widget.widgetType === WidgetType.Section) {
                sections[node.id] = newWidget;
                newWidget.content.widgetIds = [];
            }
            widgets.push(newWidget);
        }
    });
    // Fix widgetIds inside sections.
    widgets.forEach((widget) => {
        if (widget.section) {
            const section = sections[widget.section];
            if (section) {
                section.content.widgetIds.push(widget.id);
            }
        }
    });
    return widgets;
}

function moveWidget(
    tree: WidgetTreeData,
    sourceIndex: number,
    destinationIndex: number,
): Widget[] | undefined {
    const nodes = tree.nodes.flatMap((node) => {
        const list = [node];
        if (node.widget?.widgetType === WidgetType.Section) {
            node.children.forEach((child) => {
                list.push(child);
            });
        }
        return list;
    });

    // If sourceIndex or destinationIndex are out of bounds, don't move anything.
    if (
        sourceIndex < 0 ||
        sourceIndex >= nodes.length ||
        destinationIndex < 0 ||
        destinationIndex >= nodes.length
    )
        return undefined;

    if (sourceIndex === destinationIndex) {
        return undefined;
    }

    let source = nodes[sourceIndex];
    let destination = nodes[destinationIndex];

    // If moving down
    if (sourceIndex < destinationIndex) {
        // And source is a Section and destination is a nested item.
        if (
            source &&
            source.widget?.widgetType === WidgetType.Section &&
            destination &&
            !!destination.section
        ) {
            const sectionWidget = nodes.find((node) => node.id === destination.section);
            if (source.id === sectionWidget?.id) {
                // And the nested item belongs to the Source Section.
                // Then move the Sectiom to the position of the next item that is not a nested item.
                destinationIndex =
                    (sectionWidget?.dragIndex ?? 0) + (sectionWidget?.children?.length ?? 0) + 1;
            } else {
                // And the nested item does not belong to the Source Section.
                // Then move the Section to the position of the destination item.
                destinationIndex = destinationIndex + 1 - source.children.length;
            }

            // If the destinationIndex is out of bounds, we don't move anything.
            if (destinationIndex >= nodes.length) return undefined;

            destination = nodes[destinationIndex];
        }
        // And source is not a Section
        if (source && source.widget?.widgetType !== WidgetType.Section) {
            // And destination is a Section.
            if (destination && destination.widget?.widgetType === WidgetType.Section) {
                // Then move the widget to inside of the Section
                // assign the new section to the widget.
                source.section = nodes[destinationIndex + 1].section;
            } else if (destination && destination.section) {
                // And destination is a nested item.
                // Then move the widget to inside of the Section
                // assign the new section to the widget.
                source.section = destination.section;
                if (destination.id.startsWith("end-")) {
                    // And destination is the last item of the Section.
                    // Then move widget to outside of the Section
                    source.section = "";
                }
            }
        }
    } else {
        // If moving up.
        // And source is a section and destination is a nested item.
        if (
            source &&
            source.widget?.widgetType === WidgetType.Section &&
            destination &&
            !!destination.section
        ) {
            const sectionWidget = nodes.find((node) => node.id === destination.section);
            // Then move the Section to the position of the previous item that is not a nested item.
            destinationIndex = sectionWidget?.dragIndex ?? 0;
            destination = nodes[destinationIndex];
        }
        if (source && source.widget?.widgetType !== WidgetType.Section) {
            // And source is not a Section
            // Then assign the parent element if of the destination if any.
            source.section = destination.section;
        }
    }

    // move items and it's children
    const items = nodes.splice(sourceIndex, 1 + source.children.length);
    if (destinationIndex > sourceIndex) {
        destinationIndex -= source.children.length;
    }
    // insert the items in the given position
    nodes.splice(destinationIndex, 0, ...items);

    return buildWidgetList(nodes);
}

const OrderingService = {
    moveWidget,
    moveMetric,
    buildTree,
};

export default OrderingService;
