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
import { authenticationRequiredParameter, domainNameParameter } from "./constructs/parameters";
import { IBucket, Bucket } from "aws-cdk-lib/aws-s3";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

interface BackendStackProps extends StackProps {
    userPool: {
        id: string;
        arn: string;
    };
    datasetsBucketName: string;
    contentBucketName: string;
    serverAccessLogsBucketName: string;
    distributionDomainName: string;
}

export class BackendStack extends Stack {
    public readonly privateApiFunction: Function;
    public readonly publicApiFunction: Function;
    public readonly dynamodbStreamsFunction: Function;
    public readonly mainTable: Table;
    public readonly auditTrailTable: Table;
    public readonly restApi: RestApi;
    public readonly datasetsBucketArn: string;
    public readonly serverAccessLogsBucket: IBucket;

    constructor(scope: Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);

        const authenticationRequired = authenticationRequiredParameter(this);

        const authenticationRequiredCond = new CfnCondition(this, "AuthenticationRequiredCond", {
            expression: Fn.conditionEquals(authenticationRequired, "yes"),
        });

        const domainName = domainNameParameter(this);

        const domainNameIsEmptyCond = new CfnCondition(this, "DomainNameIsEmptyCond", {
            expression: Fn.conditionEquals(domainName, ""),
        });

        const cookiesSecret = new Secret(this, "CookiesSecret");
        const csrfSecret = new Secret(this, "CSRFSecret");

        const serveraccesslogStorage = Bucket.fromBucketName(
            this,
            "ServerAccessLogsStorage",
            props.serverAccessLogsBucketName,
        );

        const dataStorage = new DatasetStorage(this, "DatasetStorage", {
            datasetsBucketName: props.datasetsBucketName,
            serverAccessLogsBucket: serveraccesslogStorage,
        });

        const contentStorage = new ContentStorage(this, "ContentStorage", {
            contentBucketName: props.contentBucketName,
            serverAccessLogsBucket: serveraccesslogStorage,
        });

        const frontendOrigin = [
            `https://${props.distributionDomainName}`,
            `https://${Fn.conditionIf(
                domainNameIsEmptyCond.logicalId,
                props.distributionDomainName,
                domainName.valueAsString,
            ).toString()}`,
        ];

        const database = new Database(this, "Database");
        const lambdas = new LambdaFunctions(this, "Functions", {
            mainTable: database.mainTable,
            auditTrailTable: database.auditTrailTable,
            datasetsBucketArn: dataStorage.datasetsBucket.bucketArn,
            contentBucketArn: contentStorage.contentBucket.bucketArn,
            userPool: props.userPool,
            authenticationRequired: authenticationRequired.valueAsString,
            csrfSecret: csrfSecret.secretValue.toString(),
            cookiesSecret: cookiesSecret.secretValue.toString(),
            frontendOrigin: frontendOrigin,
        });

        const backendApi = new BackendApi(this, "Api", {
            cognitoUserPoolArn: props.userPool.arn,
            apiFunction: lambdas.apiHandler,
            publicApiFunction: lambdas.publicApiHandler,
            authenticationRequiredCond,
            frontendOrigin: frontendOrigin,
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
        this.serverAccessLogsBucket = serveraccesslogStorage;

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
