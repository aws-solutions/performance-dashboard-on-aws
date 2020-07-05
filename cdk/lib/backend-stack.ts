import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from '@aws-cdk/aws-dynamodb';

interface BackendStackProps extends cdk.StackProps {
    userPoolArn: string,
};

export class BackendStack extends cdk.Stack {
    public readonly apiGatewayEndpoint : string;

    constructor(scope: cdk.Construct, id: string, props: BackendStackProps) {
        super(scope, id, props);

        /**
         * DynamoDB Tables
         */
        const table = new dynamodb.Table(this, 'BadgerTable', {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: 'pk',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'sk',
                type: dynamodb.AttributeType.STRING
            },
        });

        /**
         * Lambda functions
         */
        const handler = new lambda.Function(this, "ApiLambda", {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.asset("../backend/build"),
            handler: "lambda/api.handler",
            environment: {
                BADGER_TABLE: table.tableName,
            }
        });

        /**
         * Badger API
         */
        const api = new apigateway.RestApi(this, "ApiGateway", {
            description: "Badger API",
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
            }
        });

        const apiIntegration = new apigateway.LambdaIntegration(handler);
        
        /**
         * GET
         * /dashboard
         */
        const dashboards = api.root.addResource('dashboard');
        dashboards.addMethod("GET", apiIntegration);

        /**
         * GET
         * /dashboard/{dashboardId}
         */
        const dashboard = dashboards.addResource('{dashboardId}');
        dashboard.addMethod("GET", apiIntegration);

        /**
         * Admin API
         */

         /**
         * Cognito Authorizer
         */
        const authorizer = new apigateway.CfnAuthorizer(this, 'CognitoAuth', {
            type: apigateway.AuthorizationType.COGNITO,
            name: 'cognito-authorizer',
            restApiId: api.restApiId,
            providerArns: [props.userPoolArn],
            identitySource: 'method.request.header.Authorization',
        });

        const admin = api.root.addResource('admin');
        const adminDashboards = admin.addResource("dashboard");
        adminDashboards.addMethod("GET", apiIntegration, {
            authorizationType: apigateway.AuthorizationType.COGNITO,
            authorizer: { authorizerId: authorizer.ref },
        });

        /**
         * Outputs
         */
        this.apiGatewayEndpoint = api.url;
    }
}