export interface Settings {
  publishingGuidance: string;
  dateTimeFormat: string;
  updatedAt: Date;
}

export interface SettingsItem {
  pk: string;
  sk: string;
  type: string;
  updatedAt?: string;
  publishingGuidance?: string;
  dateTimeFormat?: string;
}
