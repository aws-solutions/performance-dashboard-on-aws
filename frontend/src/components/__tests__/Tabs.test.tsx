/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, within, fireEvent, act } from "@testing-library/react";
import Tabs from "../Tabs";
import { MemoryRouter } from "react-router-dom";
import { MockedObserver, traceMethodCalls, IntersectionObserverCB } from "../../testUtils";

describe("Tabs tests", () => {
    let observer: any;
    let mockedObserverCalls: { [k: string]: any } = {};
    beforeEach(() => {
        Object.defineProperty(window, "IntersectionObserver", {
            writable: true,
            value: jest.fn().mockImplementation(function TrackMock(
                cb: IntersectionObserverCB,
                // eslint-disable-next-line no-undef
                options: IntersectionObserverInit,
            ) {
                observer = traceMethodCalls(new MockedObserver(cb, options), mockedObserverCalls);

                return observer;
            }),
        });
    });
    afterEach(() => {
        observer = null;
        mockedObserverCalls = {};
    });

    const tabs = Array(2)
        .fill(0)
        .map((_el, ind) => ({ id: `tab${ind + 1}`, text: `Tab ${ind + 1}` }));
    const renderTabs = (defaultActive: string) => (
        <Tabs defaultActive={defaultActive} ariaLabelledById="tab2test">
            {tabs.map((tab) => (
                <div id={tab.id} label={tab.text} key={tab.id}>
                    {tab.text}
                </div>
            ))}
        </Tabs>
    );
    const getSelectedTab = (container: HTMLElement) =>
        container.querySelector('[aria-selected="true"]');

    test("renders the Tabs component with default tab 2 selected", () => {
        const active = tabs[1];

        const wrapper = render(renderTabs(active.id));

        expect(getSelectedTab(wrapper.container)?.textContent).toEqual(active.text);
        expect(wrapper.container).toMatchSnapshot();
    });

    test("renders the tabs", () => {
        const { container, getByRole, getAllByRole } = render(renderTabs("tab2"), {
            wrapper: MemoryRouter,
        });

        expect(getByRole("tablist")).toBeInTheDocument();
        const listItems = getAllByRole("tab");
        expect(listItems).toHaveLength(2);
        listItems.forEach((item, index) => {
            const { getByText } = within(item);
            expect(getByText(`Tab ${index + 1}`)).toBeInTheDocument();
        });
        expect(container).toMatchSnapshot();
    });

    test("Set active tab by click", () => {
        const defaultActive = tabs[0];
        const newActive = tabs[1];
        const wrapper = render(renderTabs(defaultActive.id));

        expect(getSelectedTab(wrapper.container)?.textContent).toEqual(defaultActive.text);

        act(() => {
            fireEvent.click(wrapper.getByText(newActive.text));
        });

        expect(getSelectedTab(wrapper.container)?.textContent).toEqual(newActive.text);
    });

    test("When new props passed update active tab", () => {
        const defaultActive = tabs[0];
        const newActive = tabs[1];
        const wrapper = render(renderTabs(defaultActive.id));

        wrapper.rerender(renderTabs(newActive.id));

        expect(getSelectedTab(wrapper.container)?.textContent).toEqual(newActive.text);
    });

    test("Switch tabs on ArrowLeft/ArrowRight keys", () => {
        const defaultActive = tabs[0];
        const newActive = tabs[1];
        const { container, getByRole } = render(renderTabs(defaultActive.id));

        act(() => {
            fireEvent.keyDown(getByRole("tablist"), {
                key: "ArrowRight",
                code: "ArrowRight",
            });
        });
        expect(getSelectedTab(container)?.textContent).toEqual(newActive.text);

        act(() => {
            fireEvent.keyDown(getByRole("tablist"), {
                key: "ArrowLeft",
                code: "ArrowLeft",
            });
        });
        expect(getSelectedTab(container)?.textContent).toEqual(defaultActive.text);

        act(() => {
            fireEvent.keyDown(getByRole("tablist"), {
                key: "ArrowLeft",
                code: "ArrowLeft",
            });
        });
        expect(getSelectedTab(container)?.textContent).toEqual(defaultActive.text);
    });
});
