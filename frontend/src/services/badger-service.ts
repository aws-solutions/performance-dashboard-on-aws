import { API, Auth } from 'aws-amplify';

const apiName = "BadgerApi";

async function getAuthToken() {
    const session = await Auth.currentSession();
    const idToken = await session.getIdToken();
    return idToken.getJwtToken();
}

async function fetchDashboards() {
    return await API.get(apiName, '/dashboard', {});
}

async function fetchDashboardById(dashboardId: string) {
    return await API.get(apiName, '/dashboard/'.concat(dashboardId), {});
}

async function fetchDashboardsAdmin() {
    const token = await getAuthToken();
    return await API.get(apiName, '/admin/dashboard', {
        Authorization: 'Bearer '.concat(token),
    });
}

export default {
    fetchDashboards,
    fetchDashboardById,
    fetchDashboardsAdmin,
    getAuthToken,
}