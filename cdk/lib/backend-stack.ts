import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigateway from "@aws-cdk/aws-apigateway";
import { BackendApi } from "./constructs/api";
import { Database } from "./constructs/database";
import { LambdaFunctions } from "./constructs/lambdas";
import { DatasetStorage } from "./constructs/datastorage";
import { AuthStack } from "./auth-stack";

interface BackendStackProps extends cdk.StackProps {
  auth: AuthStack;
  datasetsBucketName: string;
}

export class BackendStack extends cdk.Stack {
  public readonly privateApiFunction: lambda.Function;
  public readonly publicApiFunction: lambda.Function;
  public readonly mainTable: dynamodb.Table;
  public readonly restApi: apigateway.RestApi;

  constructor(scope: cdk.Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const dataStorage = new DatasetStorage(this, "DatasetStorage", {
      datasetsBucketName: props.datasetsBucketName,
    });

    const database = new Database(this, "Database");
    const lambdas = new LambdaFunctions(this, "Functions", {
      mainTable: database.mainTable,
      datasetsBucket: dataStorage.datasetsBucket,
      auth: props.auth,
    });

    const backendApi = new BackendApi(this, "Api", {
      cognitoUserPoolArn: props.auth.userPoolArn,
      apiFunction: lambdas.apiHandler,
      publicApiFunction: lambdas.publicApiHandler,
    });

    /**
     * Outputs
     */
    this.privateApiFunction = lambdas.apiHandler;
    this.publicApiFunction = lambdas.publicApiHandler;
    this.mainTable = database.mainTable;
    this.restApi = backendApi.api;

    new cdk.CfnOutput(this, "ApiGatewayEndpoint", {
      value: this.restApi.url,
    });

    new cdk.CfnOutput(this, "DynamoDbTableName", {
      value: database.mainTable.tableName,
    });

    new cdk.CfnOutput(this, "DatasetsBucketName", {
      value: dataStorage.datasetsBucket.bucketName,
    });
  }
}
