/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import API from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import { OutgoingHttpHeaders } from "http2";
import {
    Dashboard,
    DashboardVersion,
    Dataset,
    PublicDashboard,
    PublicHomepage,
    Widget,
    User,
    DatasetSchema,
    DashboardAuditLog,
} from "../models";

const apiName = "BackendApi";
const publicPath = "public";

async function authHeaders() {
    const token = await getAuthToken();
    return {
        Authorization: "Bearer ".concat(token),
    };
}

async function fetchCsrfToken(): Promise<string> {
    let headers = {};
    if (window.EnvironmentConfig?.authenticationRequired) {
        headers = await authHeaders();
    }
    const data = await API.get(apiName, `${publicPath}/csrf-token`, {
        headers,
        withCredentials: true,
    });
    return data.token;
}

async function addCsrfToken(headers: OutgoingHttpHeaders) {
    const token = await fetchCsrfToken();
    headers["x-csrf-token"] = token;
    return headers;
}

async function getAuthToken() {
    const session = await Auth.currentSession();
    const idToken = session.getIdToken();
    return idToken.getJwtToken();
}

async function fetchDashboards(): Promise<Array<Dashboard>> {
    const headers = await authHeaders();
    return API.get(apiName, "dashboard", { headers });
}

async function fetchDashboardVersions(parentDashboardId: string): Promise<Array<DashboardVersion>> {
    const headers = await authHeaders();
    return API.get(apiName, `dashboard/${parentDashboardId}/versions`, {
        headers,
    });
}

async function fetchDashboardHistory(parentDashboardId: string): Promise<Array<DashboardAuditLog>> {
    const headers = await authHeaders();
    return API.get(apiName, `dashboard/${parentDashboardId}/auditlogs`, {
        headers,
    });
}

async function fetchDashboardById(dashboardId: string): Promise<Dashboard> {
    const headers = await authHeaders();
    return API.get(apiName, `dashboard/${dashboardId}`, { headers });
}

async function fetchPublicDashboardByURL(friendlyURL: string): Promise<Dashboard> {
    let headers = {};
    if (window.EnvironmentConfig?.authenticationRequired) {
        headers = await authHeaders();
    }
    return API.get(apiName, `${publicPath}/dashboard/friendly-url/${friendlyURL}`, { headers });
}

async function fetchPublicHomepageWithQuery(query: string): Promise<PublicHomepage> {
    let headers = {};
    if (window.EnvironmentConfig?.authenticationRequired) {
        headers = await authHeaders();
    }
    if (query === undefined || query === "") {
        return API.get(apiName, `${publicPath}/homepage`, { headers });
    } else {
        return API.get(apiName, `${publicPath}/search?q=${query}`, {
            headers,
        });
    }
}

async function fetchTopicAreas() {
    const headers = await authHeaders();
    return API.get(apiName, "topicarea", { headers });
}

async function fetchTopicAreaById(topicAreaId: string) {
    const headers = await authHeaders();
    return API.get(apiName, `topicarea/${topicAreaId}`, { headers });
}

async function fetchWidgetById(dashboardId: string, widgetId: string): Promise<Widget> {
    const headers = await authHeaders();
    return API.get(apiName, `dashboard/${dashboardId}/widget/${widgetId}`, {
        headers,
    });
}

async function fetchWidgets(dashboardId: string) {
    const headers = await authHeaders();
    return API.get(apiName, `dashboard/${dashboardId}/widgets`, {
        headers,
    });
}

async function createDashboard(name: string, topicAreaId: string, description: string) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, "dashboard", {
        headers,
        withCredentials: true,
        body: {
            name,
            topicAreaId,
            description,
        },
    });
}

async function editDashboard(
    dashboardId: string,
    name: string,
    topicAreaId: string,
    displayTableOfContents: boolean,
    description: string,
    updatedAt: Date,
    tableOfContents?: any,
) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, `dashboard/${dashboardId}`, {
        headers,
        withCredentials: true,
        body: {
            name,
            topicAreaId,
            displayTableOfContents,
            tableOfContents,
            description,
            updatedAt,
        },
    });
}

async function publishDashboard(
    dashboardId: string,
    updatedAt: Date,
    releaseNotes: string,
    friendlyURL?: string,
) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, `dashboard/${dashboardId}/publish`, {
        headers,
        withCredentials: true,
        body: {
            updatedAt,
            releaseNotes,
            friendlyURL,
        },
    });
}

async function deleteDashboards(dashboards: Array<string>) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.del(apiName, `dashboard?ids=${dashboards.join(",")}`, {
        headers,
        withCredentials: true,
    });
}

async function createTopicArea(name: string) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, "topicarea", {
        headers,
        withCredentials: true,
        body: {
            name,
        },
    });
}

async function renameTopicArea(topicAreaId: string, name: string) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, `topicarea/${topicAreaId}`, {
        headers,
        withCredentials: true,
        body: {
            name,
        },
    });
}

async function deleteTopicArea(topicareaId: string) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.del(apiName, `topicarea/${topicareaId}`, {
        headers,
        withCredentials: true,
    });
}

async function archive(dashboardId: string, lastUpdatedAt: Date): Promise<Dashboard> {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, `dashboard/${dashboardId}/archive`, {
        headers,
        withCredentials: true,
        body: {
            updatedAt: lastUpdatedAt,
        },
    });
}

async function createWidget(
    dashboardId: string,
    name: string,
    widgetType: string,
    showTitle: boolean,
    content: object,
) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, `dashboard/${dashboardId}/widget`, {
        headers,
        withCredentials: true,
        body: {
            name,
            widgetType,
            showTitle,
            content,
        },
    });
}

async function editWidget(
    dashboardId: string,
    widgetId: string,
    name: string,
    showTitle: boolean,
    content: object,
    updatedAt: Date,
) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, `dashboard/${dashboardId}/widget/${widgetId}`, {
        headers,
        withCredentials: true,
        body: {
            name,
            showTitle,
            content,
            updatedAt,
        },
    });
}

async function duplicateWidget(
    dashboardId: string,
    widgetId: string,
    updatedAt: Date,
    copyLabel: string,
) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, `dashboard/${dashboardId}/widget/${widgetId}`, {
        headers,
        withCredentials: true,
        body: {
            updatedAt,
            copyLabel,
        },
    });
}

async function deleteWidget(dashboardId: string, widgetId: string) {
    const headers = await authHeaders();
    const url = `dashboard/${dashboardId}/widget/${widgetId}`;
    await addCsrfToken(headers);
    return API.del(apiName, url, {
        headers,
        withCredentials: true,
    });
}

async function setWidgetOrder(dashboardId: string, widgets: Array<Widget>): Promise<Dataset> {
    const headers = await authHeaders();
    const payload = widgets.map((widget) => ({
        id: widget.id,
        updatedAt: widget.updatedAt,
        order: widget.order,
        section: widget.section,
        content: widget.content,
    }));
    await addCsrfToken(headers);
    return API.put(apiName, `dashboard/${dashboardId}/widgetorder`, {
        headers,
        withCredentials: true,
        body: {
            widgets: payload,
        },
    });
}

async function fetchDatasets(): Promise<Array<Dataset>> {
    const headers = await authHeaders();
    return API.get(apiName, "dataset", { headers });
}

async function createDataset(
    fileName: string,
    s3Keys: { raw: string; json: string },
    schema = DatasetSchema.None,
): Promise<Dataset> {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, "dataset", {
        headers,
        withCredentials: true,
        body: {
            fileName,
            s3Key: {
                raw: s3Keys.raw,
                json: s3Keys.json,
            },
            schema,
        },
    });
}

async function fetchHomepage() {
    const headers = await authHeaders();
    return API.get(apiName, "settings/homepage", { headers });
}

async function fetchPublicHomepage() {
    let headers = {};
    if (window.EnvironmentConfig?.authenticationRequired) {
        headers = await authHeaders();
    }
    return API.get(apiName, `${publicPath}/homepage`, { headers });
}

async function editHomepage(title: string, description: string, updatedAt: Date) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, "settings/homepage", {
        headers,
        withCredentials: true,
        body: {
            title,
            description,
            updatedAt,
        },
    });
}

async function fetchSettings() {
    const headers = await authHeaders();
    return API.get(apiName, "settings", { headers });
}

async function fetchPublicSettings() {
    let headers = {};
    if (window.EnvironmentConfig?.authenticationRequired) {
        headers = await authHeaders();
    }
    return API.get(apiName, `${publicPath}/settings`, { headers });
}

async function editSettings(publishingGuidance: string, updatedAt: Date) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, "settings", {
        headers,
        withCredentials: true,
        body: {
            publishingGuidance,
            updatedAt,
        },
    });
}

async function updateSetting(settingKey: string, settingValue: any, updatedAt: Date) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, "settings", {
        headers,
        withCredentials: true,
        body: {
            [settingKey]: settingValue,
            updatedAt,
        },
    });
}

async function fetchPublicDashboard(dashboardId: string): Promise<PublicDashboard> {
    let headers = {};
    if (window.EnvironmentConfig?.authenticationRequired) {
        headers = await authHeaders();
    }
    return API.get(apiName, `${publicPath}/dashboard/${dashboardId}`, {
        headers,
    });
}

async function createDraft(dashboardId: string): Promise<Dashboard> {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, `dashboard/${dashboardId}`, {
        headers,
        withCredentials: true,
    });
}

async function publishPending(
    dashboardId: string,
    lastUpdatedAt: Date,
    releaseNotes?: string,
): Promise<Dashboard> {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, `dashboard/${dashboardId}/publishpending`, {
        headers,
        withCredentials: true,
        body: {
            updatedAt: lastUpdatedAt,
            releaseNotes,
        },
    });
}

async function moveToDraft(dashboardId: string, lastUpdatedAt: Date): Promise<Dashboard> {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, `dashboard/${dashboardId}/draft`, {
        headers,
        withCredentials: true,
        body: {
            updatedAt: lastUpdatedAt,
        },
    });
}

async function fetchUsers(): Promise<User[]> {
    const headers = await authHeaders();
    return API.get(apiName, "user", { headers });
}

async function addUsers(role: string, emails: Array<string>) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, "user", {
        headers,
        withCredentials: true,
        body: {
            role,
            emails: emails.join(","),
        },
    });
}

async function removeUsers(usernames: Array<string>) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.del(apiName, "user", {
        headers,
        withCredentials: true,
        body: {
            usernames,
        },
    });
}

async function resendInvite(emails: Array<string>) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, "user/invite", {
        headers,
        withCredentials: true,
        body: {
            emails: emails.join(","),
        },
    });
}

async function changeRole(role: string, usernames: Array<string>) {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.put(apiName, "user/role", {
        headers,
        withCredentials: true,
        body: {
            role,
            usernames,
        },
    });
}

async function copyDashboard(dashboardId: string): Promise<Dashboard> {
    const headers = await authHeaders();
    await addCsrfToken(headers);
    return API.post(apiName, `dashboard/${dashboardId}/copy`, { headers, withCredentials: true });
}

const BackendService = {
    fetchDashboards,
    fetchDashboardById,
    fetchPublicHomepageWithQuery,
    fetchTopicAreas,
    fetchTopicAreaById,
    fetchWidgetById,
    fetchWidgets,
    editDashboard,
    publishDashboard,
    createDashboard,
    deleteDashboards,
    createTopicArea,
    renameTopicArea,
    deleteTopicArea,
    createWidget,
    editWidget,
    duplicateWidget,
    deleteWidget,
    setWidgetOrder,
    createDataset,
    fetchDatasets,
    getAuthToken,
    fetchHomepage,
    fetchPublicHomepage,
    editHomepage,
    fetchPublicDashboard,
    fetchPublicDashboardByURL,
    fetchSettings,
    fetchPublicSettings,
    editSettings,
    updateSetting,
    publishPending,
    archive,
    createDraft,
    moveToDraft,
    fetchDashboardVersions,
    fetchDashboardHistory,
    fetchUsers,
    addUsers,
    removeUsers,
    resendInvite,
    changeRole,
    copyDashboard,
    fetchCsrfToken,
};

export default BackendService;
