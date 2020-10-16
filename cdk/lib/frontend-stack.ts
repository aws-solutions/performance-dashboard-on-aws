import * as cdk from "@aws-cdk/core";
import s3 = require("@aws-cdk/aws-s3");
import s3Deploy = require("@aws-cdk/aws-s3-deployment");
import cloudFront = require("@aws-cdk/aws-cloudfront");
import customResource = require("@aws-cdk/custom-resources");
import lambda = require("@aws-cdk/aws-lambda");
import iam = require("@aws-cdk/aws-iam");
import { HttpHeaders } from "@cloudcomponents/cdk-lambda-at-edge-pattern";

interface Props extends cdk.StackProps {
  datasetsBucket: string;
  userPoolId: string;
  identityPoolId: string;
  appClientId: string;
  badgerApiUrl: string;
}

export class FrontendStack extends cdk.Stack {
  private readonly frontendBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    /**
     * S3 Bucket
     * Hosts the React application code.
     */
    this.frontendBucket = new s3.Bucket(this, "ReactAppBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const httpHeaders = new HttpHeaders(this, "HttpHeaders", {
      httpHeaders: {
        "Content-Security-Policy":
          "default-src 'self'; style-src 'unsafe-inline' 'self'; connect-src 'self' https://*.amazonaws.com; block-all-mixed-content;",
        "Strict-Transport-Security": "max-age=31540000; includeSubdomains",
        "X-XSS-Protection": "1; mode=block",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff"
      }
    });

    /**
     * CloudFront Distribution
     * Fronts the S3 bucket as CDN to provide caching and HTTPS.
     */
    const originAccess = new cloudFront.OriginAccessIdentity(
      this,
      "CloudFrontOriginAccess"
    );
    const distribution = new cloudFront.CloudFrontWebDistribution(
      this,
      "CloudFrontDistribution",
      {
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html"
          }
        ],
        originConfigs: [
          {
            behaviors: [
              {
                isDefaultBehavior: true,
                lambdaFunctionAssociations: [httpHeaders]
              }
            ],
            s3OriginSource: {
              s3BucketSource: this.frontendBucket,
              originAccessIdentity: originAccess
            }
          }
        ]
      }
    );

    /**
     * S3 Deploy
     * Uploads react built code to the S3 bucket and invalidates CloudFront
     */
<<<<<<< HEAD
    const frontendDeploy = new s3Deploy.BucketDeployment(
      this,
      "DeployWithInvalidation",
      {
        sources: [s3Deploy.Source.asset("../frontend/build")],
        destinationBucket: this.frontendBucket,
        prune: false,
        distribution,
      }
    );

    const deployConfig = this.deployEnvironmentConfig(props);
    // Make sure env.js gets deployed after the React code so
    // it doesn't get overwritten.
    deployConfig.node.addDependency(frontendDeploy);
=======
    new s3Deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3Deploy.Source.asset("../frontend/build")],
      destinationBucket: this.frontendBucket,
      distribution
    });
>>>>>>> enable security http headers in responses of API and web site requests

    /**
     * Stack Outputs
     */
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: distribution.distributionDomainName
    });
    new cdk.CfnOutput(this, "ReactAppBucketName", {
      value: this.frontendBucket.bucketName
    });
  }

  private deployEnvironmentConfig(props: Props): cdk.CustomResource {
    // This CustomResource is a Lambda function that generates the `env.js`
    // with environment values. This file is uploaded to the bucket where
    // the React code is deployed.

    const lambdaFunction = new lambda.Function(this, "EnvConfigLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("build/lib/envconfig"),
      handler: "index.handler",
      timeout: cdk.Duration.seconds(60),
      memorySize: 128,
      environment: {
        FRONTEND_BUCKET: this.frontendBucket.bucketName,
        REGION: cdk.Stack.of(this).region,
        BADGER_API: props.badgerApiUrl,
        USER_POOL_ID: props.userPoolId,
        APP_CLIENT_ID: props.appClientId,
        DATASETS_BUCKET: props.datasetsBucket,
        IDENTITY_POOL_ID: props.identityPoolId
      }
    });

    lambdaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [this.frontendBucket.arnForObjects("*")],
        actions: ["s3:PutObject"]
      })
    );

    const provider = new customResource.Provider(this, "EnvConfigProvider", {
      onEventHandler: lambdaFunction
    });

    new cdk.CustomResource(this, "EnvConfigDeployment", {
      serviceToken: provider.serviceToken
    });
  }
}
