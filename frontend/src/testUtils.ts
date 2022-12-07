/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

export type IntersectionObserverCB = (arg1: IntersectionObserverEntry[]) => void;

export class MockedObserver {
    cb: IntersectionObserverCB;
    options: IntersectionObserverInit;
    elements: HTMLElement[];

    constructor(cb: IntersectionObserverCB, options: IntersectionObserverInit) {
        this.cb = cb;
        this.options = options;
        this.elements = [];
    }

    unobserve(elem: HTMLElement): void {
        this.elements = this.elements.filter((en) => en !== elem);
    }

    observe(elem: HTMLElement): void {
        this.elements = [...Array.from(new Set(this.elements.concat(elem)))];
    }

    disconnect(): void {
        this.elements = [];
    }

    fire(arr: IntersectionObserverEntry[]): void {
        this.cb(arr);
    }
}

export function traceMethodCalls(obj: object | Function, calls: any = {}) {
    const handler: ProxyHandler<object | Function> = {
        get(target, propKey, receiver) {
            const targetValue = Reflect.get(target, propKey, receiver);
            if (typeof targetValue === "function") {
                return function (...args: any[]) {
                    calls[propKey] = (calls[propKey] || []).concat(args);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return targetValue.apply(this, args);
                };
            } else {
                return targetValue;
            }
        },
    };
    return new Proxy(obj, handler);
}

export class MockedResizeObserver {
    observe() {
        // do nothing
    }
    unobserve() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}
