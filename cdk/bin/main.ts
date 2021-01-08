#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { FrontendStack } from "../lib/frontend-stack";
import { BackendStack } from "../lib/backend-stack";
import { AuthStack } from "../lib/auth-stack";
import { OpsStack } from "../lib/ops-stack";
import { Tags } from "@aws-cdk/core";

const APP_ID = "Performance Dashboard on AWS";
const envName = process.env.CDK_ENV_NAME;

if (!envName) {
  throw new Error("CDK_ENV_NAME environment variable missing");
}

const app = new cdk.App();
const stackPrefix = "PerformanceDash-".concat(envName);
const accountId = cdk.Aws.ACCOUNT_ID;
const region = cdk.Aws.REGION;
const datasetsBucketName = `performancedash-${envName.toLowerCase()}-${accountId}-${region}-datasets`;

const auth = new AuthStack(app, "Auth", {
  stackName: stackPrefix.concat("-Auth"),
  datasetsBucketName: datasetsBucketName,
});

const backend = new BackendStack(app, "Backend", {
  stackName: stackPrefix.concat("-Backend"),
  userPool: {
    id: auth.userPoolId,
    arn: auth.userPoolArn,
  },
  datasetsBucketName: datasetsBucketName,
});

const frontend = new FrontendStack(app, "Frontend", {
  stackName: stackPrefix.concat("-Frontend"),
  datasetsBucket: datasetsBucketName,
  userPoolId: auth.userPoolId,
  identityPoolId: auth.identityPoolId,
  appClientId: auth.appClientId,
  backendApiUrl: backend.restApi.url,
});

const operations = new OpsStack(app, "Ops", {
  stackName: stackPrefix.concat("-Ops"),
  privateApiFunction: backend.privateApiFunction,
  publicApiFunction: backend.publicApiFunction,
  restApi: backend.restApi,
  mainTable: backend.mainTable,
});

Tags.of(auth).add("app-id", APP_ID);
Tags.of(backend).add("app-id", APP_ID);
Tags.of(frontend).add("app-id", APP_ID);
Tags.of(operations).add("app-id", APP_ID);
