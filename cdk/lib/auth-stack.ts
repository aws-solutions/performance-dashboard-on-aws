import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";

interface Props extends cdk.StackProps {
  datasetsBucketName: string;
}

export class AuthStack extends cdk.Stack {
  public readonly userPoolArn: string;
  public readonly appClientId: string;
  public readonly userPoolId: string;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const pool = new cognito.UserPool(this, "BadgerUserPool");
    const client = pool.addClient("BadgerFrontend");
    const identityPool = new cognito.CfnIdentityPool(
      this,
      "BadgerIdentityPool",
      {
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            clientId: client.userPoolClientId,
            providerName: pool.userPoolProviderName,
            serverSideTokenCheck: true,
          },
        ],
      }
    );

    const authenticatedRole = new iam.Role(this, "CognitoAuthRole", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    new cognito.CfnIdentityPoolRoleAttachment(this, "AuthRoleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
      },
    });

    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cognito-sync:*",
          "cognito-identity:*",
        ],
        resources: ["*"],
      })
    );

    // The following policy gives Badger user's access to the datasets S3 bucket
    // to upload files. The permissions on this policy are taken from the Amplify docs:
    // https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-amazon-s3

    const stack = cdk.Stack.of(this);
    const bucketArn = `arn:${stack.partition}:s3:::${props.datasetsBucketName}`;
    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "s3:GetObject",
          "s3:PutObject",
        ],
        resources: [
          bucketArn.concat("/public/*"),
          bucketArn.concat("/protected/${cognito-identity.amazonaws.com:sub}/*"),
          bucketArn.concat("/private/${cognito-identity.amazonaws.com:sub}/*"),
        ]
      })
    );

    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "s3:PutObject",
        ],
        resources: [
          bucketArn.concat("/uploads/*"),
        ]
      })
    );

    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "s3:GetObject",
        ],
        resources: [
          bucketArn.concat("/protected/*"),
        ]
      })
    );

    

    /**
     * Outputs
     */
    this.userPoolArn = pool.userPoolArn;
    this.appClientId = client.userPoolClientId;
    this.userPoolId = pool.userPoolId;

    new cdk.CfnOutput(this, "UserPoolArn", { value: this.userPoolArn });
    new cdk.CfnOutput(this, "AppClientId", { value: this.appClientId });
    new cdk.CfnOutput(this, "UserPoolId", { value: this.userPoolId });
    new cdk.CfnOutput(this, "IdentityPoolId", {
      value: identityPool.ref,
    });
  }
}
