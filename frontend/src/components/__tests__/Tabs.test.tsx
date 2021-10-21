import React from "react";
import { render, within } from "@testing-library/react";
import Tabs from "../Tabs";
import { MemoryRouter } from "react-router-dom";
import { MockedObserver, traceMethodCalls } from "../../testUtils";
import type { IntersectionObserverCB } from "../../testUtils";

describe("Tabs tests", () => {
  let observer: any;
  let mockedObserverCalls: { [k: string]: any } = {};
  beforeEach(() => {
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: jest
        .fn()
        .mockImplementation(function TrackMock(
          cb: IntersectionObserverCB,
          options: IntersectionObserverInit
        ) {
          observer = traceMethodCalls(
            new MockedObserver(cb, options),
            mockedObserverCalls
          );

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
      <Tabs defaultActive="tab1">
        <div id="tab1" label="Tab 1">
          Tab 1
        </div>
        <div id="tab2" label="Tab 2">
          Tab 2
        </div>
      </Tabs>
    );
    expect(wrapper.container).toMatchSnapshot();
  });

  test("renders the Tabs component with default tab 2 selected", async () => {
    const wrapper = render(
      <Tabs defaultActive="tab2">
        <div id="tab1" label="Tab 1">
          Tab 1
        </div>
        <div id="tab2" label="Tab 2">
          Tab 2
        </div>
      </Tabs>
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
      }
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(2);

    listItems.forEach((item, index) => {
      const { getByText } = within(item);
      expect(getByText(`Tab ${index + 1}`)).toBeInTheDocument();
    });
  });

  test("it should contains .react-horizontal-scrolling-menu--wrapper class for auto scroll to work", () => {
    const wrapper = render(
      <Tabs defaultActive="tab1">
        <div id="tab1" label="Tab 1">
          Tab 1
        </div>
        <div id="tab2" label="Tab 2">
          Tab 2
        </div>
      </Tabs>
    );

    expect(
      wrapper.baseElement.querySelector(
        ".react-horizontal-scrolling-menu--wrapper"
      )
    ).toBeDefined();
  });
});
