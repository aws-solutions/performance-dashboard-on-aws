import { API, Auth } from "aws-amplify";
import { Dashboard, Dataset, PublicDashboard, Widget } from "../models";

const apiName = "BadgerApi";

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

async function fetchDashboards() {
  const headers = await authHeaders();
  return await API.get(apiName, "dashboard", { headers });
}

async function fetchDashboardById(dashboardId: string): Promise<Dashboard> {
  const headers = await authHeaders();
  return await API.get(apiName, `dashboard/${dashboardId}`, { headers });
}

async function fetchTopicAreas() {
  const headers = await authHeaders();
  return await API.get(apiName, "topicarea", { headers });
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
  parentDashboardId: string,
  updatedAt: Date,
  releaseNotes: string
) {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}/publish`, {
    headers,
    body: {
      updatedAt,
      parentDashboardId,
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

async function createWidget(
  dashboardId: string,
  name: string,
  widgetType: string,
  content: object
) {
  const headers = await authHeaders();
  return await API.post(apiName, `dashboard/${dashboardId}/widget`, {
    headers,
    body: {
      name,
      widgetType,
      content,
    },
  });
}

async function editWidget(
  dashboardId: string,
  widgetId: string,
  name: string,
  content: object,
  updatedAt: Date
) {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}/widget/${widgetId}`, {
    headers,
    body: {
      name,
      content,
      updatedAt,
    },
  });
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

async function fetchHomepage() {
  return API.get(apiName, "homepage", {});
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

export default {
  fetchDashboards,
  fetchDashboardById,
  fetchTopicAreas,
  fetchWidgetById,
  fetchWidgets,
  editDashboard,
  publishDashboard,
  createDashboard,
  deleteDashboards,
  createWidget,
  editWidget,
  deleteWidget,
  setWidgetOrder,
  createDataset,
  getAuthToken,
  fetchHomepage,
  fetchPublicDashboard,
  publishPending,
  createDraft,
};
