/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import API from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import BackendService from "../BackendService";
import { Widget } from "../../models";

jest.mock("@aws-amplify/api");
jest.mock("@aws-amplify/auth");

let windowSpy: any;

function mockCsrfToken() {
    API.get = jest.fn().mockReturnValueOnce({ token: "csrf-token-value" });
}

function expectedAuthenticatedRequest(obj: any = {}) {
    return expect.objectContaining({
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5c",
            "x-csrf-token": "csrf-token-value",
        },
        withCredentials: true,
        ...obj,
    });
}

beforeEach(() => {
    const getJwtToken = jest.fn().mockReturnValue("eyJhbGciOiJIUzI1NiIsInR5c");
    const getIdToken = jest.fn().mockReturnValue({ getJwtToken });
    Auth.currentSession = jest.fn().mockReturnValue({ getIdToken });

    // Reset mocks before each test
    API.put = jest.fn();
    API.del = jest.fn();
    API.post = jest.fn();
    API.get = jest.fn();

    windowSpy = jest.spyOn(window, "window", "get");
});

afterEach(() => {
    windowSpy.mockRestore();
});

test("fetchCsrfToken makes a GET request", async () => {
    mockCsrfToken();
    await BackendService.fetchCsrfToken();
    expect(API.get).toHaveBeenCalledWith("BackendApi", "public/csrf-token", {
        headers: {},
        withCredentials: true,
    });
});

test("fetchDashboardById makes a GET request to dashboard API", async () => {
    const dashboardId = "123";

    await BackendService.fetchDashboardById(dashboardId);
    expect(API.get).toHaveBeenCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}`,
        expect.anything(),
    );
});

test("fetchPublicHomepageWithQuery makes a GET request to homepage API", async () => {
    const query = "Hello";
    await BackendService.fetchPublicHomepageWithQuery(query);
    expect(API.get).toHaveBeenCalledWith(
        "BackendApi",
        `public/search?q=${query}`,
        expect.anything(),
    );
});

test("fetchPublicHomepageWithQuery(authenticationRequired) makes a GET request to homepage API", async () => {
    windowSpy.mockImplementation(() => ({
        EnvironmentConfig: {
            authenticationRequired: true,
        },
    }));
    const query = "Hello";
    await BackendService.fetchPublicHomepageWithQuery(query);
    expect(API.get).toHaveBeenCalledWith(
        "BackendApi",
        `public/search?q=${query}`,
        expect.anything(),
    );
});

test("fetchPublicHomepageWithQuery(empty query) makes a GET request to homepage API", async () => {
    const query = "";
    await BackendService.fetchPublicHomepageWithQuery(query);
    expect(API.get).toHaveBeenCalledWith("BackendApi", "public/homepage", expect.anything());
});

test("createDashboard should make a POST request with payload", async () => {
    mockCsrfToken();
    const name = "One Pretty Dashboard";
    const description = "Alexa, how is the weather?";
    const topicAreaId = "xyz";

    await BackendService.createDashboard(name, topicAreaId, description);

    expect(API.post).toHaveBeenCalledWith(
        "BackendApi",
        "dashboard",
        expectedAuthenticatedRequest({
            body: {
                name,
                topicAreaId,
                description,
            },
        }),
    );
});

test("editDashboard should make a PUT request with payload", async () => {
    mockCsrfToken();
    const dashboardId = "123";
    const name = "One Pretty Dashboard";
    const description = "Alexa, how is the weather?";
    const topicAreaId = "xyz";
    const displayTableOfContents = false;

    const updatedAt = new Date("2020-09-17T21:01:00.780Z");

    await BackendService.editDashboard(
        dashboardId,
        name,
        topicAreaId,
        displayTableOfContents,
        description,
        updatedAt,
    );

    expect(API.put).toHaveBeenCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}`,
        expectedAuthenticatedRequest({
            body: {
                name,
                topicAreaId,
                displayTableOfContents,
                description,
                updatedAt,
            },
        }),
    );
});

test("publishDashboard should make a PUT request with payload", async () => {
    mockCsrfToken();
    const dashboardId = "123";
    const updatedAt = new Date("2020-09-17T21:01:00.780Z");
    const releaseNotes = "Made changes to the revenue metrics";
    const friendlyURL = "bananas";

    await BackendService.publishDashboard(dashboardId, updatedAt, releaseNotes, friendlyURL);

    expect(API.put).toHaveBeenCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}/publish`,
        expectedAuthenticatedRequest({
            body: {
                updatedAt,
                releaseNotes,
                friendlyURL,
            },
        }),
    );
});

test("deleteDashboards makes a DELETE request to dashboard API", async () => {
    mockCsrfToken();
    const dashboardIds = ["123", "456"];

    await BackendService.deleteDashboards(dashboardIds);
    expect(API.del).toHaveBeenCalledWith(
        "BackendApi",
        `dashboard?ids=123,456`,
        expectedAuthenticatedRequest(),
    );
});

test("createTopicArea should make a POST request with payload", async () => {
    mockCsrfToken();
    const name = "Topic Area 1";

    await BackendService.createTopicArea(name);

    expect(API.post).toHaveBeenCalledWith(
        "BackendApi",
        "topicarea",
        expectedAuthenticatedRequest({
            body: {
                name,
            },
        }),
    );
});

test("deleteTopicArea makes a DELETE request to dashboard API", async () => {
    mockCsrfToken();
    const topicAreaId = "123";
    await BackendService.deleteTopicArea(topicAreaId);
    expect(API.del).toHaveBeenCalledWith(
        "BackendApi",
        `topicarea/123`,
        expectedAuthenticatedRequest(),
    );
});

test("fetchWidgetById makes a GET request to widget API", async () => {
    const dashboardId = "123";
    const widgetId = "abc";

    await BackendService.fetchWidgetById(dashboardId, widgetId);
    expect(API.get).toHaveBeenCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}/widget/${widgetId}`,
        expect.anything(),
    );
});

test("deleteWidget makes a DELETE request to widget API", async () => {
    mockCsrfToken();
    const dashboardId = "123";
    const widgetId = "abc";

    await BackendService.deleteWidget(dashboardId, widgetId);
    expect(API.del).toHaveBeenCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}/widget/${widgetId}`,
        expectedAuthenticatedRequest(),
    );
});

test("setWidgetOrder makes a PUT request to widget API", async () => {
    mockCsrfToken();
    const dashboardId = "123";
    const updatedAt = new Date("2020-09-17T21:01:00.780Z");
    const widgets: Array<Widget> = [
        {
            id: "123",
            name: "Apple",
            order: 1,
            widgetType: "Table",
            dashboardId: "abc",
            updatedAt,
            showTitle: true,
            content: {},
        },
    ];

    await BackendService.setWidgetOrder(dashboardId, widgets);
    expect(API.put).toHaveBeenCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}/widgetorder`,
        expectedAuthenticatedRequest({
            body: {
                widgets: [
                    {
                        id: "123",
                        updatedAt,
                        order: 1,
                        content: {},
                        section: undefined,
                    },
                ],
            },
        }),
    );
});

test("fetchPublicHomepage makes a GET request to widget API", async () => {
    await BackendService.fetchPublicHomepage();
    expect(API.get).toHaveBeenCalledWith("BackendApi", "public/homepage", {
        headers: {},
    });
});

test("fetchPublicHomepage(authenticationRequired) makes a GET request to widget API", async () => {
    windowSpy.mockImplementation(() => ({
        EnvironmentConfig: {
            authenticationRequired: true,
        },
    }));
    await BackendService.fetchPublicHomepage();
    expect(API.get).toHaveBeenCalledWith("BackendApi", "public/homepage", {
        headers: { Authorization: expect.anything() },
    });
});

test("fetchHomepage makes a GET request to widget API", async () => {
    await BackendService.fetchHomepage();
    expect(API.get).toHaveBeenCalledWith("BackendApi", "settings/homepage", expect.anything());
});

test("editHomepage should make a PUT request with payload", async () => {
    mockCsrfToken();
    const title = "123";
    const description = "description test";
    const updatedAt = new Date("2020-09-17T21:01:00.780Z");

    await BackendService.editHomepage(title, description, updatedAt);

    expect(API.put).toHaveBeenCalledWith(
        "BackendApi",
        "settings/homepage",
        expectedAuthenticatedRequest({
            body: {
                title,
                description,
                updatedAt,
            },
        }),
    );
});

test("fetchPublicDashboard makes a GET request to public API", async () => {
    await BackendService.fetchPublicDashboard("123");
    expect(API.get).toHaveBeenCalledWith("BackendApi", "public/dashboard/123", {
        headers: {},
    });
});

test("fetchPublicDashboard(authenticationRequired) makes a GET request to public API", async () => {
    windowSpy.mockImplementation(() => ({
        EnvironmentConfig: {
            authenticationRequired: true,
        },
    }));
    await BackendService.fetchPublicDashboard("123");
    expect(API.get).toHaveBeenCalledWith("BackendApi", "public/dashboard/123", {
        headers: { Authorization: expect.anything() },
    });
});

test("createDraft makes a POST request to dashboard API", async () => {
    mockCsrfToken();
    await BackendService.createDraft("123");
    expect(API.post).toBeCalledWith("BackendApi", "dashboard/123", expectedAuthenticatedRequest());
});

test("publishPending makes a PUT request to dashboard API", async () => {
    mockCsrfToken();
    const lastUpdatedAt = new Date();
    const releaseNotes = "Lorem ipsum";
    await BackendService.publishPending("123", lastUpdatedAt, releaseNotes);
    expect(API.put).toBeCalledWith(
        "BackendApi",
        "dashboard/123/publishpending",
        expectedAuthenticatedRequest({
            body: {
                updatedAt: lastUpdatedAt,
                releaseNotes: releaseNotes,
            },
        }),
    );
});

test("publishPending returns the updated dashboard", async () => {
    mockCsrfToken();
    const lastUpdatedAt = new Date();
    const updatedDashboard = {};
    API.put = jest.fn().mockReturnValueOnce(updatedDashboard);

    const dashboard = await BackendService.publishPending("123", lastUpdatedAt);
    expect(dashboard).toBe(updatedDashboard);
});

test("moveToDraft makes a PUT request to dashboard API", async () => {
    mockCsrfToken();
    const lastUpdatedAt = new Date();
    await BackendService.moveToDraft("123", lastUpdatedAt);
    expect(API.put).toBeCalledWith(
        "BackendApi",
        "dashboard/123/draft",
        expectedAuthenticatedRequest({
            body: {
                updatedAt: lastUpdatedAt,
            },
        }),
    );
});

test("fetchDashboardVersions makes a GET request to dashboard API", async () => {
    await BackendService.fetchDashboardVersions("123");
    expect(API.get).toBeCalledWith("BackendApi", "dashboard/123/versions", expect.anything());
});

test("fetchTopicAreaById makes a GET request to topicarea API", async () => {
    const topicAreaId = "123";
    await BackendService.fetchTopicAreaById(topicAreaId);
    expect(API.get).toHaveBeenCalledWith(
        "BackendApi",
        `topicarea/${topicAreaId}`,
        expect.anything(),
    );
});

test("renameTopicArea makes a PUT request to topicarea API", async () => {
    mockCsrfToken();
    const topicAreaId = "123";
    const newName = "My New Name";
    await BackendService.renameTopicArea(topicAreaId, newName);
    expect(API.put).toHaveBeenCalledWith(
        "BackendApi",
        `topicarea/${topicAreaId}`,
        expectedAuthenticatedRequest({
            body: {
                name: newName,
            },
        }),
    );
});

test("updateSetting makes a PUT request to settings API", async () => {
    mockCsrfToken();
    const settingKey = "publishingGuidance";
    const settingValue = "foo=bar";
    const now = new Date();
    await BackendService.updateSetting(settingKey, settingValue, now);
    expect(API.put).toHaveBeenCalledWith(
        "BackendApi",
        `settings`,
        expectedAuthenticatedRequest({
            body: {
                updatedAt: now,
                publishingGuidance: "foo=bar",
            },
        }),
    );
});

test("fetchDashboardByFriendlyURL makes a GET request to public API", async () => {
    const friendlyURL = "my-friendly-url";
    await BackendService.fetchPublicDashboardByURL(friendlyURL);
    expect(API.get).toHaveBeenCalledWith(
        "BackendApi",
        `public/dashboard/friendly-url/my-friendly-url`,
        { headers: {} },
    );
});

test("fetchDashboardByFriendlyURL(authenticationRequired) makes a GET request to public API", async () => {
    windowSpy.mockImplementation(() => ({
        EnvironmentConfig: {
            authenticationRequired: true,
        },
    }));
    const friendlyURL = "my-friendly-url";
    await BackendService.fetchPublicDashboardByURL(friendlyURL);
    expect(API.get).toHaveBeenCalledWith(
        "BackendApi",
        `public/dashboard/friendly-url/my-friendly-url`,
        { headers: { Authorization: expect.anything() } },
    );
});

test("fetchPublicSettings makes a GET request to public API", async () => {
    await BackendService.fetchPublicSettings();
    expect(API.get).toHaveBeenCalledWith("BackendApi", `public/settings`, {
        headers: {},
    });
});

test("fetchPublicSettings(authenticationRequired) makes a GET request to public API", async () => {
    windowSpy.mockImplementation(() => ({
        EnvironmentConfig: {
            authenticationRequired: true,
        },
    }));
    await BackendService.fetchPublicSettings();
    expect(API.get).toHaveBeenCalledWith("BackendApi", `public/settings`, {
        headers: { Authorization: expect.anything() },
    });
});

test("fetchUsers makes a GET request to users API", async () => {
    await BackendService.fetchUsers();
    expect(API.get).toHaveBeenCalledWith("BackendApi", "user", expect.anything());
});

test("addUsers makes a POST request to users API", async () => {
    mockCsrfToken();
    await BackendService.addUsers("Admin", ["test1@example.com", "test2@example.com"]);
    expect(API.post).toHaveBeenCalledWith(
        "BackendApi",
        "user",
        expectedAuthenticatedRequest({
            body: {
                role: "Admin",
                emails: "test1@example.com,test2@example.com",
            },
        }),
    );
});

test("resendInvite makes a POST request to users API", async () => {
    mockCsrfToken();
    await BackendService.resendInvite(["test1@example.com", "test2@example.com"]);
    expect(API.post).toHaveBeenCalledWith(
        "BackendApi",
        "user/invite",
        expectedAuthenticatedRequest({
            body: {
                emails: "test1@example.com,test2@example.com",
            },
        }),
    );
});

test("changeRole makes a POST request to users API", async () => {
    mockCsrfToken();
    await BackendService.changeRole("Admin", ["test1", "test2"]);
    expect(API.put).toHaveBeenCalledWith(
        "BackendApi",
        "user/role",
        expectedAuthenticatedRequest({
            body: {
                role: "Admin",
                usernames: ["test1", "test2"],
            },
        }),
    );
});

test("fetchDashboardHistory makes a GET request to dashboard API", async () => {
    await BackendService.fetchDashboardHistory("001");
    expect(API.get).toBeCalledWith("BackendApi", "dashboard/001/auditlogs", expect.anything());
});

test("removeUsers makes a DELETE request to the users API", async () => {
    mockCsrfToken();
    await BackendService.removeUsers(["Bob", "Alice"]);
    expect(API.del).toBeCalledWith(
        "BackendApi",
        "user",
        expectedAuthenticatedRequest({
            body: {
                usernames: ["Bob", "Alice"],
            },
        }),
    );
});

test("copyDashboard makes a COPY request to dashboard API", async () => {
    mockCsrfToken();
    const dashboardId = "123";
    await BackendService.copyDashboard(dashboardId);
    expect(API.post).toHaveBeenCalledWith(
        "BackendApi",
        `dashboard/123/copy`,
        expectedAuthenticatedRequest(),
    );
});

test("archive makes a PUT request to dashboard API", async () => {
    mockCsrfToken();
    const dashboardId = "id";
    await BackendService.archive(dashboardId, new Date());
    expect(API.put).toBeCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}/archive`,
        expectedAuthenticatedRequest(),
    );
});

test("fetchWidgets makes a GET request to dashboard API", async () => {
    const dashboardId = "id";
    await BackendService.fetchWidgets(dashboardId);
    expect(API.get).toBeCalledWith("BackendApi", `dashboard/${dashboardId}/widgets`, {
        headers: { Authorization: expect.anything() },
    });
});

test("createWidget makes a POST request to dashboard API", async () => {
    mockCsrfToken();
    const dashboardId = "id";
    const widget = {
        name: "widget",
        widgetType: "Text",
        showTitle: true,
        content: { text: "Title" },
    };
    await BackendService.createWidget(
        dashboardId,
        widget.name,
        widget.widgetType,
        widget.showTitle,
        widget.content,
    );
    expect(API.post).toBeCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}/widget`,
        expectedAuthenticatedRequest(),
    );
});

test("editWidget makes a PUT request to dashboard API", async () => {
    mockCsrfToken();
    const dashboardId = "id";
    const widget = {
        widgetId: "widget-id",
        name: "widget",
        widgetType: "Text",
        showTitle: true,
        content: { text: "Title" },
        updatedAt: new Date(),
    };
    await BackendService.editWidget(
        dashboardId,
        widget.widgetId,
        widget.name,
        widget.showTitle,
        widget.content,
        widget.updatedAt,
    );
    expect(API.put).toBeCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}/widget/${widget.widgetId}`,
        expectedAuthenticatedRequest(),
    );
});

test("duplicateWidget makes a PUT request to dashboard API", async () => {
    mockCsrfToken();
    const dashboardId = "id";
    const widget = {
        widgetId: "widget-id",
        name: "widget",
        widgetType: "Text",
        showTitle: true,
        content: { text: "Title" },
        updatedAt: new Date(),
    };
    await BackendService.duplicateWidget(
        dashboardId,
        widget.widgetId,
        widget.updatedAt,
        "duplicate-label",
    );
    expect(API.post).toBeCalledWith(
        "BackendApi",
        `dashboard/${dashboardId}/widget/${widget.widgetId}`,
        expectedAuthenticatedRequest(),
    );
});

test("fetchDatasets makes a GET request to dashboard API", async () => {
    await BackendService.fetchDatasets();
    expect(API.get).toBeCalledWith("BackendApi", "dataset", expect.anything());
});

test("createDataset makes a POST request to dashboard API", async () => {
    mockCsrfToken();
    await BackendService.createDataset("filename", { raw: "", json: "" });
    expect(API.post).toBeCalledWith("BackendApi", "dataset", expectedAuthenticatedRequest());
});

test("fetchDashboards makes a GET request to dashboard API", async () => {
    await BackendService.fetchDashboards();
    expect(API.get).toBeCalledWith("BackendApi", "dashboard", expect.anything());
});

test("fetchTopicAreas makes a GET request to dashboard API", async () => {
    await BackendService.fetchTopicAreas();
    expect(API.get).toBeCalledWith("BackendApi", "topicarea", expect.anything());
});

test("fetchSettings makes a GET request to dashboard API", async () => {
    await BackendService.fetchSettings();
    expect(API.get).toBeCalledWith("BackendApi", "settings", expect.anything());
});

test("editSettings makes a PUT request to dashboard API", async () => {
    mockCsrfToken();
    await BackendService.editSettings("publishingGuidance", new Date());
    expect(API.put).toBeCalledWith("BackendApi", "settings", expectedAuthenticatedRequest());
});
