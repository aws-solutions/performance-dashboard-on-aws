// Reads environment variables from the Window object.
// These variables are coming from `public/env.js`.

declare global {
  interface Window {
    EnvironmentConfig: EnvConfig;
  }
}

interface EnvConfig {
  region: string;
  backendApi: string;
  userPoolId: string;
  appClientId: string;
  datasetsBucket: string;
  identityPoolId: string;
  contactEmail: string;
  brandName: string;
  topicAreaLabel: string;
}

const config = window.EnvironmentConfig;

export default {
  // Export all values in the window object
  ...window.EnvironmentConfig,
  // Set default values for some keys
  contactEmail: (config && config.contactEmail) || "support@example.com",
  brandName: (config && config.brandName) || "Performance Dashboard",
  topicAreaLabel: (config && config.topicAreaLabel) || "Topic Area",
} as EnvConfig;
