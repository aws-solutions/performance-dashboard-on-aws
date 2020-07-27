import { API, Auth } from "aws-amplify";

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

async function fetchDashboardById(topicAreaId: string, dashboardId: string) {
  const headers = await authHeaders();
  return await API.get(apiName, `dashboard/${topicAreaId}/${dashboardId}`, { headers });
}

async function fetchTopicAreas() {
  const headers = await authHeaders();
  return await API.get(apiName, "topicarea", { headers });
}

async function createDashboard(name: string, description: string, topicAreaId: string) {
  const headers = await authHeaders();
  return await API.post(apiName, "dashboard", {
    headers,
    body: {
      name,
      description,
      topicAreaId,
    }
  });
}

export default {
  fetchDashboards,
  fetchDashboardById,
  fetchTopicAreas,
  createDashboard,
  getAuthToken,
};
