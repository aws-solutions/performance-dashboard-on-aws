import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import * as fs from "fs";
import { StringAttribute } from "@aws-cdk/aws-cognito";

interface Props extends cdk.StackProps {
  datasetsBucketName: string;
  contentBucketName: string;
}

/**
 * Why does this class exist?
 * This is here to facility deploying auth (Cognito) to one region and the rest of the app to another.
 * This is because Cognito does not exist in all regions. In setup 1 we need to deploy auth to one region and
 * take the output of the deploy and feed certain values to rest of the stack. We take all of the needed values here and "deploy" a stack and then feed
 * the rest of the values to the other stacks. The reason for not using optional parameters in the other stacks is there is a bug in the plugin used for
 * generating http parameters which makes passing parameters into that stack broken. Cnf imports cant be used because of the cross region requirement.
 * This was the simpliest way to get the values in and change a little as possible.
 */
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
