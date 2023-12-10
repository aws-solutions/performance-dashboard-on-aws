/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Construct } from "constructs";
import { Code, Function, Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface Props {
    databaseTableName: string;
    databaseTableArn: string;
    datasetBucketArn: string;
    datasetBucketName: string;
    exampleBucketArn: string;
    exampleBucketName: string;
    adminEmail: string;
    exampleLanguage: string;
}

export class ExampleDashboardLambda extends Construct {
    public readonly exampleSetupLambda: Function;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.exampleSetupLambda = new Function(this, "SetupExamples", {
            runtime: Runtime.NODEJS_18_X,
            description: "Inserts examples into database for end users",
            code: Code.fromAsset("../examples/build"),
            handler: "src/index.handler",
            tracing: Tracing.ACTIVE,
            memorySize: 256,
            timeout: Duration.seconds(180),
            reservedConcurrentExecutions: 1,
            logRetention: RetentionDays.TEN_YEARS,
            environment: {
                MAIN_TABLE: props.databaseTableName,
                DATASETS_BUCKET: props.datasetBucketName,
                EXAMPLES_BUCKET: props.exampleBucketName,
                USER_EMAIL: props.adminEmail,
                EXAMPLE: props.exampleLanguage,
            },
        });

        const writeTablePolic = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [
                // Grant permissions to tables themselves
                props.databaseTableArn,
            ],
            actions: ["dynamodb:PutItem", "dynamodb:Query"],
        });

        const s3ReadExamples = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.exampleBucketArn, `${props.exampleBucketArn}/*`],
            actions: ["s3:GetObject", "s3:List*"],
        });

        const writeData = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.datasetBucketArn, `${props.datasetBucketArn}/*`],
            actions: ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
        });

        this.exampleSetupLambda.addToRolePolicy(writeTablePolic);
        this.exampleSetupLambda.addToRolePolicy(s3ReadExamples);
        this.exampleSetupLambda.addToRolePolicy(writeData);
    }
}
