/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnOutput, CustomResource, Duration, Stack, StackProps } from "aws-cdk-lib";
import { ExampleDashboardLambda } from "./constructs/exampledashboardlambda";
import { Function } from "aws-cdk-lib/aws-lambda";
import { BlockPublicAccess, Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Provider } from "aws-cdk-lib/custom-resources";
import { exampleLanguageParameter } from "./constructs/parameters";
import { AnyPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface DashboardExamplesProps extends StackProps {
    datasetsBucketName: string;
    datasetsBucketArn: string;
    databaseTableName: string;
    databaseTableArn: string;
    adminEmail: string;
    serverAccessLogsBucket: Bucket;
}

export class DashboardExamplesStack extends Stack {
    public readonly exampleSetupLambda: Function;
    public readonly exampleBucket: Bucket;

    constructor(scope: Construct, id: string, props: DashboardExamplesProps) {
        super(scope, id, props);

        const exampleLanguage = exampleLanguageParameter(this);

        const exampleBucket = new Bucket(this, "ExampleBucket", {
            encryption: BucketEncryption.S3_MANAGED,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            serverAccessLogsBucket: props.serverAccessLogsBucket,
            serverAccessLogsPrefix: "example_bucket/",
            versioned: true,
        });

        exampleBucket.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.DENY,
                actions: ["s3:*"],
                principals: [new AnyPrincipal()],
                resources: [exampleBucket.arnForObjects("*")],
                conditions: {
                    Bool: {
                        "aws:SecureTransport": false,
                    },
                },
            }),
        );

        exampleBucket.addLifecycleRule({
            enabled: true,
            noncurrentVersionExpiration: Duration.days(90),
        });

        const lambdas = new ExampleDashboardLambda(this, "SetupExampleDashboardLambda", {
            exampleBucketArn: exampleBucket.bucketArn,
            exampleBucketName: exampleBucket.bucketName,
            datasetBucketArn: props.datasetsBucketArn,
            datasetBucketName: props.datasetsBucketName,
            databaseTableName: props.databaseTableName,
            databaseTableArn: props.databaseTableArn,
            adminEmail: props.adminEmail,
            exampleLanguage: exampleLanguage.valueAsString,
        });

        /**
         * S3 Deploy
         * Uploads examples to S3 to be able to install from there
         */
        const examplesDeploy = new BucketDeployment(this, "Deploy-Examples", {
            sources: [Source.asset("../examples/resources/")],
            destinationBucket: exampleBucket,
            memoryLimit: 2048,
            prune: false,
        });

        /**
         * Outputs
         */
        this.exampleSetupLambda = lambdas.exampleSetupLambda;
        this.exampleBucket = exampleBucket;

        const provider = new Provider(this, "ExampleProvider", {
            onEventHandler: lambdas.exampleSetupLambda,
        });

        const resource = new CustomResource(this, "ExampleDeployment", {
            serviceToken: provider.serviceToken,
        });

        resource.node.addDependency(examplesDeploy);

        new CfnOutput(this, "ExamplesStorageBucket", {
            value: exampleBucket.bucketName,
        });
    }
}
