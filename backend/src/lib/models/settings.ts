export interface Settings {
  publishingGuidance: string;
  dateTimeFormat: {
    date: string;
    time: string;
  };
  updatedAt: Date;
  navbarTitle: string;
  topicAreaLabels: {
    singular: string;
    plural: string;
  };

}

export interface PublicSettings {
  dateTimeFormat: {
    date: string;
    time: string;
  };
  navbarTitle: string;
  topicAreaLabels: {
    singular: string;
    plural: string;
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
  navbarTitle?: string;
  topicAreaLabels?: {
    singular: string;
    plural: string;
  };

}
