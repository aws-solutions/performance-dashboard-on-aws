/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Table } from "aws-cdk-lib/aws-dynamodb";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Code, Function, Runtime, StartingPosition, Tracing } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface Props {
    mainTable: Table;
    auditTrailTable: Table;
    datasetsBucket: Bucket;
    contentBucket: Bucket;
    userPool: {
        id: string;
        arn: string;
    };
    authenticationRequired: boolean;
}

export class LambdaFunctions extends Construct {
    public readonly apiHandler: Function;
    public readonly publicApiHandler: Function;
    public readonly ddbStreamProcessor: Function;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.apiHandler = new Function(this, "PrivateApi", {
            runtime: Runtime.NODEJS_16_X,
            description: "Handles API Gateway traffic from admin users",
            code: Code.fromAsset("../backend/build"),
            handler: "src/lambda/api.handler",
            tracing: Tracing.ACTIVE,
            memorySize: 256,
            timeout: Duration.seconds(10),
            reservedConcurrentExecutions: 25,
            logRetention: RetentionDays.TEN_YEARS,
            environment: {
                MAIN_TABLE: props.mainTable.tableName,
                AUDIT_TRAIL_TABLE: props.auditTrailTable.tableName,
                DATASETS_BUCKET: props.datasetsBucket.bucketName,
                CONTENT_BUCKET: props.contentBucket.bucketName,
                USER_POOL_ID: props.userPool.id,
                LOG_LEVEL: "info",
                AUTHENTICATION_REQUIRED: props.authenticationRequired.toString(),
            },
        });

        // This function handles traffic coming from the public.
        // It provides flexibility to define specific throttling limits
        // between this lambda vs the one that handles private traffic.
        this.publicApiHandler = new Function(this, "PublicApi", {
            runtime: Runtime.NODEJS_16_X,
            description: "Handles API Gateway traffic from public users",
            code: Code.fromAsset("../backend/build"),
            handler: "src/lambda/api.handler",
            tracing: Tracing.ACTIVE,
            memorySize: 256,
            timeout: Duration.seconds(10),
            logRetention: RetentionDays.TEN_YEARS,
            environment: {
                MAIN_TABLE: props.mainTable.tableName,
                DATASETS_BUCKET: props.datasetsBucket.bucketName,
                CONTENT_BUCKET: props.contentBucket.bucketName,
                LOG_LEVEL: "info",
                AUTHENTICATION_REQUIRED: props.authenticationRequired.toString(),
            },
        });

        // The DynamoDB Stream processor is a Lambda function that triggers
        // based on the stream from the Main table. Its primary function is to
        // write updates to the Audit Trail table.
        this.ddbStreamProcessor = new Function(this, "DynamoDBStreamProcessor", {
            runtime: Runtime.NODEJS_16_X,
            description: "Handles messages from the main table's DynamoDB stream",
            code: Code.fromAsset("../backend/build"),
            handler: "src/lambda/streams.handler",
            tracing: Tracing.ACTIVE,
            memorySize: 256,
            timeout: Duration.seconds(10),
            // You may need to increase the lambda concurrent qouta of your AWS account
            // https://{aws-region}.console.aws.amazon.com/servicequotas/home/services/lambda/quotas/L-B99A9384
            reservedConcurrentExecutions: 10,
            logRetention: RetentionDays.TEN_YEARS,
            environment: {
                AUDIT_TRAIL_TABLE: props.auditTrailTable.tableName,
                LOG_LEVEL: "info",
            },
        });

        // Connect the Lambda function to the DynamoDB Stream of the main table
        this.ddbStreamProcessor.addEventSource(
            new DynamoEventSource(props.mainTable, {
                startingPosition: StartingPosition.TRIM_HORIZON,
                enabled: true,
                batchSize: 1,
                bisectBatchOnError: false,
                retryAttempts: 10,
            }),
        );

        const dynamodbPolicy = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [
                // Grant permissions to tables themselves
                props.mainTable.tableArn,
                props.auditTrailTable.tableArn,
                // Grant permissions to the GSI indexes
                props.mainTable.tableArn.concat("/index/*"),
                props.auditTrailTable.tableArn.concat("/index/*"),
            ],
            actions: [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:DeleteItem",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem",
                "dynamodb:ConditionCheckItem",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:UpdateItem",
            ],
        });

        const s3Policy = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.datasetsBucket.arnForObjects("*")],
            actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        });

        const cognitoPolicy = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.userPool.arn],
            actions: [
                "cognito-idp:ListUsers",
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminDeleteUser",
                "cognito-idp:AdminUpdateUserAttributes",
            ],
        });

        this.apiHandler.addToRolePolicy(dynamodbPolicy);
        this.apiHandler.addToRolePolicy(s3Policy);
        this.apiHandler.addToRolePolicy(cognitoPolicy);

        this.publicApiHandler.addToRolePolicy(dynamodbPolicy);
        this.publicApiHandler.addToRolePolicy(s3Policy);

        this.ddbStreamProcessor.addToRolePolicy(dynamodbPolicy);
    }
}
