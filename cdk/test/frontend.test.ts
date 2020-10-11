import "@aws-cdk/assert/jest";
import * as cdk from "@aws-cdk/core";
import { FrontendStack } from "../lib/frontend-stack";

jest.mock("@aws-cdk/aws-s3-deployment");
const s3Deploy = require("@aws-cdk/aws-s3-deployment");

describe("Frontend stack", () => {
  let stack: FrontendStack;
  beforeAll(() => {
    const app = new cdk.App();
    s3Deploy.Source = { asset: jest.fn() };
    stack = new FrontendStack(app, "MyFrontendStack", {
      datasetsBucket: "datasets-bucket",
      userPoolId: "123456789",
      identityPoolId: "abcdefghijk",
      appClientId: "0987654321",
      badgerApiUrl: "https://123.api.amazonaws.com/prod",
    });
  });

  test("has an S3 Bucket", () => {
    expect(stack).toHaveResource("AWS::S3::Bucket");
  });

  test("has a CloudFront distribution", () => {
    expect(stack).toHaveResource("AWS::CloudFront::Distribution");
  });

  test("exports CloudFront URL", () => {
    expect(stack).toHaveOutput({
      outputName: "CloudFrontURL",
    });
  });
});
