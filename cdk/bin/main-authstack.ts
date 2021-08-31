#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { FrontendStack } from "../lib/frontend-stack";
import { BackendStack } from "../lib/backend-stack";
import { AuthStack } from "../lib/auth-stack";
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

const auth = new AuthStack(app, "Auth", {
  stackName: stackPrefix.concat("-Auth"),
  datasetsBucketName: datasetsBucketName,
  contentBucketName: contentBucketName,
});

Aspects.of(app).add(new PolicyInvalidWarningSuppressor());
Aspects.of(app).add(new FunctionInvalidWarningSuppressor());

Tags.of(auth).add("app-id", APP_ID);
