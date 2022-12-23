/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnOutput, CfnParameter, CustomResource, Stack, StackProps } from "aws-cdk-lib";
import { ExampleDashboardLambda } from "./constructs/exampledashboardlambda";
import { Function } from "aws-cdk-lib/aws-lambda";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Provider } from "aws-cdk-lib/custom-resources";

interface DashboardExamplesProps extends StackProps {
    datasetsBucketName: string;
    datasetsBucketArn: string;
    databaseTableName: string;
    databaseTableArn: string;
    adminEmail: string;
}

export class DashboardExamplesStack extends Stack {
    public readonly exampleSetupLambda: Function;
    public readonly exampleBucket: Bucket;

    constructor(scope: Construct, id: string, props: DashboardExamplesProps) {
        super(scope, id, props);

        const exampleLanguage = new CfnParameter(this, "exampleLanguage", {
            type: "String",
            description: "Language for example dashboards",
            allowedValues: ["english", "spanish", "portuguese"],
            default: "english",
        });

        const exampleBucket = new Bucket(this, "ExampleBucket", {
            encryption: BucketEncryption.S3_MANAGED,
            versioned: false,
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
