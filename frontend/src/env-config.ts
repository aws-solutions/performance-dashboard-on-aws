// Reads environment variables from the Window object.
// These variables are coming from `public/env.js`.

declare global {
  interface Window {
    EnvironmentConfig: {
      region: string;
      backendApi: string;
      userPoolId: string;
      appClientId: string;
      datasetsBucket: string;
      identityPoolId: string;
    };
  }
}

const config = {
  API: {
    endpoints: [
      {
        name: "BackendApi",
        endpoint: window.EnvironmentConfig.backendApi,
      },
    ],
  },
  Auth: {
    region: window.EnvironmentConfig.region,
    userPoolId: window.EnvironmentConfig.userPoolId,
    userPoolWebClientId: window.EnvironmentConfig.appClientId,
    identityPoolId: window.EnvironmentConfig.identityPoolId,
  },
  Storage: {
    AWSS3: {
      bucket: window.EnvironmentConfig.datasetsBucket,
      region: window.EnvironmentConfig.region,
    },
  },
};

export default config;
