#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

new PipelineStack(app, "Pipeline", {
  stackName: "Badger-Pipeline",
  repoName: "AWS-WWPS-GTT-Badger",
  sourceProvider: "CodeCommit",
  branch: "mainline",
});
