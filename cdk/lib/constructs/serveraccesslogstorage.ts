/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Bucket, BucketEncryption, HttpMethods, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Effect, PolicyStatement, AnyPrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class ServerAccessLogsStorage extends Construct {
    public readonly serverAccessLogsBucket: Bucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.serverAccessLogsBucket = new Bucket(scope, "ServerAccessLogsBucket", {
            encryption: BucketEncryption.S3_MANAGED,
            versioned: true,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            /**
             * CORS policy taken from Amplify Docs.
             * This bucket policy allows file uploads from the web browser.
             * https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-CorsRule.html
             */
            cors: [
                {
                    maxAge: 3000,
                    allowedOrigins: ["*"],
                    allowedHeaders: ["*"],
                    allowedMethods: [
                        HttpMethods.GET,
                        HttpMethods.HEAD,
                        HttpMethods.PUT,
                        HttpMethods.POST,
                        HttpMethods.DELETE,
                    ],
                    exposedHeaders: [
                        "x-amz-server-side-encryption",
                        "x-amz-request-id",
                        "x-amz-id-2",
                        "x-amz-meta-filename",
                        "ETag",
                    ],
                },
            ],
        });

        this.serverAccessLogsBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.DENY,
                actions: ["s3:*"],
                principals: [new AnyPrincipal()],
                resources: [this.serverAccessLogsBucket.arnForObjects("*")],
                conditions: {
                    Bool: {
                        "aws:SecureTransport": false,
                    },
                },
            }),
        );
    }
}
