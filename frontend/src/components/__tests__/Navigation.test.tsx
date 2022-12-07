/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Navigation from "../Navigation";

describe("Navigation", () => {
    const props = {
        stickyPosition: 0,
        offset: 0,
        widgetNameIds: [
            {
                name: "first widget",
                id: "uuid",
                isInsideSection: false,
                sectionWithTabs: "",
            },
            {
                name: "second widget",
                id: "uuid-2",
                isInsideSection: false,
                sectionWithTabs: "",
            },
        ],
        activeWidgetId: "uuid",
        onBottomOfThePage: jest.fn(),
        isTop: false,
        area: 2,
        marginRight: 0,
        displayTableOfContents: true,
        onClick: jest.fn(),
    };
    test("renders the component", async () => {
        const wrapper = render(
            <Navigation
                stickyPosition={props.stickyPosition}
                offset={props.offset}
                area={props.area}
                marginRight={props.marginRight}
                widgetNameIds={props.widgetNameIds}
                activeWidgetId={props.activeWidgetId}
                isTop={props.isTop}
                displayTableOfContents={props.displayTableOfContents}
                onBottomOfThePage={props.onBottomOfThePage}
                onClick={props.onClick}
            />,
            { wrapper: MemoryRouter },
        );
        expect(wrapper.container).toMatchSnapshot();
    });

    test("renders the component at the top", async () => {
        const wrapper = render(
            <Navigation
                stickyPosition={props.stickyPosition}
                offset={props.offset}
                area={props.area}
                marginRight={props.marginRight}
                widgetNameIds={props.widgetNameIds}
                activeWidgetId={props.activeWidgetId}
                isTop={true}
                displayTableOfContents={props.displayTableOfContents}
                onBottomOfThePage={props.onBottomOfThePage}
                onClick={props.onClick}
            />,
            { wrapper: MemoryRouter },
        );
        expect(wrapper.container).toMatchSnapshot();
    });

    test("click on a navigation link should trigger onClick callback", async () => {
        render(
            <>
                <Navigation
                    stickyPosition={props.stickyPosition}
                    offset={props.offset}
                    area={props.area}
                    marginRight={props.marginRight}
                    widgetNameIds={props.widgetNameIds}
                    activeWidgetId={props.activeWidgetId}
                    isTop={props.isTop}
                    displayTableOfContents={props.displayTableOfContents}
                    onBottomOfThePage={props.onBottomOfThePage}
                    onClick={props.onClick}
                />
                {props.widgetNameIds.map((widget) => (
                    <div id={widget.id} key={widget.id}>
                        {widget.name}
                    </div>
                ))}
            </>,
            { wrapper: MemoryRouter },
        );
        const navigationLink = screen.getByRole("link", {
            name: "second widget",
        });
        fireEvent.click(navigationLink);

        expect(props.onClick).toBeCalled();
    });

    test("click on the navigation link should trigger onClick callback when component at the top", async () => {
        render(
            <>
                <Navigation
                    stickyPosition={props.stickyPosition}
                    offset={props.offset}
                    area={props.area}
                    marginRight={props.marginRight}
                    widgetNameIds={props.widgetNameIds}
                    activeWidgetId={props.activeWidgetId}
                    isTop={true}
                    displayTableOfContents={props.displayTableOfContents}
                    onBottomOfThePage={props.onBottomOfThePage}
                    onClick={props.onClick}
                />
                {props.widgetNameIds.map((widget) => (
                    <div id={widget.id} key={widget.id}>
                        {widget.name}
                    </div>
                ))}
            </>,
            { wrapper: MemoryRouter },
        );
        const navigationLink = screen.getByRole("link", {
            name: "second widget",
        });
        fireEvent.click(navigationLink);

        expect(props.onClick).toBeCalled();
    });

    test("scroll to bottom should trigger onBottomOfThePage callback", async () => {
        render(
            <Navigation
                stickyPosition={props.stickyPosition}
                offset={props.offset}
                area={props.area}
                marginRight={props.marginRight}
                widgetNameIds={props.widgetNameIds}
                activeWidgetId={props.activeWidgetId}
                isTop={props.isTop}
                displayTableOfContents={props.displayTableOfContents}
                onBottomOfThePage={props.onBottomOfThePage}
                onClick={props.onClick}
            />,

            { wrapper: MemoryRouter },
        );
        fireEvent.scroll(window, {
            target: { scrollY: 100 },
        });
        expect(props.onBottomOfThePage).toBeCalled();
    });
});
