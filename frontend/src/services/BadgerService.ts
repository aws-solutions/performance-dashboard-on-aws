import { API, Auth } from 'aws-amplify';

const apiName = "BadgerApi";

async function getAuthToken() {
    const session = await Auth.currentSession();
    const idToken = await session.getIdToken();
    return idToken.getJwtToken();
}

async function fetchDashboards() {
    const token = await getAuthToken();
    return await API.get(apiName, '/dashboard', {
        headers: { Authorization: 'Bearer '.concat(token) }
    });
}

async function fetchDashboardById(dashboardId: string) {
    const token = await getAuthToken();
    return await API.get(apiName, '/dashboard/'.concat(dashboardId), {
        headers: { Authorization: 'Bearer '.concat(token) }
    });
}

async function fetchDashboardsAdmin() {
    const token = await getAuthToken();
    return await API.get(apiName, '/admin/dashboard', {
        headers: { Authorization: 'Bearer '.concat(token) }
    });
}

export default {
    fetchDashboards,
    fetchDashboardById,
    fetchDashboardsAdmin,
    getAuthToken,
}