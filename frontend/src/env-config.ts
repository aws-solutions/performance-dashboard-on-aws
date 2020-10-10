// Reads environment variables from the Window object.
// These variables are coming from `public/env.js`.

declare global {
  interface Window {
    BadgerEnv: {
      region: string;
      badgerApi: string;
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
        name: "BadgerApi",
        endpoint: window.BadgerEnv.badgerApi,
      },
    ],
  },
  Auth: {
    region: window.BadgerEnv.region,
    userPoolId: window.BadgerEnv.userPoolId,
    userPoolWebClientId: window.BadgerEnv.appClientId,
    identityPoolId: window.BadgerEnv.identityPoolId,
  },
  Storage: {
    AWSS3: {
      bucket: window.BadgerEnv.datasetsBucket,
      region: window.BadgerEnv.region,
    },
  },
};

export default config;
