import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as s3 from "@aws-cdk/aws-s3";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import logs = require("@aws-cdk/aws-logs");

interface Props {
  exampleBucketArn: string;
  exampleBucketName: string;
  datasetBucketArn: string;
  datasetBucketName: string;
  databaseTableName: string;
  databaseTableArn: string;
}

export class ExampleDashboardLambda extends cdk.Construct {
  public readonly exampleSetupLambda: lambda.Function;
  public readonly publicApiHandler: lambda.Function;
  public readonly ddbStreamProcessor: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id);

    this.exampleSetupLambda = new lambda.Function(this, "SetupExamples", {
      runtime: lambda.Runtime.NODEJS_12_X,
      description: "Inserts examples into database for end users",
      code: lambda.Code.fromAsset("lib/examples/setup-example-lambda/build"),
      handler: "index.handler",
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 256,
      timeout: cdk.Duration.seconds(180),
      reservedConcurrentExecutions: 1,
      logRetention: logs.RetentionDays.TEN_YEARS,
      environment: {
        EXAMPLE_CLI_TABLENAME: props.databaseTableName,
        EXAMPLE_CLI_EXAMPLESBUCKET: props.exampleBucketName,
        EXAMPLE_CLI_DATASETBUCKET: props.datasetBucketName
      },
    });

    this.publicApiHandler = new lambda.Function(this, "PublicApi", {
      runtime: lambda.Runtime.NODEJS_12_X,
      description: "Handles API Gateway traffic from public users",
      code: lambda.Code.fromAsset("../backend/build"),
      handler: "src/lambda/api.handler",
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      logRetention: logs.RetentionDays.TEN_YEARS,
      environment: {
        MAIN_TABLE: props.mainTable.tableName,
        DATASETS_BUCKET: props.datasetsBucket.bucketName,
        CONTENT_BUCKET: props.contentBucket.bucketName,
        LOG_LEVEL: "info",
      },
    });


    const dynamodbPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        // Grant permissions to tables themselves
        props.mainTable.tableArn,
        props.auditTrailTable.tableArn,
        // Grant permissions to the GSI indexes
        props.mainTable.tableArn.concat("/index/*"),
        props.auditTrailTable.tableArn.concat("/index/*"),
      ],
      actions: [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:ConditionCheckItem",
        "dynamodb:GetRecords",
        "dynamodb:GetShardIterator",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
      ],
    });

    const s3Policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [props.datasetsBucket.arnForObjects("*")],
      actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
    });

    const cognitoPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [props.userPool.arn],
      actions: [
        "cognito-idp:ListUsers",
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminDeleteUser",
        "cognito-idp:AdminUpdateUserAttributes",
      ],
    });

    this.apiHandler.addToRolePolicy(dynamodbPolicy);
    this.apiHandler.addToRolePolicy(s3Policy);
    this.apiHandler.addToRolePolicy(cognitoPolicy);

    this.publicApiHandler.addToRolePolicy(dynamodbPolicy);
    this.publicApiHandler.addToRolePolicy(s3Policy);

    this.ddbStreamProcessor.addToRolePolicy(dynamodbPolicy);
  }
}
