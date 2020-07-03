import { API } from 'aws-amplify';

const apiName = "BadgerApi";

async function fetchDashboards() {
    return await API.get(apiName, '/dashboard', {});
}

async function fetchDashboardById(dashboardId: string) {
    return await API.get(apiName, '/dashboard/'.concat(dashboardId), {});
}

export default {
    fetchDashboards,
    fetchDashboardById,
}