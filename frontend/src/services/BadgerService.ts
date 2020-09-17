import { API, Auth } from "aws-amplify";
import { Dataset, Widget } from "../models";

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

async function fetchDashboardById(dashboardId: string) {
  const headers = await authHeaders();
  return await API.get(apiName, `dashboard/${dashboardId}`, { headers });
}

async function fetchTopicAreas() {
  const headers = await authHeaders();
  return await API.get(apiName, "topicarea", { headers });
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
  description: string
) {
  const headers = await authHeaders();
  return await API.put(apiName, `dashboard/${dashboardId}`, {
    headers,
    body: {
      name,
      topicAreaId,
      description,
    },
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

export default {
  fetchDashboards,
  fetchDashboardById,
  fetchTopicAreas,
  fetchWidgets,
  editDashboard,
  createDashboard,
  createWidget,
  deleteWidget,
  setWidgetOrder,
  createDataset,
  getAuthToken,
};
