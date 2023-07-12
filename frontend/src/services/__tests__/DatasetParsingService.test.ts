/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import DatasetParsingService from "../DatasetParsingService";

describe("createHeaderRowJson", () => {
    test("returns empty array given empty data", () => {
        expect(DatasetParsingService.createHeaderRowJson([])).toEqual([]);
    });

    test("returns an array of header rows", () => {
        const data = [
            ["Header1", "Header2"],
            ["Data1", "Data2"],
        ];

        const headerRowJson = [{ Header1: "Data1", Header2: "Data2" }];

        const headerRow = DatasetParsingService.createHeaderRowJson(data);
        expect(headerRow).toEqual(headerRowJson);
    });
});

describe("sortFilteredJson", () => {
    test("no sorting if sortByColumn is undefined", () => {
        const expected = [
            { source: "Non-Renewable", percent: 68 },
            { source: "Renewable", percent: 32 },
        ];
        const input = [
            { source: "Non-Renewable", percent: 68 },
            { source: "Renewable", percent: 32 },
        ];
        const sortByColumn = undefined;
        const sortByDesc = true;
        expect(DatasetParsingService.sortFilteredJson(input, sortByColumn, sortByDesc));
        expect(input).toEqual(expected);
    });

    test("no sorting if sortByDesc is undefined", () => {
        const expected = [
            { source: "Non-Renewable", percent: 68 },
            { source: "Renewable", percent: 32 },
        ];
        const input = [
            { source: "Non-Renewable", percent: 68 },
            { source: "Renewable", percent: 32 },
        ];
        const sortByColumn = "percent";
        const sortByDesc = undefined;
        expect(DatasetParsingService.sortFilteredJson(input, sortByColumn, sortByDesc));
        expect(input).toEqual(expected);
    });

    test("sorted ascending if sortByDesc is false", () => {
        const expected = [
            { source: "Renewable", percent: 32 },
            { source: "Non-Renewable", percent: 68 },
        ];
        const input = [
            { source: "Non-Renewable", percent: 68 },
            { source: "Renewable", percent: 32 },
        ];
        const sortByColumn = "percent";
        const sortByDesc = false;
        expect(DatasetParsingService.sortFilteredJson(input, sortByColumn, sortByDesc));
        expect(input).toEqual(expected);
    });

    test("sorted descending if sortByDesc is true", () => {
        const expected = [
            { source: "Non-Renewable", percent: 68 },
            { source: "Renewable", percent: 32 },
        ];
        const input = [
            { source: "Renewable", percent: 32 },
            { source: "Non-Renewable", percent: 68 },
        ];
        const sortByColumn = "percent";
        const sortByDesc = true;
        expect(DatasetParsingService.sortFilteredJson(input, sortByColumn, sortByDesc));
        expect(input).toEqual(expected);
    });

    test("no sorting if sortByColumn is missing in object.", () => {
        const expected = [{ source: "Non-Renewable" }, { source: "Renewable" }];
        const input = [{ source: "Non-Renewable" }, { source: "Renewable" }];
        const sortByColumn = "percent";
        const sortByDesc = false;
        expect(DatasetParsingService.sortFilteredJson(input, sortByColumn, sortByDesc));
        expect(input).toEqual(expected);
    });
});
