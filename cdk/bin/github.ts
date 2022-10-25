#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { GitHubIntegrationStack } from "../lib/github-integration-stack";

const app = new cdk.App();

new GitHubIntegrationStack(app, "GitHubIntegration", {
  githubOrg: "aws-solutions",
});
