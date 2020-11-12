import * as cdk from "@aws-cdk/core";
import { BackendApi } from "./constructs/api";
import { Database } from "./constructs/database";
import { LambdaFunctions } from "./constructs/lambdas";
import { DatasetStorage } from "./constructs/datastorage";

interface BackendStackProps extends cdk.StackProps {
  userPoolArn: string;
  datasetsBucketName: string;
}

export class BackendStack extends cdk.Stack {
  public readonly apiGatewayEndpoint: string;
  public readonly dynamodbTableName: string;

  constructor(scope: cdk.Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const dataStorage = new DatasetStorage(this, "DatasetStorage", {
      datasetsBucketName: props.datasetsBucketName,
    });

    const database = new Database(this, "Database");
    const lambdas = new LambdaFunctions(this, "Functions", {
      mainTable: database.mainTable,
      datasetsBucket: dataStorage.datasetsBucket,
    });

    const backendApi = new BackendApi(this, "Api", {
      cognitoUserPoolArn: props.userPoolArn,
      apiFunction: lambdas.apiHandler,
      publicApiFunction: lambdas.publicApiHandler,
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
