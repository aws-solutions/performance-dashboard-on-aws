import * as cdk from '@aws-cdk/core';
import s3 = require('@aws-cdk/aws-s3');
import s3Deploy = require('@aws-cdk/aws-s3-deployment');
import cloudFront = require('@aws-cdk/aws-cloudfront');

export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * S3 Bucket
     * Hosts the React application code.
     */
    const siteBucket = new s3.Bucket(this, 'ReactAppBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /**
     * CloudFront Distribution
     * Fronts the S3 bucket as CDN to provide caching and HTTPS.
     */
    const originAccess = new cloudFront.OriginAccessIdentity(this, 'CloudFrontOriginAccess');
    const distribution = new cloudFront.CloudFrontWebDistribution(this, 'CloudFrontDistribution', {
      errorConfigurations: [{
        errorCode: 404,
        responseCode: 200,
        responsePagePath: '/index.html',
      }],
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          s3OriginSource: {
            s3BucketSource: siteBucket,
            originAccessIdentity: originAccess,
          },
        },
      ],
    });

    /**
     * S3 Deploy
     * Uploads react built code to the S3 bucket and invalidates CloudFront
     */
    new s3Deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3Deploy.Source.asset('../frontend/build')],
      destinationBucket: siteBucket,
      distribution,
    });

    /**
     * Stack Outputs
     */
    new cdk.CfnOutput(this, 'CloudFrontURL', { value: distribution.domainName });
    new cdk.CfnOutput(this, 'ReactAppBucketName', { value: siteBucket.bucketName });
  }
}
