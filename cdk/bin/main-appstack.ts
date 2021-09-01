#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { FrontendStack } from "../lib/frontend-stack";
import { BackendStack } from "../lib/backend-stack";
import { AuthParamsStack } from "../lib/authparams-stack";
import { OpsStack } from "../lib/ops-stack";
import { Aspects, Tags } from "@aws-cdk/core";
import { FunctionInvalidWarningSuppressor } from "../lib/constructs/function-aspect";
import { PolicyInvalidWarningSuppressor } from "../lib/constructs/policy-aspect";

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
const contentBucketName = `performancedash-${envName.toLowerCase()}-${accountId}-${region}-content`;

const auth = new AuthParamsStack(app, "AuthParams", {
  stackName: stackPrefix.concat("-AuthParams"),
  datasetsBucketName: datasetsBucketName,
  contentBucketName: contentBucketName,
});

const backend = new BackendStack(app, "Backend", {
  stackName: stackPrefix.concat("-Backend"),
  userPool: {
    id: auth.userPoolId,
    arn: auth.userPoolArn,
  },
  datasetsBucketName: datasetsBucketName,
  contentBucketName: contentBucketName,
  authRegion: auth.authRegion,
});

const frontend = new FrontendStack(app, "Frontend", {
  stackName: stackPrefix.concat("-Frontend"),
  authRegion: auth.authRegion,
  datasetsBucket: datasetsBucketName,
  contentBucket: contentBucketName,
  userPoolId: auth.userPoolId,
  identityPoolId: auth.identityPoolId,
  appClientId: auth.appClientId,
  backendApiUrl: backend.restApi.url,
});

const operations = new OpsStack(app, "Ops", {
  stackName: stackPrefix.concat("-Ops"),
  privateApiFunction: backend.privateApiFunction,
  publicApiFunction: backend.publicApiFunction,
  dynamodbStreamsFunction: backend.dynamodbStreamsFunction,
  restApi: backend.restApi,
  mainTable: backend.mainTable,
  auditTrailTable: backend.auditTrailTable,
  environment: envName,
});

Aspects.of(app).add(new PolicyInvalidWarningSuppressor());
Aspects.of(app).add(new FunctionInvalidWarningSuppressor());

Tags.of(auth).add("app-id", APP_ID);
Tags.of(backend).add("app-id", APP_ID);
Tags.of(frontend).add("app-id", APP_ID);
Tags.of(operations).add("app-id", APP_ID);
