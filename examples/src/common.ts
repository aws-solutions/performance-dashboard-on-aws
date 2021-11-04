import { Dataset } from "performance-dashboard-backend/src/lib/models/dataset";
import { Dashboard } from "performance-dashboard-backend/src/lib/models/dashboard";

export interface Configuration {
  example: string;
  author: string;
  reuseTopicArea: boolean;
  reuseDashboard: boolean;
  reuseDataset: boolean;
}

export interface DashboardSnapshot {
  dashboard: Dashboard;
  datasets: Dataset[];
}
