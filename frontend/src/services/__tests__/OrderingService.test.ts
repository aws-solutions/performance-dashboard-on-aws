/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Widget } from "../../models";
import OrderingService, { WidgetTreeData } from "../OrderingService";

function getIdAndSection(widget: Widget): { id: string; section?: string } {
    const item: any = { id: widget.id };
    if (widget.section) {
        item["section"] = widget.section;
    }
    return item;
}

describe("OrderingService", () => {
    let widgets: Array<Widget> = [];
    let tree: WidgetTreeData = { nodes: [], map: {} };
    let indexes: { [key: string]: number } = {};

    beforeEach(() => {
        widgets = [
            {
                id: "banana",
                name: "Banana",
                order: 0,
                widgetType: "Text",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
            {
                id: "strawberry",
                name: "Strawberry",
                order: 1,
                widgetType: "Chart",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
            {
                id: "apple",
                name: "Apple",
                order: 2,
                widgetType: "Table",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
            {
                id: "mango",
                name: "Mango",
                order: 3,
                widgetType: "Section",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
            {
                id: "mango-juice",
                name: "Mango Juice",
                section: "mango",
                order: 4,
                widgetType: "Text",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
            {
                id: "tomato",
                name: "Tomato",
                order: 5,
                widgetType: "Text",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
            {
                id: "orange",
                name: "Orange",
                order: 6,
                widgetType: "Section",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
            {
                id: "orange-juice",
                name: "Orange Juice",
                section: "orange",
                order: 7,
                widgetType: "Text",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
            {
                id: "pear",
                name: "Pear",
                order: 5,
                widgetType: "Text",
                updatedAt: new Date("2020-09-17T21:01:00.780Z"),
                content: {},
                dashboardId: "123",
                showTitle: false,
            },
        ];
        tree = OrderingService.buildTree(widgets);
        indexes = {};
        Object.values(tree.map).forEach((node) => {
            if (node.widget) {
                indexes[node.widget.id] = node.dragIndex;
            }
        });
    });

    it("when no change should return undefined", () => {
        tree.nodes.forEach((node) => {
            const result = OrderingService.moveWidget(tree, node.dragIndex, node.dragIndex);
            expect(result).toBeUndefined();
        });
    });

    it("single item should move to the first position", () => {
        const result = OrderingService.moveWidget(tree, indexes["apple"], 0);
        expect(result?.map(getIdAndSection)).toEqual([
            { id: "apple" },
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move to the last position", () => {
        const result = OrderingService.moveWidget(tree, indexes["apple"], tree.length - 1);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
            { id: "apple" },
        ]);
    });

    it("single item should move downward between single items", () => {
        const result = OrderingService.moveWidget(tree, indexes["apple"], indexes["strawberry"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            { id: "apple" },
            {
                id: "strawberry",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move upward between single items", () => {
        const result = OrderingService.moveWidget(tree, indexes["tomato"], indexes["strawberry"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "tomato",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move downward before a section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["banana"], indexes["apple"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "banana",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move upward before a section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["tomato"], indexes["mango"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "tomato",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move downward after a section position", () => {
        const result = OrderingService.moveWidget(
            tree,
            indexes["banana"],
            indexes["mango-juice"] + 1,
        );
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "banana",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move upward after a section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["pear"], indexes["tomato"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "pear",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
        ]);
    });

    it("single item should move downward to the first section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["banana"], indexes["mango"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "banana",
                section: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move upward to the first section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["tomato"], indexes["mango-juice"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "tomato",
                section: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move downward to the last section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["banana"], indexes["mango-juice"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "banana",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("single item should move upward to the last section position", () => {
        const result = OrderingService.moveWidget(
            tree,
            indexes["tomato"],
            indexes["mango-juice"] + 1,
        );
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "tomato",
                section: "mango",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section item should move downward to outside of the section", () => {
        const result = OrderingService.moveWidget(
            tree,
            indexes["mango-juice"],
            indexes["tomato"] - 1,
        );
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section item should move upward to outside of the section", () => {
        const result = OrderingService.moveWidget(tree, indexes["mango-juice"], indexes["mango"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango-juice",
            },
            {
                id: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section item should move upward to start of another section", () => {
        const result = OrderingService.moveWidget(
            tree,
            indexes["orange-juice"],
            indexes["mango-juice"],
        );
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "orange-juice",
                section: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section item should move downward to the start of another section", () => {
        const result = OrderingService.moveWidget(tree, indexes["mango-juice"], indexes["orange"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "mango-juice",
                section: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section item should move upward to end of another section", () => {
        const result = OrderingService.moveWidget(
            tree,
            indexes["orange-juice"],
            indexes["mango-juice"] + 1,
        );
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "orange-juice",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section item should move downward to the end of another section", () => {
        const result = OrderingService.moveWidget(
            tree,
            indexes["mango-juice"],
            indexes["orange-juice"],
        );
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "mango-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section should move to the first position", () => {
        const result = OrderingService.moveWidget(tree, indexes["mango"], 0);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section should move to the last position", () => {
        const result = OrderingService.moveWidget(tree, indexes["mango"], tree.length - 1);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
        ]);
    });

    it("section should move downward between single items", () => {
        const result = OrderingService.moveWidget(tree, indexes["mango"], indexes["tomato"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "tomato",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section should move upward between single items", () => {
        const result = OrderingService.moveWidget(tree, indexes["orange"], indexes["strawberry"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "tomato",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section should move downward before a section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["mango"], indexes["tomato"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "tomato",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section should move upward before a section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["tomato"], indexes["mango"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "tomato",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section should move downward after a section position", () => {
        const result = OrderingService.moveWidget(
            tree,
            indexes["mango"],
            indexes["orange-juice"] + 1,
        );
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "tomato",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("section should move upward after a section position", () => {
        const result = OrderingService.moveWidget(tree, indexes["orange"], indexes["tomato"]);
        expect(result?.map(getIdAndSection)).toEqual([
            {
                id: "banana",
            },
            {
                id: "strawberry",
            },
            { id: "apple" },
            {
                id: "mango",
            },
            {
                id: "mango-juice",
                section: "mango",
            },
            {
                id: "orange",
            },
            {
                id: "orange-juice",
                section: "orange",
            },
            {
                id: "tomato",
            },
            {
                id: "pear",
            },
        ]);
    });

    it("when moving a section inside another should return undefined", () => {
        const result = OrderingService.moveWidget(tree, indexes["mango"], indexes["orange"] + 1);
        expect(result).toBeUndefined();
    });

    it("when moving a section inside itself should return undefined", () => {
        const result = OrderingService.moveWidget(tree, indexes["mango"], indexes["mango"] + 1);
        expect(result).toBeUndefined();
    });
});
