import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as s3 from "@aws-cdk/aws-s3";

interface Props {
  mainTable: dynamodb.Table;
  datasetsBucket: s3.Bucket;
}

export class BadgerLambdas extends cdk.Construct {
  public readonly apiHandler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id);

    this.apiHandler = new lambda.Function(this, "ApiLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("../backend/build"),
      handler: "lambda/api.handler",
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 256,
      environment: {
        MAIN_TABLE: props.mainTable.tableName,
        DATASETS_BUCKET: props.datasetsBucket.bucketName,
      },
    });

    this.apiHandler.addToRolePolicy(
      new iam.PolicyStatement({
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
      })
    );

    this.apiHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [props.datasetsBucket.arnForObjects("*")],
        actions: ["s3:GetObject", "s3:PutObject"],
      })
    );
  }
}
