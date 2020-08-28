#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { FrontendStack } from "../lib/frontend-stack";
import { BackendStack } from "../lib/backend-stack";
import { AuthStack } from "../lib/auth-stack";

const envName = process.env.CDK_ENV_NAME;

if (!envName) {
  throw new Error("CDK_ENV_NAME environment variable missing");
}

const app = new cdk.App();
const stackPrefix = "Badger-".concat(envName);
const accountId = cdk.Aws.ACCOUNT_ID;
const datasetsBucketName = `badger-${envName}-${accountId}-datasets`.toLowerCase();

const auth = new AuthStack(app, "Auth", {
  stackName: stackPrefix.concat("-Auth"),
  datasetsBucketName: datasetsBucketName,
});

new BackendStack(app, "Backend", {
  stackName: stackPrefix.concat("-Backend"),
  userPoolArn: auth.userPoolArn,
  datasetsBucketName: datasetsBucketName,
});

new FrontendStack(app, "Frontend", {
  stackName: stackPrefix.concat("-Frontend"),
});
