import { DatasetSchema } from "performance-dashboard-backend/src/lib/models/dataset";
import { Dashboard } from "performance-dashboard-backend/src/lib/models/dashboard";

export enum Languages {
  English = "en",
  Spanish = "es",
  Portuguese = "pt",
}

export type Language = "en" | "es" | "pt";

export interface DatasetKey {
  raw: string;
  json: string;
}

export interface Configuration {
  language: Language;
  author: string;
  reuseTopicArea: boolean;
  reuseDashboard: boolean;
  reuseDataset: boolean;
}

export interface ExampleBuilder {
  build(config: Configuration): Promise<DashboardCollection>;
}

export interface DatasetResource {
  fileName: string;
  schema: DatasetSchema;
  key: DatasetKey;
}

export interface DatasetCollection {
  [key: string]: DatasetResource;
}

export interface DashboardCollection {
  [key: string]: Dashboard;
}
