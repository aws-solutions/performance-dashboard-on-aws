import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as Cdk from '../lib/frontend-stack';

jest.mock('@aws-cdk/aws-s3-deployment');
const s3Deploy = require('@aws-cdk/aws-s3-deployment');

describe('Frontend stack', () => {

  let stack:Cdk.FrontendStack;
  beforeAll(() => {
    const app = new cdk.App();
    s3Deploy.Source = { asset: jest.fn() };
    stack = new Cdk.FrontendStack(app, 'MyFrontendStack');
  });

  test('has an S3 Bucket', () => {
      expect(stack).toHaveResource('AWS::S3::Bucket');
  });

  test('has a CloudFront distribution', () => {
    expect(stack).toHaveResource('AWS::CloudFront::Distribution');
  });

  test('exports CloudFront URL', () => {
    expect(stack).toHaveOutput({
      outputName: 'CloudFrontURL'
    });
  });
});
