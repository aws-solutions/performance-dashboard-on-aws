/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { BackendApi } from "./constructs/api";
import { Database } from "./constructs/database";
import { LambdaFunctions } from "./constructs/lambdas";
import { DatasetStorage } from "./constructs/datastorage";
import { ContentStorage } from "./constructs/contentstorage";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface BackendStackProps extends StackProps {
    userPool: {
        id: string;
        arn: string;
    };
    datasetsBucketName: string;
    contentBucketName: string;
    authenticationRequired: boolean;
}

export class BackendStack extends Stack {
    public readonly privateApiFunction: Function;
    public readonly publicApiFunction: Function;
    public readonly dynamodbStreamsFunction: Function;
    public readonly mainTable: Table;
    public readonly auditTrailTable: Table;
    public readonly restApi: RestApi;
    public readonly datasetsBucketArn: string;

    constructor(scope: Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);

        const dataStorage = new DatasetStorage(this, "DatasetStorage", {
            datasetsBucketName: props.datasetsBucketName,
        });

        const contentStorage = new ContentStorage(this, "ContentStorage", {
            contentBucketName: props.contentBucketName,
        });

        const database = new Database(this, "Database");
        const lambdas = new LambdaFunctions(this, "Functions", {
            mainTable: database.mainTable,
            auditTrailTable: database.auditTrailTable,
            datasetsBucket: dataStorage.datasetsBucket,
            contentBucket: contentStorage.contentBucket,
            userPool: props.userPool,
            authenticationRequired: props.authenticationRequired,
        });

        const backendApi = new BackendApi(this, "Api", {
            cognitoUserPoolArn: props.userPool.arn,
            apiFunction: lambdas.apiHandler,
            publicApiFunction: lambdas.publicApiHandler,
            authenticationRequired: props.authenticationRequired,
        });

        /**
         * Outputs
         */
        this.privateApiFunction = lambdas.apiHandler;
        this.publicApiFunction = lambdas.publicApiHandler;
        this.dynamodbStreamsFunction = lambdas.ddbStreamProcessor;
        this.mainTable = database.mainTable;
        this.restApi = backendApi.api;
        this.datasetsBucketArn = dataStorage.datasetsBucket.bucketArn;

        new CfnOutput(this, "ApiGatewayEndpoint", {
            value: this.restApi.url,
        });

        new CfnOutput(this, "DynamoDbTableName", {
            value: database.mainTable.tableName,
        });

        new CfnOutput(this, "DatasetsBucketName", {
            value: dataStorage.datasetsBucket.bucketName,
        });
    }
}
