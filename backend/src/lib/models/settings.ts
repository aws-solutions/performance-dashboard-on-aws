export interface Settings {
  publishingGuidance: string;
  dateTimeFormat: {
    date: string;
    time: string;
  };
  updatedAt: Date;
}

export interface PublicSettings {
  dateTimeFormat: {
    date: string;
    time: string;
  };
}

export interface SettingsItem {
  pk: string;
  sk: string;
  type: string;
  updatedAt?: string;
  publishingGuidance?: string;
  dateTimeFormat?: {
    date: string;
    time: string;
  };
}
