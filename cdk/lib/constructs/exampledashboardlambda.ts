import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import logs = require("@aws-cdk/aws-logs");

interface Props {
  exampleBucketArn: string;
  exampleBucketName: string;
  datasetBucketArn: string;
  datasetBucketName: string;
  databaseTableName: string;
  databaseTableArn: string;
  adminEmail: string;
  language: string;
}

export class ExampleDashboardLambda extends cdk.Construct {
  public readonly exampleSetupLambda: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id);

    this.exampleSetupLambda = new lambda.Function(this, "SetupExamples", {
      runtime: lambda.Runtime.NODEJS_14_X,
      description: "Inserts examples into database for end users",
      code: lambda.Code.fromAsset("../examples/setupexample-lambda/build"),
      handler: "index.handler",
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 256,
      timeout: cdk.Duration.seconds(180),
      reservedConcurrentExecutions: 1,
      logRetention: logs.RetentionDays.TEN_YEARS,
      environment: {
        EXAMPLE_TABLENAME: props.databaseTableName,
        EXAMPLE_EXAMPLESBUCKET: props.exampleBucketName,
        EXAMPLE_DATASETBUCKET: props.datasetBucketName,
        EXAMPLE_USEREMAIL: props.adminEmail,
        EXAMPLE_LANGUAGE: props.language,
      },
    });


    const writeTablePolic = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        // Grant permissions to tables themselves
        props.databaseTableArn
      ],
      actions: [
        "dynamodb:PutItem"
      ],
    });

    const s3ReadExamples = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        props.exampleBucketArn,
        `${props.exampleBucketArn}/*`
      ],
      actions: [
        "s3:GetObject",
         "s3:List*"
      ],
    });


    const writeData = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        props.datasetBucketArn,
        `${props.datasetBucketArn}/*`
      ],
      actions: [
        "s3:PutObject",
        "s3:ListBucket"
      ],
    });

    this.exampleSetupLambda.addToRolePolicy(writeTablePolic);
    this.exampleSetupLambda.addToRolePolicy(s3ReadExamples);
    this.exampleSetupLambda.addToRolePolicy(writeData);

  }
}
