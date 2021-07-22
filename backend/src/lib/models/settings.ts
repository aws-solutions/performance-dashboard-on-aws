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
  customLogoS3Key: string | undefined;
  customFaviconS3Key: string | undefined;
  colors?: {
    primary: string;
    secondary: string;
  };
  contactEmailAddress?: string;
  adminContactEmailAddress?: string;
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
  customLogoS3Key: string | undefined;
  customFaviconS3Key: string | undefined;
  colors?: {
    primary: string;
    secondary: string;
  };
  contactEmailAddress?: string;
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
  customLogoS3Key: string | undefined;
  customFaviconS3Key: string | undefined;
  colors?: {
    primary: string;
    secondary: string;
  };
  contactEmailAddress?: string;
  adminContactEmailAddress?: string;
}
