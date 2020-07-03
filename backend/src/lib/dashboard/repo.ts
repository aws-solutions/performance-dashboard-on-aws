import { DashboardList } from './model';
import Service from '../service/model';
import Department from '../department/model';

async function readAll() : Promise<DashboardList> {

    // Real implementation will query DynamoDB
    const dashboards : DashboardList = [];
    
    // Departments
    const dmv : Department = {
        id: 'dept-dmv',
        name: 'Department of Motor Vehicles',
    };

    const environment : Department = {
        id: 'dept-environ',
        name: 'Environmental Impact',
    };

    const hhs : Department = {
        id: 'dept-hhs',
        name: 'Department of Health and Human Services',
    };

    const tackIn : Department = {
        id: 'dept-aff',
        name: 'Tackling Inequality',
    };

    // Services
    const vehicleRegistrations : Service = {
        id: 'svc-123',
        name: 'Vehicle Registrations',
        department: dmv,
    };

    const recycling : Service = {
        id: 'svc-456',
        name: 'Recycling and Waste',
        department: environment,
    };

    const climate : Service = {
        id: 'svc-789',
        name: 'Climate Crisis Commitments',
        department: environment,
    };

    const children : Service = {
        id: 'svc-987',
        name: 'Administration for Children and Families',
        department: hhs,
    };

    const aff : Service = {
        id: 'svc-654',
        name: 'Affordable Housing',
        department: tackIn,
    };

    // Dashboards
    dashboards.push({
        id: 'dash-abc',
        name: 'Vehicle Registrations 2019',
        service: vehicleRegistrations,
    });

    dashboards.push({
        id: 'dash-xyz',
        name: 'Vehicle Registrations 2020',
        service: vehicleRegistrations,
    });

    dashboards.push({
        id: 'dash-qwe',
        name: 'Recycling and Waste Metrics',
        service: recycling,
    });

    dashboards.push({
        id: 'dash-ert',
        name: 'Safer Streets for Cycling and Pedestrians',
        service: recycling,
    });

    dashboards.push({
        id: 'dash-tyu',
        name: 'Climate Crisis Commitments',
        service: climate,
    });

    dashboards.push({
        id: 'dash-lkj',
        name: 'Economic and Social Well-being of Families',
        service: children,
    });

    dashboards.push({
        id: 'dash-aoq',
        name: 'Affordable Housing',
        service: aff,
    });

    return dashboards;
}

export default {
    readAll,
}