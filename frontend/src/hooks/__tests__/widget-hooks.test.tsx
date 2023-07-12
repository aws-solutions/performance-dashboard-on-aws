/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, screen } from "@testing-library/react";
import { useWidget, useWidgetDataset, useColors } from "../widget-hooks";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import { DatasetType, Widget, WidgetType } from "../../models";
import ColorPaletteService from "../../services/ColorPaletteService";

describe("useWidget", () => {
    interface Props {
        dashboardId: string;
        widgetId: string;
    }
    const FooComponent = (props: Props) => {
        const { widget } = useWidget(props.dashboardId, props.widgetId);
        return (
            <>
                <span>{widget?.name}</span>
            </>
        );
    };

    const sampleWdiget: Widget = {
        id: "uuid",
        name: "Widget",
        widgetType: WidgetType.Table,
        order: 1,
        dashboardId: "uuid",
        showTitle: false,
        content: { s3Key: { json: "json.key" } },
        updatedAt: "2021-01-19T18:27:00Z",
    };

    test("should fetch a table widget", async () => {
        sampleWdiget.content.datasetType = DatasetType.StaticDataset;
        const fetchWidgetByIdSpy = jest
            .spyOn(BackendService, "fetchWidgetById")
            .mockReturnValue(Promise.resolve(sampleWdiget));
        const sampleJson = '{"sample": 500}';
        const downloadJsonSpy = jest
            .spyOn(StorageService, "downloadJson")
            .mockImplementation(async () => await Promise.resolve(JSON.parse(sampleJson)));

        await act(async () => {
            render(<FooComponent dashboardId="uuid" widgetId="uuid" />);
        });

        expect(fetchWidgetByIdSpy).toHaveBeenCalled();
        expect(downloadJsonSpy).toHaveBeenCalled();
        expect(screen.getByText(sampleWdiget.name)).toBeInTheDocument();
    });

    test("should fetch a chart widget", async () => {
        sampleWdiget.widgetType = WidgetType.Chart;
        sampleWdiget.content.datasetType = DatasetType.DynamicDataset;
        const fetchWidgetByIdSpy = jest
            .spyOn(BackendService, "fetchWidgetById")
            .mockReturnValue(Promise.resolve(sampleWdiget));
        const sampleJson = '{"sample": 500}';
        const downloadJsonSpy = jest
            .spyOn(StorageService, "downloadJson")
            .mockImplementation(async () => await Promise.resolve(JSON.parse(sampleJson)));

        await act(async () => {
            render(<FooComponent dashboardId="uuid" widgetId="uuid" />);
        });

        expect(fetchWidgetByIdSpy).toHaveBeenCalled();
        expect(downloadJsonSpy).toHaveBeenCalled();
        expect(screen.getByText(sampleWdiget.name)).toBeInTheDocument();
    });

    test("should fetch a metrics widget", async () => {
        sampleWdiget.widgetType = WidgetType.Metrics;
        const fetchWidgetByIdSpy = jest
            .spyOn(BackendService, "fetchWidgetById")
            .mockReturnValue(Promise.resolve(sampleWdiget));
        const sampleJson = '{"sample": 500}';
        const downloadJsonSpy = jest
            .spyOn(StorageService, "downloadJson")
            .mockImplementation(async () => await Promise.resolve(JSON.parse(sampleJson)));

        await act(async () => {
            render(<FooComponent dashboardId="uuid" widgetId="uuid" />);
        });

        expect(fetchWidgetByIdSpy).toHaveBeenCalled();
        expect(downloadJsonSpy).toHaveBeenCalled();
        expect(screen.getByText(sampleWdiget.name)).toBeInTheDocument();
    });
});

describe("useColors", () => {
    interface Props {
        numberOfColors: number;
        primaryColor?: string;
        secondaryColor?: string;
    }
    const FooComponent = (props: Props) => {
        const { numberOfColors, primaryColor, secondaryColor } = props;
        const colors = useColors(numberOfColors, primaryColor, secondaryColor);
        return (
            <>
                <span>{colors?.length}</span>
            </>
        );
    };

    test("should get the colors", async () => {
        const colorsSample = ["blue", "red"];
        const getColorsSpy = jest
            .spyOn(ColorPaletteService, "getColors")
            .mockImplementation(() => colorsSample);

        await act(async () => {
            render(<FooComponent numberOfColors={2} />);
        });

        expect(getColorsSpy).toHaveBeenCalled();
        expect(screen.getByText(colorsSample.length)).toBeInTheDocument();
    });
});

describe("useWidgetDataset", () => {
    interface Props {
        widget: Widget;
    }
    const FooComponent = (props: Props) => {
        const { jsonHeaders } = useWidgetDataset(props.widget);
        return (
            <>
                <span>{jsonHeaders?.length}</span>
            </>
        );
    };

    const sampleWdiget: Widget = {
        id: "uuid",
        name: "Widget",
        widgetType: WidgetType.Table,
        order: 1,
        dashboardId: "uuid",
        showTitle: false,
        content: { s3Key: { json: "json.key" } },
        updatedAt: "2021-01-19T18:27:00Z",
    };

    test("should fetch the dataset", async () => {
        const sampleJson = JSON.parse('[["country", "population"]]');
        const downloadJsonSpy = jest
            .spyOn(StorageService, "downloadJson")
            .mockImplementation(async () => await Promise.resolve(sampleJson));

        await act(async () => {
            render(<FooComponent widget={sampleWdiget} />);
        });

        expect(downloadJsonSpy).toHaveBeenCalled();
        expect(screen.getByText(sampleJson[0].length)).toBeInTheDocument();
    });
});
