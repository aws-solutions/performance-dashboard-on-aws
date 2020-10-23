#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { FrontendStack } from "../lib/frontend-stack";
import { BackendStack } from "../lib/backend-stack";
import { AuthStack } from "../lib/auth-stack";

const APP_ID = "Performance Dashboard On AWS";
const envName = process.env.CDK_ENV_NAME;

if (!envName) {
  throw new Error("CDK_ENV_NAME environment variable missing");
}

const app = new cdk.App();
const stackPrefix = "Badger-".concat(envName);
const accountId = cdk.Aws.ACCOUNT_ID;
const datasetsBucketName = `badger-${envName.toLowerCase()}-${accountId}-datasets`;

const auth = new AuthStack(app, "Auth", {
  stackName: stackPrefix.concat("-Auth"),
  datasetsBucketName: datasetsBucketName,
});
auth.node.applyAspect(new cdk.Tag("app-id", APP_ID));

const backend = new BackendStack(app, "Backend", {
  stackName: stackPrefix.concat("-Backend"),
  userPoolArn: auth.userPoolArn,
  datasetsBucketName: datasetsBucketName,
});
backend.node.applyAspect(new cdk.Tag("app-id", APP_ID));

const frontend = new FrontendStack(app, "Frontend", {
  stackName: stackPrefix.concat("-Frontend"),
  datasetsBucket: datasetsBucketName,
  userPoolId: auth.userPoolId,
  identityPoolId: auth.identityPoolId,
  appClientId: auth.appClientId,
  badgerApiUrl: backend.apiGatewayEndpoint,
});
frontend.node.applyAspect(new cdk.Tag("app-id", APP_ID));
