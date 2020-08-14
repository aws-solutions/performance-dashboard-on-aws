import { Widget } from "./widget";

export type Dashboard = {
    id: string,
    name: string,
    topicAreaId: string,
    topicAreaName: string,
    description: string,
    createdBy: string,
    widgets?: Array<Widget>
};

export type DashboardList = Array<Dashboard>;

export interface DashboardItem {
    pk: string,
    sk: string,
    type: string,
    dashboardName: string,
    topicAreaId: string,
    topicAreaName: string,
    description: string,
    createdBy: string,
};