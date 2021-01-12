import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as s3 from "@aws-cdk/aws-s3";

interface Props {
  mainTable: dynamodb.Table;
  datasetsBucket: s3.Bucket;
  userPool: {
    id: string;
    arn: string;
  };
}

export class LambdaFunctions extends cdk.Construct {
  public readonly apiHandler: lambda.Function;
  public readonly publicApiHandler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id);

    this.apiHandler = new lambda.Function(this, "PrivateApi", {
      runtime: lambda.Runtime.NODEJS_12_X,
      description: "Handles API Gateway traffic from admin users",
      code: lambda.Code.fromAsset("../backend/build"),
      handler: "lambda/api.handler",
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      reservedConcurrentExecutions: 25,
      environment: {
        MAIN_TABLE: props.mainTable.tableName,
        DATASETS_BUCKET: props.datasetsBucket.bucketName,
        USER_POOL_ID: props.userPool.id,
        LOG_LEVEL: "info",
      },
    });

    // This function handles traffic coming from the public.
    // It provides flexibility to define specific throttling limits
    // between this lambda vs the one that handles private traffic.
    this.publicApiHandler = new lambda.Function(this, "PublicApi", {
      runtime: lambda.Runtime.NODEJS_12_X,
      description: "Handles API Gateway traffic from public users",
      code: lambda.Code.fromAsset("../backend/build"),
      handler: "lambda/api.handler",
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        MAIN_TABLE: props.mainTable.tableName,
        DATASETS_BUCKET: props.datasetsBucket.bucketName,
        LOG_LEVEL: "info",
      },
    });

    const dynamodbPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        // Grant permissions to table itself
        props.mainTable.tableArn,
        // Grant permissions to GSI indexes
        props.mainTable.tableArn.concat("/index/*"),
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
      actions: ["cognito-idp:ListUsers", "cognito-idp:AdminCreateUser"],
    });

    this.apiHandler.addToRolePolicy(dynamodbPolicy);
    this.apiHandler.addToRolePolicy(s3Policy);
    this.apiHandler.addToRolePolicy(cognitoPolicy);
    this.publicApiHandler.addToRolePolicy(dynamodbPolicy);
    this.publicApiHandler.addToRolePolicy(s3Policy);
  }
}
