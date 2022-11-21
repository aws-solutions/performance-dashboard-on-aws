/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

// Reads environment variables from the Window object.
// These variables are coming from `public/env.js` which
// is imported in the `public/index.html` file.

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
  contentBucket: string;
  identityPoolId: string;
  contactEmail: string;
  brandName: string;
  topicAreaLabel: string;
  topicAreasLabel: string;
  frontendDomain: string;
  cognitoDomain: string;
  samlProvider: string;
  enterpriseLoginLabel: string;
  authenticationRequired: boolean;
}

const config = window.EnvironmentConfig;

const EnvConfigService = {
  // Export all values in the window object
  ...window.EnvironmentConfig,
  // Set default values for some properties. These defaults are a fallback
  // mechanism in case these properties are not available on the window object
  // for some reason. If the `public/env.js` file loads properly, then they will be
  // available, but just in case it doesn't, the app wont crash.
  contactEmail: (config && config.contactEmail) || "support@example.com",
  brandName: (config && config.brandName) || "Performance Dashboard",
  topicAreaLabel: (config && config.topicAreaLabel) || "Topic area",
  topicAreasLabel: (config && config.topicAreasLabel) || "Topic areas",
  cognitoDomain: (config && config.cognitoDomain) || "",
  samlProvider: (config && config.samlProvider) || "",
  enterpriseLoginLabel:
    (config && config.enterpriseLoginLabel) || "Enterprise Sign-In",
  frontendDomain: (config && config.frontendDomain) || "",
} as EnvConfig;

export default EnvConfigService;
