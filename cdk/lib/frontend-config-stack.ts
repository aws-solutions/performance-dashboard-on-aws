/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnParameter, CustomResource, Duration, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Provider } from "aws-cdk-lib/custom-resources";
import { authenticationRequiredParameter } from "./constructs/parameters";

interface Props extends StackProps {
    frontendBucket: string;
    datasetsBucket: string;
    contentBucket: string;
    userPoolId: string;
    identityPoolId: string;
    appClientId: string;
    backendApiUrl: string;
    adminEmail: string;
}

export class FrontendConfigStack extends Stack {
    private readonly frontendBucket: Bucket;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const authenticationRequired = authenticationRequiredParameter(this);

        this.deployEnvironmentConfig(props, authenticationRequired);
    }

    private deployEnvironmentConfig(
        props: Props,
        authenticationRequired: CfnParameter,
    ): CustomResource {
        // This CustomResource is a Lambda function that generates the `env.js`
        // with environment values. This file is uploaded to the bucket where
        // the React code is deployed.

        const lambdaFunction = new Function(this, "EnvConfig", {
            runtime: Runtime.NODEJS_16_X,
            description: "Deploys env.js file on S3 with environment configuration",
            code: Code.fromAsset("build/lib/envconfig"),
            handler: "index.handler",
            timeout: Duration.seconds(60),
            memorySize: 128,
            logRetention: RetentionDays.TEN_YEARS,
            reservedConcurrentExecutions: 1,
            environment: {
                FRONTEND_BUCKET: props.frontendBucket,
                REGION: Stack.of(this).region,
                BACKEND_API: props.backendApiUrl,
                USER_POOL_ID: props.userPoolId,
                APP_CLIENT_ID: props.appClientId,
                DATASETS_BUCKET: props.datasetsBucket,
                CONTENT_BUCKET: props.contentBucket,
                IDENTITY_POOL_ID: props.identityPoolId,
                CONTACT_EMAIL: props.adminEmail,
                BRAND_NAME: "Performance Dashboard",
                TOPIC_AREA_LABEL: "Topic area",
                TOPIC_AREAS_LABEL: "Topic areas",
                FRONTEND_DOMAIN: "",
                COGNITO_DOMAIN: "",
                SAML_PROVIDER: "",
                ENTERPRISE_LOGIN_LABEL: "Enterprise Sign-In",
                AUTHENTICATION_REQUIRED: authenticationRequired.valueAsString,
            },
        });

        const frontendBucket = Bucket.fromBucketName(this, "FrontendBucket", props.frontendBucket);

        lambdaFunction.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                resources: [frontendBucket.arnForObjects("*")],
                actions: ["s3:PutObject"],
            }),
        );

        const provider = new Provider(this, "EnvConfigProvider", {
            onEventHandler: lambdaFunction,
        });

        return new CustomResource(this, "EnvConfigDeployment", {
            serviceToken: provider.serviceToken,
        });
    }
}
