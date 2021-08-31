import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import * as fs from "fs";
import { StringAttribute } from "@aws-cdk/aws-cognito";

interface Props extends cdk.StackProps {
  datasetsBucketName: string;
  contentBucketName: string;
}

export class AuthParamsStack extends cdk.Stack {
  public readonly userPoolArn: string;
  public readonly appClientId: string;
  public readonly userPoolId: string;
  public readonly identityPoolId: string;
  public readonly authRegion: string;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    /**
     * CloudFormation parameters
     */
    const userPoolArnParam = new cdk.CfnParameter(this, "userPoolArn", {
      type: "String",
      description: "Email address for the admin user",
      minLength: 5,
    });

    const appClientIdParam = new cdk.CfnParameter(this, "appClientId", {
      type: "String",
      description: "Email address for the admin user",
      minLength: 5,
    });

    const userPoolIdParam = new cdk.CfnParameter(this, "userPoolId", {
      type: "String",
      description: "Email address for the admin user",
      minLength: 5,
    });

    const identityPoolIdParam = new cdk.CfnParameter(this, "identityPoolId", {
      type: "String",
      description: "Email address for the admin user",
      minLength: 5,
    });

    const authRegionParam = new cdk.CfnParameter(this, "authRegion", {
      type: "String",
      description: "Email address for the admin user",
      minLength: 5,
    });

    /**
     * Outputs
     */
    this.userPoolArn = userPoolArnParam.valueAsString;
    this.appClientId = appClientIdParam.valueAsString;
    this.userPoolId = userPoolIdParam.valueAsString;
    this.identityPoolId = identityPoolIdParam.valueAsString;
    this.authRegion = authRegionParam.valueAsString;

    new cdk.CfnOutput(this, "UserPoolArn", { value: this.userPoolArn });
    new cdk.CfnOutput(this, "AppClientId", { value: this.appClientId });
    new cdk.CfnOutput(this, "UserPoolId", { value: this.userPoolId });
    new cdk.CfnOutput(this, "IdentityPoolId", { value: this.identityPoolId });
    new cdk.CfnOutput(this, "AuthRegion", { value: this.authRegion });
  }
}
