/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import { DashboardState, Dashboard, DashboardVersion } from "../../models/dashboard";
import { InvalidFriendlyURL, ItemNotFound } from "../../errors";
import DashboardCtrl from "../dashboard-ctrl";
import DashboardFactory from "../../factories/dashboard-factory";
import FriendlyURLService from "../../services/friendlyurl-service";
import DashboardRepository from "../../repositories/dashboard-repo";
import TopicAreaRepository from "../../repositories/topicarea-repo";
import { WidgetType } from "../../models/widget";

jest.mock("../../repositories/dashboard-repo");
jest.mock("../../repositories/topicarea-repo");
jest.mock("../../services/friendlyurl-service");

const user: User = { userId: "johndoe" };
const repository = mocked(DashboardRepository.prototype);
const topicareaRepo = mocked(TopicAreaRepository.prototype);
let res: Response;

beforeEach(() => {
    DashboardRepository.getInstance = jest.fn().mockReturnValue(repository);
    TopicAreaRepository.getInstance = jest.fn().mockReturnValue(topicareaRepo);

    res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    } as any as Response;
});

describe("createDashboard", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            body: {
                topicAreaId: "abc",
                name: "test",
                description: "description test",
            },
        } as any as Request;
    });

    it("returns a 400 error when topicAreaId is missing", async () => {
        delete req.body.topicAreaId;
        await DashboardCtrl.createDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `topicAreaId`");
    });

    it("returns a 400 error when name is missing", async () => {
        delete req.body.name;
        await DashboardCtrl.createDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required field `name`");
    });

    it("create the dashboard", async () => {
        const dashboard = DashboardFactory.createNew(
            "123 name",
            "abc",
            "abc name",
            "description test",
            user,
        );
        DashboardFactory.createNew = jest.fn().mockReturnValue(dashboard);
        topicareaRepo.getTopicAreaById = jest.fn().mockReturnThis();
        await DashboardCtrl.createDashboard(req, res);
        expect(repository.putDashboard).toBeCalledWith(dashboard);
    });
});

describe("updateDashboard", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "123",
            },
            body: {
                topicAreaId: "abc",
                name: "123 name",
                description: "description test",
                updatedAt: now.toISOString(),
                displayTableOfContents: false,
                tableOfContents: {},
            },
        } as any as Request;
    });

    it("returns a 400 error when topicAreaId is invalid", async () => {
        topicareaRepo.getTopicAreaById = jest.fn().mockImplementation(() => {
            throw new ItemNotFound();
        });
        await DashboardCtrl.updateDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Invalid `topicAreaId`");
    });

    it("returns a 400 error when name is missing", async () => {
        delete req.body.name;
        await DashboardCtrl.updateDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required body `name`");
    });

    it("returns a 400 error when topicAreaId is missing", async () => {
        delete req.body.topicAreaId;
        await DashboardCtrl.updateDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required body `topicAreaId`");
    });

    it("returns a 400 error when updatedAt is missing", async () => {
        delete req.body.updatedAt;
        await DashboardCtrl.updateDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required body `updatedAt`");
    });

    it("updates the dashboard", async () => {
        topicareaRepo.getTopicAreaById = jest.fn().mockReturnValue({ id: "abc", name: "abc name" });
        await DashboardCtrl.updateDashboard(req, res);
        expect(repository.updateDashboard).toHaveBeenCalledWith(
            "123",
            "123 name",
            "abc",
            "abc name",
            false,
            {},
            "description test",
            now.toISOString(),
            user,
        );
    });
});

describe("publishDashboard", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "123",
            },
            body: {
                updatedAt: now.toISOString(),
                releaseNotes: "release note test",
            },
        } as any as Request;
    });

    it("returns a 400 error when updatedAt is missing", async () => {
        delete req.body.updatedAt;
        await DashboardCtrl.publishDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required body `updatedAt`");
    });

    it("returns a 409 error when friendlyURL is already taken", async () => {
        // Dashboard being published
        repository.getDashboardById = jest.fn().mockReturnValue({
            id: "123",
            version: 1,
            parentDashboardId: "456",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.PublishPending,
            description: "",
        });

        FriendlyURLService.generateOrValidate = jest.fn().mockImplementationOnce(() => {
            throw new InvalidFriendlyURL("The friendlyURL my-dashboard is already being used");
        });

        await DashboardCtrl.publishDashboard(req, res);

        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalledWith("Dashboard must have a unique friendly url");
    });

    it("returns a 409 error when dashboard state is not Publish Pending or Archived", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "456",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Published,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };
        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.publishDashboard(req, res);
        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalledWith("Dashboard must be in publish pending or archived state");
    });

    it("takes the friendlyURL from the request if one is provided", async () => {
        // Dashboard being published
        repository.getDashboardById = jest.fn().mockReturnValue({
            id: "123",
            version: 1,
            parentDashboardId: "456",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.PublishPending,
            description: "",
        });

        FriendlyURLService.generateOrValidate = jest
            .fn()
            .mockReturnValueOnce("user-provided-friendly-url");

        req.body.friendlyURL = "user-provided-friendly-url";
        await DashboardCtrl.publishDashboard(req, res);

        expect(repository.publishDashboard).toHaveBeenCalledWith(
            "123",
            "456",
            now.toISOString(),
            "release note test",
            user,
            "user-provided-friendly-url",
        );

        // Also make sure that we validate the friendlyURL
        expect(FriendlyURLService.generateOrValidate).toBeCalledWith(
            expect.anything(),
            "user-provided-friendly-url",
        );
    });

    it("publishes the dashboard", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "456",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.PublishPending,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };

        FriendlyURLService.generateOrValidate = jest.fn().mockReturnValueOnce("my-dashboard");

        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.publishDashboard(req, res);

        expect(repository.publishDashboard).toHaveBeenCalledWith(
            "123",
            "456",
            now.toISOString(),
            "release note test",
            user,
            "my-dashboard",
        );
    });
});

describe("publishPendingDashboard", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "123",
            },
            body: {
                updatedAt: now.toISOString(),
            },
        } as any as Request;
    });

    it("returns a 400 error when updatedAt is missing", async () => {
        delete req.body.updatedAt;
        await DashboardCtrl.publishPendingDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required body `updatedAt`");
    });

    it("returns a 409 error when dashboard state is not Draft", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Published,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };
        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.publishPendingDashboard(req, res);
        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalledWith("Dashboard must be in draft or publish pending state");
    });

    it("allows the update of release notes", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.PublishPending, // dashboard can already be in publish pending
            description: "",
            widgets: [],
            releaseNotes: "",
        };

        req.body.releaseNotes = "Lorem ipsum";
        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.publishPendingDashboard(req, res);

        expect(res.json).toBeCalled();
        expect(repository.publishPendingDashboard).toHaveBeenCalledWith(
            "123",
            now.toISOString(),
            user,
            "Lorem ipsum",
        );
    });

    it("sets the dashboard to publish pending", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Draft,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };

        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.publishPendingDashboard(req, res);

        expect(repository.publishPendingDashboard).toHaveBeenCalledWith(
            "123",
            now.toISOString(),
            user,
            undefined,
        );
    });
});

describe("archiveDashboard", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "123",
            },
            body: {
                updatedAt: now.toISOString(),
            },
        } as any as Request;
    });

    it("returns a 400 error when updatedAt is missing", async () => {
        delete req.body.updatedAt;
        await DashboardCtrl.archiveDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required body `updatedAt`");
    });

    it("returns a 409 error when dashboard state is not Published", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Inactive,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };
        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.archiveDashboard(req, res);
        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalledWith("Dashboard must be in published state");
    });

    it("update the dashboard", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Published,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };
        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.archiveDashboard(req, res);
        expect(repository.archiveDashboard).toHaveBeenCalledWith("123", now.toISOString(), user);
    });
});

describe("moveToDraftDashboard", () => {
    let req: Request;
    const now = new Date();
    jest.useFakeTimers("modern");
    jest.setSystemTime(now);
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "123",
            },
            body: {
                updatedAt: now.toISOString(),
            },
        } as any as Request;
    });

    it("returns a 400 error when updatedAt is missing", async () => {
        delete req.body.updatedAt;
        await DashboardCtrl.moveToDraftDashboard(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required body `updatedAt`");
    });

    it("returns a 409 error when dashboard state is not publish pending", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Published,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };
        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.moveToDraftDashboard(req, res);
        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalledWith("Dashboard must be in publish pending state");
    });

    it("update the dashboard", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.PublishPending,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };
        repository.getDashboardById = jest.fn().mockReturnValue(dashboard);
        await DashboardCtrl.moveToDraftDashboard(req, res);
        expect(repository.moveToDraft).toHaveBeenCalledWith("123", now.toISOString(), user);
    });
});

describe("deleteDashboard", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
            },
        } as any as Request;
    });

    it("deletes the dashboard", async () => {
        await DashboardCtrl.deleteDashboard(req, res);
        expect(repository.delete).toBeCalledWith("090b0410");
    });
});

describe("deleteDashboards", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            query: {
                ids: "090b0410,76546546",
            },
        } as any as Request;
    });

    it("returns a 400 error when ids is missing", async () => {
        delete req.query.ids;
        await DashboardCtrl.deleteDashboards(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith("Missing required query `ids`");
    });

    it("deletes the dashboard", async () => {
        await DashboardCtrl.deleteDashboards(req, res);
        expect(repository.deleteDashboardsAndWidgets).toBeCalledWith(
            ["090b0410", "76546546"],
            user,
        );
    });
});

describe("getPublicDashboardById", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
            },
        } as any as Request;
    });

    it("returns the public representation of a dashboard", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Published,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };

        repository.getDashboardWithWidgets = jest.fn().mockReturnValue(dashboard);
        const publicDashboard = DashboardFactory.toPublic(dashboard);

        await DashboardCtrl.getPublicDashboardById(req, res);
        expect(res.json).toBeCalledWith(expect.objectContaining(publicDashboard));
    });

    it("returns a 404 error when dashboard not found", async () => {
        repository.getDashboardWithWidgets = jest.fn().mockImplementationOnce(() => {
            throw new ItemNotFound();
        });

        await DashboardCtrl.getPublicDashboardById(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith("Dashboard not found");
    });

    it("returns a 404 error when dashboard is draft", async () => {
        repository.getDashboardWithWidgets = jest.fn().mockReturnValueOnce({
            id: "123",
            name: "My Dashboard",
            state: DashboardState.Draft,
        });

        await DashboardCtrl.getPublicDashboardById(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith("Dashboard not found");
    });

    it("returns a 404 error when dashboard is archived", async () => {
        repository.getDashboardWithWidgets = jest.fn().mockReturnValueOnce({
            id: "123",
            name: "My Dashboard",
            state: DashboardState.Archived,
        });

        await DashboardCtrl.getPublicDashboardById(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith("Dashboard not found");
    });
});

describe("createNewDraft", () => {
    let req: Request;
    let dashboard: Dashboard;
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
            },
        } as any as Request;

        dashboard = {
            id: "090b0410",
            version: 1,
            parentDashboardId: "090b0410",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Published,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
        };
    });

    it("creates a new dashboard in draft state", async () => {
        repository.getDashboardWithWidgets = jest.fn().mockReturnValue(dashboard);
        repository.getCurrentDraft = jest.fn().mockReturnValue(null);

        await DashboardCtrl.createNewDraft(req, res);

        expect(repository.saveDashboardAndWidgets).toBeCalledWith(
            expect.objectContaining({
                parentDashboardId: dashboard.parentDashboardId,
                state: DashboardState.Draft,
            }),
        );
    });

    it("returns a 409 Conflict status code if dashboard is not Published", async () => {
        dashboard.state = DashboardState.Draft; // not published
        repository.getDashboardWithWidgets = jest.fn().mockReturnValue(dashboard);

        await DashboardCtrl.createNewDraft(req, res);

        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalledWith("Dashboard must be Published to create a new draft");
    });

    it("returns existing Draft if there is already one created", async () => {
        const existingDraft = {};
        repository.getDashboardWithWidgets = jest.fn().mockReturnValue(dashboard);
        repository.getCurrentDraft = jest.fn().mockReturnValue(existingDraft);

        await DashboardCtrl.createNewDraft(req, res);
        expect(res.json).toBeCalledWith(existingDraft);
    });
});

describe("getVersions", () => {
    let req: Request;
    let res: Response;
    let dashboard: Dashboard;
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "090b0410",
            },
        } as any as Request;
        res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any as Response;
        const now = new Date();
        dashboard = {
            id: "123",
            name: "Banana",
            version: 1,
            parentDashboardId: "123",
            description: "Something",
            createdBy: "johndoe",
            updatedAt: now,
            state: DashboardState.Published,
            topicAreaId: "xyz",
            topicAreaName: "Health and Human Services",
            displayTableOfContents: false,
        };
    });

    it("returns a list of versions", async () => {
        const dashboards: Dashboard[] = [dashboard];

        repository.getDashboardVersions = jest.fn().mockReturnValue(dashboards);

        const version: DashboardVersion = {
            id: "123",
            version: 1,
            state: DashboardState.Draft,
        };

        DashboardFactory.toVersion = jest.fn().mockReturnValue(version);
        await DashboardCtrl.getVersions(req, res);

        expect(res.json).toBeCalledWith(expect.objectContaining([version]));
    });
});

describe("getPublicDashboardByFriendlyURL", () => {
    let req: Request;
    beforeEach(() => {
        req = {
            params: {
                friendlyURL: "covid-19",
            },
        } as any as Request;
    });

    it("returns the public representation of a dashboard", async () => {
        const dashboard: Dashboard = {
            id: "123",
            version: 1,
            parentDashboardId: "123",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Published,
            description: "",
            widgets: [],
            releaseNotes: "release note test",
            friendlyURL: "covid-19",
        };

        repository.getDashboardByFriendlyURL = jest.fn().mockReturnValue(dashboard);
        repository.getDashboardWithWidgets = jest.fn().mockReturnValue(dashboard);

        const publicDashboard = DashboardFactory.toPublic(dashboard);

        await DashboardCtrl.getPublicDashboardByFriendlyURL(req, res);
        expect(res.json).toBeCalledWith(expect.objectContaining(publicDashboard));
    });

    it("returns a 404 error when dashboard not found", async () => {
        repository.getDashboardByFriendlyURL = jest.fn().mockImplementationOnce(() => {
            throw new ItemNotFound();
        });

        await DashboardCtrl.getPublicDashboardByFriendlyURL(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith("Dashboard not found");
    });

    it("returns a 404 error when dashboard is not published", async () => {
        repository.getDashboardByFriendlyURL = jest.fn().mockReturnValueOnce({
            id: "123",
            name: "My Dashboard",
            state: DashboardState.Draft,
            friendlyURL: "covid-19",
        });

        await DashboardCtrl.getPublicDashboardByFriendlyURL(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith("Dashboard not found");
    });
});

describe("copyDashboard", () => {
    let req: Request;
    let dashboard: Dashboard;
    beforeEach(() => {
        req = {
            user,
            params: {
                id: "abcdef00",
            },
        } as any as Request;

        dashboard = {
            id: "abcdef00",
            version: 3,
            parentDashboardId: "abcdef00",
            name: "My Dashboard",
            topicAreaId: "abc",
            topicAreaName: "My Topic Area",
            displayTableOfContents: false,
            updatedAt: new Date(),
            createdBy: "johndoe",
            state: DashboardState.Published,
            description: "",
            widgets: [
                {
                    id: "12345678",
                    name: "Text Widget",
                    widgetType: WidgetType.Text,
                    dashboardId: "abcdef00",
                    order: 0,
                    updatedAt: new Date(),
                    showTitle: true,
                    content: {
                        text: "Just some simple text.",
                    },
                },
            ],
            releaseNotes: "Release note test",
        };
    });

    it("creates a copy dashboard in draft state", async () => {
        repository.getDashboardWithWidgets = jest.fn().mockReturnValue(dashboard);

        await DashboardCtrl.copyDashboard(req, res);

        expect(repository.saveDashboardAndWidgets).toBeCalledTimes(2);
    });
});
