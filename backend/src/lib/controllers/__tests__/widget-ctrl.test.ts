/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import WidgetCtrl from "../widget-ctrl";
import WidgetFactory from "../../factories/widget-factory";
import WidgetRepository from "../../repositories/widget-repo";
import { WidgetType } from "../../models/widget";
import DashboardRepository from "../../repositories/dashboard-repo";

jest.mock("../../repositories/widget-repo");
jest.mock("../../repositories/dashboard-repo");

const user: User = { userId: "johndoe" };
const repository = mocked(WidgetRepository.prototype);
const dashboardRepo = mocked(DashboardRepository.prototype);
let res: Response;

beforeEach(() => {
    WidgetRepository.getInstance = jest.fn().mockReturnValue(repository);
    DashboardRepository.getInstance = jest.fn().mockReturnValue(dashboardRepo);
    res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    } as any as Response;
});

describe("getWidgetById", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
                widgetId: "14507073",
            },
        } as any as Request;
    });

    it("returns a 400 error when dashboardId is missing", async () => {
        delete req.params.id;
        await WidgetCtrl.getWidgetById(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `id`");
    });

    it("returns a 400 error when widgetId is missing", async () => {
        delete req.params.widgetId;
        await WidgetCtrl.getWidgetById(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `widgetId`");
    });

    it("gets the widget", async () => {
        const { id, widgetId } = req.params;

        await WidgetCtrl.getWidgetById(req, res);
        expect(repository.getWidgetById).toBeCalledWith(id, widgetId);
    });
});

describe("createWidget", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
            },
            body: {
                name: "test",
                widgetType: "Text",
                content: {
                    text: "123",
                },
            },
        } as any as Request;
    });

    it("returns a 400 error when dashboardId is missing", async () => {
        delete req.params.id;
        await WidgetCtrl.createWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `id`");
    });

    it("returns a 400 error when name is missing", async () => {
        delete req.body.name;
        await WidgetCtrl.createWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `name`");
    });

    it("returns a 400 error when widgetType is missing", async () => {
        delete req.body.widgetType;
        await WidgetCtrl.createWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `widgetType`");
    });

    it("returns a 400 error when content is missing", async () => {
        delete req.body.content;
        await WidgetCtrl.createWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `content`");
    });

    it("returns 400 bad request error when underline error", async () => {
        WidgetFactory.createWidget = jest.fn().mockImplementationOnce(() => {
            throw new Error();
        });
        await WidgetCtrl.createWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(expect.stringContaining("Bad Request"));
    });

    it("creates the widget", async () => {
        const widget = WidgetFactory.createWidget({
            name: "test",
            dashboardId: "090b0410",
            widgetType: WidgetType.Text,
            showTitle: false,
            content: {
                text: "123",
            },
        });

        WidgetFactory.createWidget = jest.fn().mockReturnValue(widget);
        await WidgetCtrl.createWidget(req, res);
        expect(repository.saveWidget).toBeCalledWith(widget);
    });
});

describe("updateWidget", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
                widgetId: "14507073",
            },
            body: {
                name: "test",
                updatedAt: now,
                showTitle: true,
                content: {
                    text: "123",
                },
            },
        } as any as Request;
    });

    it("returns a 400 error when dashboardId is missing", async () => {
        delete req.params.id;
        await WidgetCtrl.updateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `id`");
    });

    it("returns a 400 error when widgetId is missing", async () => {
        delete req.params.widgetId;
        await WidgetCtrl.updateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `widgetId`");
    });

    it("returns a 400 error when name is missing", async () => {
        delete req.body.name;
        await WidgetCtrl.updateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `name`");
    });

    it("returns a 400 error when updatedAt is missing", async () => {
        delete req.body.updatedAt;
        await WidgetCtrl.updateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `updatedAt`");
    });

    it("returns a 400 error when content is missing", async () => {
        delete req.body.content;
        await WidgetCtrl.updateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `content`");
    });

    it("updates the widget", async () => {
        await WidgetCtrl.updateWidget(req, res);
        expect(repository.updateWidget).toHaveBeenCalledWith({
            dashboardId: "090b0410",
            widgetId: "14507073",
            name: "test",
            content: {
                text: "123",
            },
            lastUpdatedAt: now,
            showTitle: true,
        });
    });
});

describe("duplicateWidget", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
                widgetId: "14507073",
            },
            body: {
                updatedAt: "2023-02-16T01:06:25.788Z",
            },
        } as any as Request;
    });

    it("returns a 400 error when dashboardId is missing", async () => {
        delete req.params.id;
        await WidgetCtrl.duplicateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `id`");
    });

    it("returns a 400 error when widgetId is missing", async () => {
        delete req.params.widgetId;
        await WidgetCtrl.duplicateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `widgetId`");
    });

    it("returns a 400 error when updatedAt is missing", async () => {
        delete req.body.updatedAt;
        await WidgetCtrl.duplicateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `updatedAt`");
    });

    it("returns a 409 error when updatedAt has changed", async () => {
        const widget = {
            id: "6c6b53e2-3f08-41e3-9ba2-81daf6a9c529",
            name: "test",
            order: 0,
            updatedAt: now,
            dashboardId: "090b0410",
            widgetType: "Text",
            showTitle: false,
        };
        repository.getWidgetById = jest.fn().mockReturnValue(widget);

        await WidgetCtrl.duplicateWidget(req, res);
        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalledWith("Someone else updated the widget before us");
    });

    it("returns 400 bad request error when underline error", async () => {
        WidgetFactory.createWidget = jest.fn().mockImplementationOnce(() => {
            throw new Error();
        });
        const widget = {
            id: "6c6b53e2-3f08-41e3-9ba2-81daf6a9c529",
            name: "test",
            order: 0,
            updatedAt: "2023-02-16T01:06:25.788Z",
            dashboardId: "090b0410",
            widgetType: "Section",
            showTitle: false,
            content: { title: "123", widgetIds: ["14507073"] },
        };
        repository.getWidgetById = jest.fn().mockReturnValue(widget);

        await WidgetCtrl.duplicateWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(expect.stringContaining("Bad Request"));
    });

    it("creates the new widget", async () => {
        const widget = {
            id: "6c6b53e2-3f08-41e3-9ba2-81daf6a9c529",
            name: "test",
            order: 0,
            updatedAt: "2023-02-16T01:06:25.788Z",
            dashboardId: "090b0410",
            widgetType: "Section",
            showTitle: false,
            content: { title: "123", widgetIds: ["14507073"] },
        };
        repository.getWidgetById = jest.fn().mockReturnValue(widget);
        WidgetFactory.createWidget = jest.fn().mockReturnValue(widget);
        repository.getWidgetById = jest.fn().mockReturnValue(widget);

        await WidgetCtrl.duplicateWidget(req, res);
        expect(repository.saveWidget).toBeCalledWith(widget);
    });
});

describe("deleteWidget", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
                widgetId: "14507073",
            },
        } as any as Request;
    });

    it("returns a 400 error when dashboardId is missing", async () => {
        delete req.params.id;
        await WidgetCtrl.deleteWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required path param `id`");
    });

    it("returns a 400 error when widgetId is missing", async () => {
        delete req.params.widgetId;
        await WidgetCtrl.deleteWidget(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required path param `widgetId`");
    });

    it("deletes the widget", async () => {
        await WidgetCtrl.deleteWidget(req, res);
        expect(repository.deleteWidget).toBeCalledWith("090b0410", "14507073");
    });
});

describe("setWidgetOrder", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            params: { id: "090b0410" },
            body: {
                widgets: [
                    {
                        id: "abc",
                        order: 1,
                        updatedAt: "2020-09-17T00:24:35",
                    },
                    {
                        id: "xyz",
                        order: 2,
                        updatedAt: "2020-09-17T00:24:35",
                    },
                ],
            },
        } as any as Request;
    });

    it("returns a 400 error when dashboardId is missing", async () => {
        delete req.params.id;
        await WidgetCtrl.setWidgetOrder(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required path param `id`");
    });

    it("returns a 400 error when widgets field is missing", async () => {
        delete req.body.widgets;
        await WidgetCtrl.setWidgetOrder(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `widgets`");
    });

    it("returns 409 error when underline error", async () => {
        repository.setWidgetOrder = jest.fn().mockImplementationOnce(() => {
            throw new Error();
        });

        await WidgetCtrl.setWidgetOrder(req, res);
        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalledWith(
            expect.stringContaining("Unable to reorder widgets, please refetch them and retry"),
        );
    });

    it("sets widget order and updates updatedAt in dashboard", async () => {
        await WidgetCtrl.setWidgetOrder(req, res);
        expect(dashboardRepo.updateAt).toBeCalledWith("090b0410", user);
        expect(repository.setWidgetOrder).toBeCalledWith("090b0410", req.body.widgets);
    });
});
