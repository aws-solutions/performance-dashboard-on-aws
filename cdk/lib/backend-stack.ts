import * as cdk from "@aws-cdk/core";
import { BadgerApi } from "./constructs/api";
import { BadgerDatabase } from "./constructs/database";
import { BadgerLambdas } from "./constructs/lambdas";
import { BadgerDataStorage } from "./constructs/datastorage";

interface BackendStackProps extends cdk.StackProps {
  userPoolArn: string;
  datasetsBucketName: string;
}

export class BackendStack extends cdk.Stack {
  public readonly apiGatewayEndpoint: string;
  public readonly dynamodbTableName: string;

  constructor(scope: cdk.Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const dataStorage = new BadgerDataStorage(this, "DataStorage", {
      datasetsBucketName: props.datasetsBucketName,
    });

    const database = new BadgerDatabase(this, "Database");
    const lambdas = new BadgerLambdas(this, "Compute", {
      mainTable: database.mainTable,
      datasetsBucket: dataStorage.datasetsBucket,
    });

    const backendApi = new BadgerApi(this, "Api", {
      cognitoUserPoolArn: props.userPoolArn,
      apiFunction: lambdas.apiHandler,
    });

    /**
     * Outputs
     */
    this.apiGatewayEndpoint = backendApi.api.url;
    this.dynamodbTableName = database.mainTable.tableName;

    new cdk.CfnOutput(this, "ApiGatewayEndpoint", {
      value: this.apiGatewayEndpoint,
    });

    new cdk.CfnOutput(this, "DynamoDbTableName", {
      value: this.dynamodbTableName,
    });

    new cdk.CfnOutput(this, "DatasetsBucketName", {
      value: dataStorage.datasetsBucket.bucketName,
    });
  }
}
