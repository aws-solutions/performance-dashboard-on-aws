import EnvConfig from "./services/EnvConfig";

const config = {
  API: {
    endpoints: [
      {
        name: "BackendApi",
        endpoint: EnvConfig.backendApi,
      },
    ],
  },
  Auth: {
    region: EnvConfig.region,
    userPoolId: EnvConfig.userPoolId,
    userPoolWebClientId: EnvConfig.appClientId,
    identityPoolId: EnvConfig.identityPoolId,
  },
  Storage: {
    AWSS3: {
      bucket: EnvConfig.datasetsBucket,
      region: EnvConfig.region,
    },
  },
};

export default config;
