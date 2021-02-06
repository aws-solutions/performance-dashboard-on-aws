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
    oauth: {
      domain: "auth-251647719696-us-east-2.auth.us-east-2.amazoncognito.com",
      //awsCognito: "",
      scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'http://localhost:3000/admin',
      redirectSignOut: 'http://localhost:3000/admin',
      responseType: 'code', // or token
      // optional, for Cognito hosted ui specified options
      options: {
        // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
        AdvancedSecurityDataCollectionFlag: true
      }
    }
  },
  Storage: {
    AWSS3: {
      bucket: EnvConfig.datasetsBucket,
      region: EnvConfig.region,
    },
  },
};

export const samlConfig = {
  oauthConfig: {
    customProvider: "PDOA",
    label: "Enterprise Sign-in",
  },
};

export default config;