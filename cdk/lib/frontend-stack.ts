/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import * as cdk from "@aws-cdk/core";
import s3 = require("@aws-cdk/aws-s3");
import s3Deploy = require("@aws-cdk/aws-s3-deployment");
import cloudFront = require("@aws-cdk/aws-cloudfront");
import customResource = require("@aws-cdk/custom-resources");
import lambda = require("@aws-cdk/aws-lambda");
import iam = require("@aws-cdk/aws-iam");
import logs = require("@aws-cdk/aws-logs");
import { HttpHeaders } from "@cloudcomponents/cdk-lambda-at-edge-pattern";
import { ObjectOwnership } from "@aws-cdk/aws-s3";

interface Props extends cdk.StackProps {
  datasetsBucket: string;
  contentBucket: string;
  userPoolId: string;
  identityPoolId: string;
  appClientId: string;
  backendApiUrl: string;
  authenticationRequired: boolean;
  adminEmail: string;
}

export class FrontendStack extends cdk.Stack {
  private readonly frontendBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    /**
     * S3 Bucket
     * Hosts the React application code.
     */
    this.frontendBucket = new s3.Bucket(this, "ReactApp", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      encryption: s3.BucketEncryption.S3_MANAGED,
      serverAccessLogsPrefix: "access_logs/",
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
    });

    const httpHeaders = new HttpHeaders(this, "HttpHeaders", {
      httpHeaders: {
        "Content-Security-Policy":
          "default-src 'self'; img-src 'self' https://*.google-analytics.com blob:; style-src 'unsafe-inline' 'self'; connect-src 'self' https://*.amazoncognito.com https://*.amazonaws.com https://*.google-analytics.com; script-src 'self' https://*.google-analytics.com; block-all-mixed-content;",
        "Strict-Transport-Security": "max-age=31540000; includeSubdomains",
        "X-XSS-Protection": "1; mode=block",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });

    /**
     * CloudFront Distribution
     * Fronts the S3 bucket as CDN to provide caching and HTTPS.
     */
    const originAccess = new cloudFront.OriginAccessIdentity(
      this,
      "CloudFrontOriginAccess"
    );
    this.frontendBucket.grantRead(originAccess);

    const distribution = new cloudFront.CloudFrontWebDistribution(
      this,
      "CloudFrontDistribution",
      {
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],
        originConfigs: [
          {
            behaviors: [
              {
                isDefaultBehavior: true,
                lambdaFunctionAssociations: [httpHeaders],
              },
            ],
            s3OriginSource: {
              s3BucketSource: this.frontendBucket,
              originAccessIdentity: originAccess,
            },
          },
        ],
      }
    );
    let cfnDist: cloudFront.CfnDistribution = distribution.node
      .defaultChild as cloudFront.CfnDistribution;
    cfnDist.cfnOptions.metadata = {
      cfn_nag: {
        rules_to_suppress: [
          {
            id: "W10",
            reason:
              "CloudFront Distribution is disabled as there are no user requirements, plus to keep the cost low",
          },
          {
            id: "W70",
            reason:
              "If the distribution uses the CloudFront domain name such as d111111abcdef8.cloudfront.net (you set CloudFrontDefaultCertificate to true), CloudFront automatically sets the security policy to TLSv1 regardless of the value that you set here.",
          },
        ],
      },
    };

    /**
     * S3 Deploy
     * Uploads react built code to the S3 bucket and invalidates CloudFront
     */
    const frontendDeploy = new s3Deploy.BucketDeployment(
      this,
      "Deploy-Frontend",
      {
        sources: [s3Deploy.Source.asset("../frontend/build")],
        destinationBucket: this.frontendBucket,
        memoryLimit: 2048,
        prune: false,
        distribution,
      }
    );

    const deployConfig = this.deployEnvironmentConfig(props);
    // Make sure env.js gets deployed after the React code so
    // it doesn't get overwritten.
    deployConfig.node.addDependency(frontendDeploy);

    /**
     * Stack Outputs
     */
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, "ReactAppBucketName", {
      value: this.frontendBucket.bucketName,
    });
  }

  private deployEnvironmentConfig(props: Props): cdk.CustomResource {
    // This CustomResource is a Lambda function that generates the `env.js`
    // with environment values. This file is uploaded to the bucket where
    // the React code is deployed.

    const lambdaFunction = new lambda.Function(this, "EnvConfig", {
      runtime: lambda.Runtime.NODEJS_16_X,
      description: "Deploys env.js file on S3 with environment configuration",
      code: lambda.Code.fromAsset("build/lib/envconfig"),
      handler: "index.handler",
      timeout: cdk.Duration.seconds(60),
      memorySize: 128,
      logRetention: logs.RetentionDays.TEN_YEARS,
      reservedConcurrentExecutions: 1,
      environment: {
        FRONTEND_BUCKET: this.frontendBucket.bucketName,
        REGION: cdk.Stack.of(this).region,
        BACKEND_API: props.backendApiUrl,
        USER_POOL_ID: props.userPoolId,
        APP_CLIENT_ID: props.appClientId,
        DATASETS_BUCKET: props.datasetsBucket,
        CONTENT_BUCKET: props.contentBucket,
        IDENTITY_POOL_ID: props.identityPoolId,
        CONTACT_EMAIL: props.adminEmail,
        BRAND_NAME: "Performance Dashboard",
        TOPIC_AREA_LABEL: "Topic area",
        TOPIC_AREAS_LABEL: "Topic areas",
        FRONTEND_DOMAIN: "",
        COGNITO_DOMAIN: "",
        SAML_PROVIDER: "",
        ENTERPRISE_LOGIN_LABEL: "Enterprise Sign-In",
        AUTHENTICATION_REQUIRED: props.authenticationRequired.toString(),
      },
    });

    lambdaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [this.frontendBucket.arnForObjects("*")],
        actions: ["s3:PutObject"],
      })
    );

    const provider = new customResource.Provider(this, "EnvConfigProvider", {
      onEventHandler: lambdaFunction,
    });

    return new cdk.CustomResource(this, "EnvConfigDeployment", {
      serviceToken: provider.serviceToken,
    });
  }
}
