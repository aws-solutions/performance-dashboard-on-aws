import Service from '../service/model';
import Chart from '../chart/model';

export default interface Dashboard {
    id: string,
    name: string,
    service?: Service,
};

export interface DashboardWithCharts {
    id: string,
    name: string, 
    charts: Array<Chart>,
}

export type DashboardList = Array<Dashboard>;