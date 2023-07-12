#!/usr/bin/env node
import "source-map-support/register";
import { FrontendStack } from "../lib/frontend-stack";
import { FrontendConfigStack } from "../lib/frontend-config-stack";
import { BackendStack } from "../lib/backend-stack";
import { AuthStack } from "../lib/auth-stack";
import { AuthorizationStack } from "../lib/authz-stack";
import { OpsStack } from "../lib/ops-stack";
import { DashboardExamplesStack } from "../lib/dashboardexamples-stack";
import { FunctionInvalidWarningSuppressor } from "../lib/constructs/function-aspect";
import { PolicyInvalidWarningSuppressor } from "../lib/constructs/policy-aspect";
import { App, Aspects, Aws, DefaultStackSynthesizer, Tags } from "aws-cdk-lib";
import packagejson from "../package.json";

const APP_ID = "Performance Dashboard on AWS";
const envName = process.env.CDK_ENV_NAME;

if (!envName) {
    throw new Error("CDK_ENV_NAME environment variable missing");
}

const app = new App();
const stackPrefix = "PerformanceDash-".concat(envName);
const accountId = Aws.ACCOUNT_ID;
const region = Aws.REGION;
const datasetsBucketName = `performancedash-${envName.toLowerCase()}-${accountId}-${region}-datasets`;
const contentBucketName = `performancedash-${envName.toLowerCase()}-${accountId}-${region}-content`;

const auth = new AuthStack(app, "Auth", {
    stackName: stackPrefix.concat("-Auth"),
    datasetsBucketName,
    contentBucketName,
    synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
    }),
});

const authz = new AuthorizationStack(app, "Authz", {
    stackName: stackPrefix.concat("-Authz"),
    datasetsBucketName,
    contentBucketName,
    userPoolArn: auth.userPoolArn,
    appClientId: auth.appClientId,
    identityPoolId: auth.identityPoolId,
    synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
    }),
});

const frontend = new FrontendStack(app, "Frontend", {
    stackName: stackPrefix.concat("-Frontend"),
    synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
    }),
});

const backend = new BackendStack(app, "Backend", {
    stackName: stackPrefix.concat("-Backend"),
    userPool: {
        id: auth.userPoolId,
        arn: auth.userPoolArn,
    },
    datasetsBucketName,
    contentBucketName,
    serverAccessLogsBucketName: frontend.serverAccessLogsBucketName,
    distributionDomainName: frontend.distributionDomainName,
    synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
    }),
});

const frontendConfig = new FrontendConfigStack(app, "FrontendConfig", {
    stackName: stackPrefix.concat("-FrontendConfig"),
    frontendBucket: frontend.reactBucketName,
    datasetsBucket: datasetsBucketName,
    contentBucket: contentBucketName,
    userPoolId: auth.userPoolId,
    identityPoolId: auth.identityPoolId,
    appClientId: auth.appClientId,
    backendApiUrl: backend.restApi.url,
    adminEmail: authz.adminEmail,
    synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
    }),
});

const operations = new OpsStack(app, "Ops", {
    stackName: stackPrefix.concat("-Ops"),
    solutionId: "performance-dashboard-on-aws",
    solutionName: APP_ID,
    solutionVersion: packagejson.version,
    appRegistryName: stackPrefix.concat("-App"),
    privateApiFunction: backend.privateApiFunction,
    publicApiFunction: backend.publicApiFunction,
    dynamodbStreamsFunction: backend.dynamodbStreamsFunction,
    restApi: backend.restApi,
    mainTable: backend.mainTable,
    auditTrailTable: backend.auditTrailTable,
    environment: envName,
    synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
    }),
});

const examples = new DashboardExamplesStack(app, "DashboardExamples", {
    stackName: stackPrefix.concat("-DashboardExamples"),
    datasetsBucketName,
    datasetsBucketArn: backend.datasetsBucketArn,
    databaseTableName: backend.mainTable.tableName,
    databaseTableArn: backend.mainTable.tableArn,
    adminEmail: authz.adminEmail,
    serverAccessLogsBucketName: frontend.serverAccessLogsBucketName,
    synthesizer: new DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
    }),
});

operations.associateAppWithOtherStacks([auth, authz, frontend, backend, frontendConfig, examples]);

Aspects.of(app).add(new PolicyInvalidWarningSuppressor());
Aspects.of(app).add(new FunctionInvalidWarningSuppressor());

Tags.of(auth).add("app-id", APP_ID);
Tags.of(authz).add("app-id", APP_ID);
Tags.of(frontend).add("app-id", APP_ID);
Tags.of(backend).add("app-id", APP_ID);
Tags.of(frontendConfig).add("app-id", APP_ID);
Tags.of(operations).add("app-id", APP_ID);
Tags.of(examples).add("app-id", APP_ID);
