import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from '@aws-cdk/aws-iam'; 
import { BadgerApi } from './constructs/api';
import { BadgerDatabase } from './constructs/database';
import { BadgerLambdas } from './constructs/lambdas';

interface BackendStackProps extends cdk.StackProps {
    userPoolArn: string,
};

export class BackendStack extends cdk.Stack {
    public readonly apiGatewayEndpoint : string;
    public readonly dynamodbTableName  : string;

    constructor(scope: cdk.Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);

        const database = new BadgerDatabase(this, "Database");
        const lambdas = new BadgerLambdas(this, "Compute", {
            mainTable: database.mainTable,
        });

        const badgerApi = new BadgerApi(this, "Api", {
            cognitoUserPoolArn: props.userPoolArn,
            apiFunction: lambdas.apiHandler,
        });

        /**
         * Outputs
         */
        this.apiGatewayEndpoint = badgerApi.api.url;
        this.dynamodbTableName = database.mainTable.tableName;
        new cdk.CfnOutput(this, 'ApiGatewayEndpoint', { value: this.apiGatewayEndpoint });
        new cdk.CfnOutput(this, 'DynamoDbTableName', { value: this.dynamodbTableName });
    }
}