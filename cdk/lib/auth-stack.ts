import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import * as fs from "fs";

interface Props extends cdk.StackProps {
  datasetsBucketName: string;
}

export class AuthStack extends cdk.Stack {
  public readonly userPoolArn: string;
  public readonly appClientId: string;
  public readonly userPoolId: string;
  public readonly identityPoolId: string;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const pool = new cognito.UserPool(this, "UserPool", {
      userInvitation: {
        emailSubject:
          "You have been invited to the {Organization} Performance Dashboard on AWS.",
        emailBody: fs.readFileSync("lib/data/email-template.html").toString(),
      },
    });

    const client = pool.addClient("Frontend", {
      preventUserExistenceErrors: true,
    });
    const identityPool = this.buildIdentityPool(pool, client);

    const cliClient = pool.addClient("CLI", {
      authFlows: { userPassword: true },
      preventUserExistenceErrors: true,
    });

    const stack = cdk.Stack.of(this);
    const bucketArn = `arn:${stack.partition}:s3:::${props.datasetsBucketName}`;

    const authenticatedRole = this.buildAuthRole(identityPool, bucketArn);
    const publicRole = this.buildPublicRole(identityPool, bucketArn);

    new cognito.CfnIdentityPoolRoleAttachment(this, "AuthRoleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
        unauthenticated: publicRole.roleArn,
      },
    });

    /**
     * Outputs
     */
    this.userPoolArn = pool.userPoolArn;
    this.appClientId = client.userPoolClientId;
    this.userPoolId = pool.userPoolId;
    this.identityPoolId = identityPool.ref;

    new cdk.CfnOutput(this, "UserPoolArn", { value: this.userPoolArn });
    new cdk.CfnOutput(this, "AppClientId", { value: this.appClientId });
    new cdk.CfnOutput(this, "UserPoolId", { value: this.userPoolId });
    new cdk.CfnOutput(this, "IdentityPoolId", {
      value: identityPool.ref,
    });
  }

  private buildIdentityPool(
    userPool: cognito.UserPool,
    client: cognito.UserPoolClient
  ) {
    return new cognito.CfnIdentityPool(this, "IdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: client.userPoolClientId,
          providerName: userPool.userPoolProviderName,
          serverSideTokenCheck: true,
        },
      ],
    });
  }

  private buildPublicRole(
    identityPool: cognito.CfnIdentityPool,
    bucketArn: string
  ): iam.Role {
    const publicRole = this.buildIdentityPoolRole(
      "CognitoPublicRole",
      "unauthenticated",
      identityPool
    );

    // The public role is assumed by unauthenticated identities. Which means,
    // any user that lands on the public-facing website that does not have a login.
    // Need to be careful with what permissions you give to this role. It should be as
    // restricted as possible.

    publicRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [bucketArn.concat("/public/*.json")],
      })
    );

    return publicRole;
  }

  private buildAuthRole(
    identityPool: cognito.CfnIdentityPool,
    bucketArn: string
  ): iam.Role {
    const authRole = this.buildIdentityPoolRole(
      "CognitoAuthRole",
      "authenticated",
      identityPool
    );

    // The following policy gives user's access to the datasets S3 bucket to upload
    // files. The permissions on this policy are taken from the Amplify docs:
    // https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-amazon-s3

    authRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject", "s3:PutObject"],
        resources: [
          bucketArn.concat("/public/*"),
          bucketArn.concat(
            "/protected/${cognito-identity.amazonaws.com:sub}/*"
          ),
          bucketArn.concat("/private/${cognito-identity.amazonaws.com:sub}/*"),
        ],
      })
    );

    authRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [bucketArn.concat("/uploads/*")],
      })
    );

    authRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [bucketArn.concat("/protected/*")],
      })
    );

    authRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["cognito-sync:*", "cognito-identity:*"],
        resources: ["*"],
      })
    );

    return authRole;
  }

  private buildIdentityPoolRole(
    name: string,
    type: "authenticated" | "unauthenticated",
    identityPool: cognito.CfnIdentityPool
  ): iam.Role {
    return new iam.Role(this, name, {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": type,
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
  }
}
