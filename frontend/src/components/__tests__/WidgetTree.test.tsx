/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { Widget } from "../../models";
import WidgetTree from "../WidgetTree";
import { MemoryRouter } from "react-router-dom";

const widgets: Array<Widget> = [
    {
        dashboardId: "abc",
        id: "123",
        name: "The benefits of bananas",
        widgetType: "Text",
        showTitle: true,
        order: 1,
        updatedAt: new Date("2020-09-22T20:13:08Z"),
        content: {},
    },
    {
        dashboardId: "abc",
        id: "456",
        name: "The benefits of wine",
        widgetType: "Text",
        showTitle: true,
        order: 2,
        updatedAt: new Date("2020-09-22T20:13:08Z"),
        content: {},
    },
];

const renderWidgetTree = (
    widgets: Array<Widget>,
    {
        onClick,
        onDuplicate,
        onDelete,
        onDrag,
    }: {
        onClick?: Function;
        onDuplicate?: Function;
        onDelete?: Function;
        onDrag?: Function;
    },
) => {
    return render(
        <WidgetTree
            widgets={widgets}
            onClick={onClick ?? jest.fn()}
            onDuplicate={onDuplicate ?? jest.fn()}
            onDelete={onDelete ?? jest.fn()}
            onDrag={onDrag ?? jest.fn()}
        />,
        {
            wrapper: MemoryRouter,
        },
    );
};

test("renders an empty box", async () => {
    const onClick = jest.fn();
    const wrapper = renderWidgetTree(widgets, { onClick });
    expect(wrapper.container).toMatchSnapshot();
});

test("calls the onClick callback when button is pressed", async () => {
    const onClick = jest.fn();
    const wrapper = renderWidgetTree(widgets, { onClick });
    fireEvent.click(wrapper.getByText("+ Add content item"));
    expect(onClick).toBeCalled();
});

test("calls onDelete when user clicks delete button", async () => {
    const onDelete = jest.fn().mockImplementation(() => {
        console.log("!!!!!!!!!!!!!!!!!DELETED!!!!!!!!!!!!!!!!!!!");
    });
    const onClick = jest.fn();
    const wrapper = renderWidgetTree(widgets, { onClick, onDelete });

    await act(async () => {
        fireEvent.click(wrapper.getByLabelText("Actions for The benefits of bananas"));
    });

    await act(async () => {
        fireEvent.click(wrapper.getByLabelText("Delete The benefits of bananas"));
    });

    expect(onDelete).toBeCalled();
});
