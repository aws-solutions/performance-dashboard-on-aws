/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnCondition, CfnOutput, Duration, Fn, Stack, StackProps } from "aws-cdk-lib";
import {
    CfnDistribution,
    Distribution,
    HeadersFrameOption,
    OriginAccessIdentity,
    ResponseHeadersPolicy,
    AllowedMethods,
    ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { AnyPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { ServerAccessLogsStorage } from "./constructs/serveraccesslogstorage";
import { authenticationRequiredParameter, domainNameParameter } from "./constructs/parameters";

export class FrontendStack extends Stack {
    public readonly reactBucketName: string;
    public readonly distributionDomainName: string;
    public readonly serverAccessLogsBucketName: string;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        authenticationRequiredParameter(this);

        const domainName = domainNameParameter(this);

        const domainNameIsEmptyCond = new CfnCondition(this, "DomainNameIsEmptyCond", {
            expression: Fn.conditionEquals(domainName, ""),
        });

        const serveraccesslogStorage = new ServerAccessLogsStorage(this, "ServerAccessLogsStorage");

        /**
         * S3 Bucket
         * Hosts the React application code.
         */
        const frontendBucket = new Bucket(this, "ReactApp", {
            encryption: BucketEncryption.S3_MANAGED,
            serverAccessLogsBucket: serveraccesslogStorage.serverAccessLogsBucket,
            serverAccessLogsPrefix: "reactapp_bucket/",
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            versioned: true,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
        });

        frontendBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.DENY,
                actions: ["s3:*"],
                principals: [new AnyPrincipal()],
                resources: [frontendBucket.arnForObjects("*")],
                conditions: {
                    Bool: {
                        "aws:SecureTransport": false,
                    },
                },
            }),
        );

        frontendBucket.addLifecycleRule({
            enabled: true,
            noncurrentVersionExpiration: Duration.days(90),
        });

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
        frontendBucket.grantRead(originAccess);

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
                origin: new S3Origin(frontendBucket, {
                    originAccessIdentity: originAccess,
                    originPath: "",
                }),
                responseHeadersPolicy: httpHeaders,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            domainNames: Fn.conditionIf(
                domainNameIsEmptyCond.logicalId,
                [],
                [domainName.valueAsString],
            ) as any,
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
        new BucketDeployment(this, "Deploy-Frontend", {
            sources: [Source.asset("../frontend/build")],
            destinationBucket: frontendBucket,
            memoryLimit: 2048,
            prune: false,
            distribution,
        });

        this.reactBucketName = frontendBucket.bucketName;
        this.distributionDomainName = distribution.distributionDomainName;
        this.serverAccessLogsBucketName = serveraccesslogStorage.serverAccessLogsBucket.bucketName;

        /**
         * Stack Outputs
         */
        new CfnOutput(this, "CloudFrontURL", {
            value: distribution.distributionDomainName,
        });
        new CfnOutput(this, "ReactAppBucketName", {
            value: frontendBucket.bucketName,
        });
    }
}
