#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

new PipelineStack(app, "Pipeline", {
  stackName: "PerformanceDash-Pipeline",
  githubOrg: "aws-solutions",
  repoName: "performance-dashboard-on-aws",
  branch: "mainline-dev",
});
