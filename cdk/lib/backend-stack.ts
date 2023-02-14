/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { BackendApi } from "./constructs/api";
import { Database } from "./constructs/database";
import { LambdaFunctions } from "./constructs/lambdas";
import { DatasetStorage } from "./constructs/datastorage";
import { ContentStorage } from "./constructs/contentstorage";
import { CfnCondition, CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { authenticationRequiredParameter } from "./constructs/parameters";

interface BackendStackProps extends StackProps {
    userPool: {
        id: string;
        arn: string;
    };
    datasetsBucketName: string;
    contentBucketName: string;
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

        const authenticationRequired = authenticationRequiredParameter(this);

        const authenticationRequiredCond = new CfnCondition(this, "AuthenticationRequiredCond", {
            expression: Fn.conditionEquals(authenticationRequired, "yes"),
        });

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
            datasetsBucketArn: dataStorage.datasetsBucket.bucketArn,
            contentBucketArn: contentStorage.contentBucket.bucketArn,
            userPool: props.userPool,
            authenticationRequired: authenticationRequired.valueAsString,
        });

        const backendApi = new BackendApi(this, "Api", {
            cognitoUserPoolArn: props.userPool.arn,
            apiFunction: lambdas.apiHandler,
            publicApiFunction: lambdas.publicApiHandler,
            authenticationRequiredCond,
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
