/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import RulerService from "../RulerService";

describe("getVisualWidth", () => {
    test("should calculate the width of a letter", () => {
        expect(RulerService.getVisualWidth("M", "monospace", "16px")).toBeDefined();
    });
});

describe("trimToWidth", () => {
    test("should return the same label if length fits", () => {
        expect(RulerService.trimToWidth("M", 1000, "monospace", "16px")).toBe("M");
    });

    test("should replace the full text if not fits", () => {
        expect(RulerService.trimToWidth("M", 0, "monospace", "16px")).toBe("...");
    });
});
