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

export default {
  ...window.EnvironmentConfig,
};
