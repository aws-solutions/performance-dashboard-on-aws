/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import StreamProcessor from "../stream-processor";
import AuditTrailService from "../audit-trail";
import { ItemEvent } from "../../models/auditlog";

jest.mock("../audit-trail");

it("discards a record that is missing the `dynamodb` property", async () => {
    await StreamProcessor.processRecord({
        eventID: "007131",
        eventName: "INSERT",
        eventSource: "aws:dynamodb",
    });
    expect(AuditTrailService.handleItemEvent).not.toBeCalled();
});

it("discards a record which source is not dynamodb", async () => {
    await StreamProcessor.processRecord({
        eventID: "007131",
        eventName: "INSERT",
        eventSource: "aws:bananas",
    });
    expect(AuditTrailService.handleItemEvent).not.toBeCalled();
});

it("handles an INSERT record and delegates to AuditTrail service", async () => {
    await StreamProcessor.processRecord({
        eventID: "007131",
        eventName: "INSERT",
        eventSource: "aws:dynamodb",
        dynamodb: {
            ApproximateCreationDateTime: 1612375403,
            Keys: {
                pk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                sk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
            },
            NewImage: {
                pk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                sk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                type: {
                    S: "Dashboard",
                },
                version: {
                    N: "1",
                },
            },
        },
    });

    expect(AuditTrailService.handleItemEvent).toBeCalledWith(
        ItemEvent.Create,
        null, // no old item
        expect.objectContaining({
            pk: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
            sk: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
            type: "Dashboard",
            version: 1,
        }),
        new Date("2021-02-03T18:03:23.000Z"),
    );
});

it("handles a MODIFY record and delegates to AuditTrail service", async () => {
    await StreamProcessor.processRecord({
        eventID: "9700125",
        eventName: "MODIFY",
        eventSource: "aws:dynamodb",
        dynamodb: {
            ApproximateCreationDateTime: 1612375403,
            Keys: {
                pk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                sk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
            },
            NewImage: {
                pk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                sk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                type: {
                    S: "Dashboard",
                },
                version: {
                    N: "1",
                },
                dashboardName: {
                    S: "Bananas",
                },
            },
            OldImage: {
                pk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                sk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                type: {
                    S: "Dashboard",
                },
                version: {
                    N: "1",
                },
                dashboardName: {
                    S: "My Dashboard",
                },
            },
        },
    });

    expect(AuditTrailService.handleItemEvent).toBeCalledWith(
        ItemEvent.Update,
        // Old item
        expect.objectContaining({
            pk: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
            sk: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
            type: "Dashboard",
            version: 1,
            dashboardName: "My Dashboard",
        }),
        // New item
        expect.objectContaining({
            pk: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
            sk: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
            type: "Dashboard",
            version: 1,
            dashboardName: "Bananas",
        }),
        new Date("2021-02-03T18:03:23.000Z"),
    );
});

it("handles a REMOVE record and delegates to AuditTrail service", async () => {
    await StreamProcessor.processRecord({
        eventID: "1735129",
        eventName: "REMOVE",
        eventSource: "aws:dynamodb",
        dynamodb: {
            ApproximateCreationDateTime: 1612375403,
            Keys: {
                pk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                sk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
            },
            OldImage: {
                pk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                sk: {
                    S: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
                },
                type: {
                    S: "Dashboard",
                },
                version: {
                    N: "1",
                },
            },
        },
    });

    expect(AuditTrailService.handleItemEvent).toBeCalledWith(
        ItemEvent.Delete,
        expect.objectContaining({
            pk: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
            sk: "Dashboard#1dcde43a-9700-41d3-b651-ceee60f7bdf8",
            type: "Dashboard",
            version: 1,
        }),
        null, // no new item
        new Date("2021-02-03T18:03:23.000Z"),
    );
});
