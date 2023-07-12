/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, within } from "@testing-library/react";
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

    test("renders the Tabs component", async () => {
        const wrapper = render(
            <Tabs defaultActive="tab1" container="tab1test">
                <div id="tab1" label="Tab 1">
                    Tab 1
                </div>
                <div id="tab2" label="Tab 2">
                    Tab 2
                </div>
            </Tabs>,
        );
        expect(wrapper.container).toMatchSnapshot();
    });

    test("renders the Tabs component with default tab 2 selected", async () => {
        const wrapper = render(
            <Tabs defaultActive="tab2" container="tab2test">
                <div id="tab1" label="Tab 1">
                    Tab 1
                </div>
                <div id="tab2" label="Tab 2">
                    Tab 2
                </div>
            </Tabs>,
        );
        expect(wrapper.container).toMatchSnapshot();
    });

    test("renders the tabs", async () => {
        const { getAllByRole } = render(
            <Tabs defaultActive="tab2">
                <div id="tab1" label="Tab 1">
                    Tab 1
                </div>
                <div id="tab2" label="Tab 2">
                    Tab 2
                </div>
            </Tabs>,
            {
                wrapper: MemoryRouter,
            },
        );

        const listItems = getAllByRole("tab");
        expect(listItems).toHaveLength(2);

        listItems.forEach((item, index) => {
            const { getByText } = within(item);
            expect(getByText(`Tab ${index + 1}`)).toBeInTheDocument();
        });
    });
});
