import { TopicArea } from './topicarea';

export type Dashboard = {
    id: string,
    name: string,
    topicArea?: TopicArea,
};

export type DashboardList = Array<Dashboard>;