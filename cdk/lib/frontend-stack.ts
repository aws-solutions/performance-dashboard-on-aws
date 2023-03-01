/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnOutput, CfnParameter, CustomResource, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
    CfnDistribution,
    Distribution,
    HeadersFrameOption,
    OriginAccessIdentity,
    ResponseHeadersPolicy,
    AllowedMethods,
    ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import {
    BlockPublicAccess,
    Bucket,
    BucketAccessControl,
    BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { AnyPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Provider } from "aws-cdk-lib/custom-resources";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { authenticationRequiredParameter } from "./constructs/parameters";

interface Props extends StackProps {
    datasetsBucket: string;
    contentBucket: string;
    userPoolId: string;
    identityPoolId: string;
    appClientId: string;
    backendApiUrl: string;
    adminEmail: string;
    serverAccessLogsBucket: Bucket;
}

export class FrontendStack extends Stack {
    private readonly frontendBucket: Bucket;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const authenticationRequired = authenticationRequiredParameter(this);

        /**
         * S3 Bucket
         * Hosts the React application code.
         */
        this.frontendBucket = new Bucket(this, "ReactApp", {
            encryption: BucketEncryption.S3_MANAGED,
            serverAccessLogsBucket: props.serverAccessLogsBucket,
            serverAccessLogsPrefix: "reactapp_bucket/",
            accessControl: BucketAccessControl.LOG_DELIVERY_WRITE,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            versioned: true,
        });

        this.frontendBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.DENY,
                actions: ["s3:*"],
                principals: [new AnyPrincipal()],
                resources: [this.frontendBucket.arnForObjects("*")],
                conditions: {
                    Bool: {
                        "aws:SecureTransport": false,
                    },
                },
            }),
        );

        this.frontendBucket.addLifecycleRule({
            enabled: true,
            noncurrentVersionExpiration: Duration.days(90),
        });

        this.frontendBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.DENY,
                actions: ["s3:*"],
                principals: [new AnyPrincipal()],
                resources: [this.frontendBucket.arnForObjects("*")],
                conditions: {
                    Bool: {
                        "aws:SecureTransport": false,
                    },
                },
            }),
        );

        // Creating a custom response headers policy -- all parameters optional
        const httpHeaders = new ResponseHeadersPolicy(this, "HttpHeaders", {
            securityHeadersBehavior: {
                // "Content-Security-Policy": "default-src 'self'; img-src 'self' https://*.google-analytics.com blob:; style-src 'unsafe-inline' 'self'; connect-src 'self' https://*.amazoncognito.com https://*.amazonaws.com https://*.google-analytics.com; script-src 'self' https://*.google-analytics.com; block-all-mixed-content;",
                contentSecurityPolicy: {
                    contentSecurityPolicy:
                        "default-src 'self'; img-src 'self' https://*.google-analytics.com blob:; style-src 'unsafe-inline' 'self'; connect-src 'self' https://*.amazoncognito.com https://*.amazonaws.com https://*.google-analytics.com; script-src 'self' https://*.google-analytics.com; block-all-mixed-content;",
                    override: true,
                },
                // "Strict-Transport-Security": "max-age=31540000; includeSubdomains",
                strictTransportSecurity: {
                    accessControlMaxAge: Duration.seconds(31540000),
                    includeSubdomains: true,
                    override: true,
                },
                // "X-Content-Type-Options": "nosniff",
                contentTypeOptions: { override: true },
                // "X-Frame-Options": "DENY",
                frameOptions: {
                    frameOption: HeadersFrameOption.DENY,
                    override: true,
                },
                // "X-XSS-Protection": "1; mode=block",
                xssProtection: {
                    protection: true,
                    modeBlock: true,
                    override: true,
                },
            },
        });

        /**
         * CloudFront Distribution
         * Fronts the S3 bucket as CDN to provide caching and HTTPS.
         */
        const originAccess = new OriginAccessIdentity(this, "CloudFrontOriginAccess");
        this.frontendBucket.grantRead(originAccess);

        const distribution = new Distribution(this, "CloudFrontDistribution", {
            defaultRootObject: "index.html",
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: "/index.html",
                },
            ],
            defaultBehavior: {
                origin: new S3Origin(this.frontendBucket, {
                    originAccessIdentity: originAccess,
                    originPath: "",
                }),
                responseHeadersPolicy: httpHeaders,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });

        const cfnDist: CfnDistribution = distribution.node.defaultChild as CfnDistribution;
        cfnDist.cfnOptions.metadata = {
            cfn_nag: {
                rules_to_suppress: [
                    {
                        id: "W10",
                        reason: "CloudFront Distribution is disabled as there are no user requirements, plus to keep the cost low",
                    },
                    {
                        id: "W70",
                        reason: "If the distribution uses the CloudFront domain name such as d111111abcdef8.cloudfront.net (you set CloudFrontDefaultCertificate to true), CloudFront automatically sets the security policy to TLSv1 regardless of the value that you set here.",
                    },
                ],
            },
        };

        /**
         * S3 Deploy
         * Uploads react built code to the S3 bucket and invalidates CloudFront
         */
        const frontendDeploy = new BucketDeployment(this, "Deploy-Frontend", {
            sources: [Source.asset("../frontend/build")],
            destinationBucket: this.frontendBucket,
            memoryLimit: 2048,
            prune: false,
            distribution,
        });

        const deployConfig = this.deployEnvironmentConfig(props, authenticationRequired);
        // Make sure env.js gets deployed after the React code so
        // it doesn't get overwritten.
        deployConfig.node.addDependency(frontendDeploy);

        /**
         * Stack Outputs
         */
        new CfnOutput(this, "CloudFrontURL", {
            value: distribution.distributionDomainName,
        });
        new CfnOutput(this, "ReactAppBucketName", {
            value: this.frontendBucket.bucketName,
        });
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
                FRONTEND_BUCKET: this.frontendBucket.bucketName,
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

        lambdaFunction.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                resources: [this.frontendBucket.arnForObjects("*")],
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
