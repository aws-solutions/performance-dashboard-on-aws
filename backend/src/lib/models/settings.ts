export interface Settings {
  publishingGuidance: string;
  updatedAt?: Date;
}

export interface SettingsItem {
  pk: string;
  sk: string;
  type: string;
  updatedAt?: string;
  publishingGuidance: string;
}
