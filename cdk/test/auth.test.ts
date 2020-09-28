import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import { AuthStack } from '../lib/auth-stack';

describe('Auth stack', () => {

  let stack:AuthStack;
  beforeAll(() => {
    const app = new cdk.App();
    stack = new AuthStack(app, 'MyAuthStack', {
      datasetsBucketName: "badger-123-datasets"
    });
  });

  test('has a UserPool', () => {
      expect(stack).toHaveResource('AWS::Cognito::UserPool');
  });

  test('exports app client id', () => {
    expect(stack).toHaveOutput({
      outputName: 'AppClientId'
    });
  });
});
