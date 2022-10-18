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

const oauthConfig = {
  domain: EnvConfig.cognitoDomain,
  scope: [
    "phone",
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin",
  ],
  redirectSignIn: EnvConfig.frontendDomain,
  redirectSignOut: EnvConfig.frontendDomain,
  responseType: "code", // or token
  // optional, for Cognito hosted ui specified options
  options: {
    // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
    AdvancedSecurityDataCollectionFlag: true,
  },
};

export const samlConfig = {
  oauthConfig: {
    customProvider: EnvConfig.samlProvider,
    label: EnvConfig.enterpriseLoginLabel,
  },
};

export function amplifyConfig(): {} {
  const configuration: { [k: string]: any } = config;

  if (EnvConfig.samlProvider) {
    configuration.oauth = oauthConfig;
  }
  return configuration;
}

export default config;
