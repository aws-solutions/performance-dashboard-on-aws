import dashboardRepo from './repo';
import { DashboardList, DashboardWithCharts } from './model';

async function listDashboards() : Promise<DashboardList> {
    const dashboards = await dashboardRepo.readAll();
    return dashboards;
}

async function getDashboardById(dashboardId: string) : Promise<DashboardWithCharts> {
    return {
        id: dashboardId,
        name: 'Vehicle Registrations 2020',
        charts: [
            {
                id: 'chart-xyz',
                values: [32, 90, 45, 60, 23, 100],
            }
        ],
    };
}

export default {
    listDashboards,
    getDashboardById,
};