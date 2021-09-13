import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import s3Deploy = require("@aws-cdk/aws-s3-deployment");
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as s3 from "@aws-cdk/aws-s3";
import { BackendApi } from "./constructs/api";
import { Database } from "./constructs/database";
import { ExampleDashboardLambda } from "./constructs/exampledashboardlambda";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";
import customResource = require("@aws-cdk/custom-resources");

interface DashboardExamplesProps extends cdk.StackProps {
  datasetsBucketName: string;
  datasetsBucketArn: string;
  databaseTableName: string;
  databaseTableArn: string;
  adminEmail: string;
}

export class DashboardExamplesStack extends cdk.Stack {
  public readonly exampleSetupLambda: lambda.Function;
  public readonly exampleBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props: DashboardExamplesProps) {
    super(scope, id, props);

    const exampleLanguage = new cdk.CfnParameter(this, "exampleLanguage", {
      type: "String",
      description: "Language for example dashboards",
      minLength: 5,
      default: "english"
    });

    const exampleBucket = new s3.Bucket(this, "ExampleBucket", {
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: false
    });


    const lambdas = new ExampleDashboardLambda(this, "SetupExampleDashboardLambda", {
      exampleBucketArn: exampleBucket.bucketArn,
      exampleBucketName: exampleBucket.bucketName,
      datasetBucketArn: props.datasetsBucketArn,
      datasetBucketName: props.datasetsBucketName,
      databaseTableName: props.databaseTableName,
      databaseTableArn: props.databaseTableArn,
      adminEmail: props.adminEmail,
      language:exampleLanguage.valueAsString
    });

    /**
     * S3 Deploy
     * Uploads react built code to the S3 bucket and invalidates CloudFront
     */
   const examplesDeploy = new s3Deploy.BucketDeployment(
      this,
      "Deploy-Examples",
      {
        sources: [s3Deploy.Source.asset("../examples/examplefiles/")],
        destinationBucket: exampleBucket,
        memoryLimit: 4096,
        prune: false
      }
    );
 


    /**
     * Outputs
     */
    this.exampleSetupLambda = lambdas.exampleSetupLambda;
    this.exampleBucket = exampleBucket;

    
    const provider = new customResource.Provider(this, "ExampleProvider", {
      onEventHandler: lambdas.exampleSetupLambda,
    });

    const resource =  new cdk.CustomResource(this, "ExampleDeployment", {
      serviceToken: provider.serviceToken,
    });

    resource.node.addDependency(examplesDeploy);
  }
}
