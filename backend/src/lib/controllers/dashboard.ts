import { Dashboard, DashboardList } from '../models/dashboard';

async function listDashboards() : Promise<DashboardList> {

    const dashboards : DashboardList = [
        {
            id: 'abc',
            name: 'Safer Streets for Cycling and Pedestrians',
            topicArea: {
                id: '123',
                name: 'Environmental Impact',
                createdBy: 'johndoe',
            }
        }
    ];

    return dashboards;
}

async function getDashboardById(dashboardId: string) : Promise<Dashboard> {
    return {
        id: 'abc',
        name: 'Safer Streets for Cycling and Pedestrians',
        topicArea: {
            id: '123',
            name: 'Environmental Impact',
            createdBy: 'johndoe',
        }
    }
}

export default {
    listDashboards,
    getDashboardById,
}