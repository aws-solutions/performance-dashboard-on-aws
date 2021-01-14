import API from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import {
  Dashboard,
  DashboardVersion,
  Dataset,
  PublicDashboard,
  Widget,
  User,
} from "../models";

const apiName = "BackendApi";

async function authHeaders() {
  const token = await getAuthToken();
  return {
    Authorization: "Bearer ".concat(token),
  };
}

async function getAuthToken() {
  const session = await Auth.currentSession();
  const idToken = session.getIdToken();
  return idToken.getJwtToken();
}

async function fetchDashboards(): Promise<Array<Dashboard>> {
  const headers = await authHeaders();
  return await API.get(apiName, "dashboard", { headers });
}

async function fetchDashboardVersions(
  parentDashboardId: string
): Promise<Array<DashboardVersion>> {
  const headers = await authHeaders();
  return await API.get(apiName, `dashboard/${parentDashboardId}/versions`, {
    headers,
  });
}

async function fetchDashboardById(dashboardId: string): Promise<Dashboard> {
  const headers = await authHeaders();
  return await API.get(apiName, `dashboard/${dashboardId}`, { headers });
}

async function fetchPublicDashboardByURL(
  friendlyURL: string
): Promise<Dashboard> {
  return await API.get(
    apiName,
    `public/dashboard/friendly-url/${friendlyURL}`,
    {}
  );
}

async function fetchTopicAreas() {
  const headers = await authHeaders();
  return await API.get(apiName, "topicarea", { headers });
}

async function fetchTopicAreaById(topicAreaId: string) {
  const headers = await authHeaders();
  return await API.get(apiName, `topicarea/${topicAreaId}`, { headers });
}

async function fetchWidgetById(
  dashboardId: string,
  widgetId: string
): Promise<Widget> {
  const headers = await authHeaders();
  return await API.get(apiName, `dashboard/${dashboardId}/widget/${widgetId}`, {
    headers,
  });
}

async function fetchWidgets(dashboardId: string) {
  const headers = await authHeaders();
  return await API.get(apiName, `dashboard/${dashboardId}/widgets`, {
    headers,
  });
}

async function createDashboard(
  name: string,
  topicAreaId: string,
  description: string
) {
  const headers = await authHeaders();
  return await API.post(apiName, "dashboard", {
    headers,
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
  description: string,
  updatedAt: Date
) {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}`, {
    headers,
    body: {
      name,
      topicAreaId,
      description,
      updatedAt,
    },
  });
}

async function publishDashboard(
  dashboardId: string,
  updatedAt: Date,
  releaseNotes: string
) {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}/publish`, {
    headers,
    body: {
      updatedAt,
      releaseNotes,
    },
  });
}

async function deleteDashboards(dashboards: Array<string>) {
  const headers = await authHeaders();
  return await API.del(apiName, `dashboard?ids=${dashboards.join(",")}`, {
    headers,
  });
}

async function createTopicArea(name: string) {
  const headers = await authHeaders();
  return await API.post(apiName, "topicarea", {
    headers,
    body: {
      name,
    },
  });
}

async function renameTopicArea(topicAreaId: string, name: string) {
  const headers = await authHeaders();
  return await API.put(apiName, `topicarea/${topicAreaId}`, {
    headers,
    body: {
      name,
    },
  });
}

async function deleteTopicArea(topicareaId: string) {
  const headers = await authHeaders();
  return await API.del(apiName, `topicarea/${topicareaId}`, {
    headers,
  });
}

async function archive(
  dashboardId: string,
  lastUpdatedAt: Date
): Promise<Dashboard> {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}/archive`, {
    headers,
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
  content: object
) {
  const headers = await authHeaders();
  return await API.post(apiName, `dashboard/${dashboardId}/widget`, {
    headers,
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
  updatedAt: Date
) {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}/widget/${widgetId}`, {
    headers,
    body: {
      name,
      showTitle,
      content,
      updatedAt,
    },
  });
}

async function deleteWidget(dashboardId: string, widgetId: string) {
  const headers = await authHeaders();
  const url = `dashboard/${dashboardId}/widget/${widgetId}`;
  return await API.del(apiName, url, {
    headers,
  });
}

async function setWidgetOrder(
  dashboardId: string,
  widgets: Array<Widget>
): Promise<Dataset> {
  const headers = await authHeaders();
  const payload = widgets.map((widget) => ({
    id: widget.id,
    updatedAt: widget.updatedAt,
    order: widget.order,
  }));
  return await API.put(apiName, `dashboard/${dashboardId}/widgetorder`, {
    headers,
    body: {
      widgets: payload,
    },
  });
}

async function fetchDatasets(): Promise<Array<Dataset>> {
  const headers = await authHeaders();
  return await API.get(apiName, "dataset", { headers });
}

async function createDataset(
  fileName: string,
  s3Keys: { raw: string; json: string }
): Promise<Dataset> {
  const headers = await authHeaders();
  return await API.post(apiName, "dataset", {
    headers,
    body: {
      fileName,
      s3Key: {
        raw: s3Keys.raw,
        json: s3Keys.json,
      },
    },
  });
}

async function fetchHomepage() {
  const headers = await authHeaders();
  return API.get(apiName, "settings/homepage", { headers });
}

async function fetchPublicHomepage() {
  return API.get(apiName, "public/homepage", {});
}

async function editHomepage(
  title: string,
  description: string,
  updatedAt: Date
) {
  const headers = await authHeaders();
  return await API.put(apiName, "settings/homepage", {
    headers,
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
  return API.get(apiName, "public/settings", {});
}

async function editSettings(publishingGuidance: string, updatedAt: Date) {
  const headers = await authHeaders();
  return await API.put(apiName, "settings", {
    headers,
    body: {
      publishingGuidance,
      updatedAt,
    },
  });
}

async function updateSetting(
  settingKey: string,
  settingValue: any,
  updatedAt: Date
) {
  const headers = await authHeaders();
  return await API.put(apiName, "settings", {
    headers,
    body: {
      [settingKey]: settingValue,
      updatedAt,
    },
  });
}

async function fetchPublicDashboard(
  dashboardId: string
): Promise<PublicDashboard> {
  return API.get(apiName, `public/dashboard/${dashboardId}`, {});
}

async function createDraft(dashboardId: string): Promise<Dashboard> {
  const headers = await authHeaders();
  return await API.post(apiName, `dashboard/${dashboardId}`, {
    headers,
  });
}

async function publishPending(
  dashboardId: string,
  lastUpdatedAt: Date
): Promise<Dashboard> {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}/publishpending`, {
    headers,
    body: {
      updatedAt: lastUpdatedAt,
    },
  });
}

async function moveToDraft(
  dashboardId: string,
  lastUpdatedAt: Date
): Promise<Dashboard> {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}/draft`, {
    headers,
    body: {
      updatedAt: lastUpdatedAt,
    },
  });
}

async function fetchUsers(): Promise<User[]> {
  const headers = await authHeaders();
  return await API.get(apiName, "user", { headers });
}

async function resendInvite(emails: Array<string>) {
  const headers = await authHeaders();
  return await API.post(apiName, "user/invite", {
    headers,
    body: {
      emails: emails.join(","),
    },
  });
}

const BackendService = {
  fetchDashboards,
  fetchDashboardById,
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
  fetchUsers,
  resendInvite,
};

export default BackendService;
