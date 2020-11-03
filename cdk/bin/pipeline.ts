#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

new PipelineStack(app, "Pipeline", {
  stackName: "PerformanceDash-Pipeline",
  repoName: "performance-dashboard-on-aws",
  sourceProvider: "GitHub",
  branch: "mainline",
  githubOwner: "awslabs",
  githubOAuthToken: "github-oauth-token-secret",
});
