import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";

interface Props extends cdk.StackProps {
  datasetsBucketName: string;
}

const emailHtml = `<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;">
</head>
<body width="100%" style="margin: 0; padding: 0 !important; background-color: #999; font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;">
  <div style="margin: 0 auto; max-width: 700px; background-color: #fff; "align="center">
    <div style="border: 1px solid; margin: 0 auto; max-width: 600px; " align="left">
      <div style="padding: 20; ">
          <table >
          <tr>
            <td width="50">
                <img align="left" style="border:none;border-radius:0px;display:block;outline:none;text-decoration:none;width:100%;height:auto;" alt="Your Logo" src="https://trietlu.badger.wwps.aws.dev/logo.png" />
            </td>
            <td style="padding: 5px; font-size:16px; font-weight:bold">
              <p align="left" style="Margin-top: 10px;Margin-bottom: 0;">Wakanda Performance Dashboard</p>
            </td>
          </tr>
        </table>
        <p style="Margin-top: 10px;Margin-bottom: 0;">&nbsp;</p>
        <h2
          style="margin-top: 20px; margin-bottom: 0;font-style: normal; color: #000;font-size: 28px;line-height: 32px;">You have been invited to the {Organization} Performance Dashboard on AWS</h2>
        <p style="Margin-top: 10px;Margin-bottom: 0;font-size: 16px;line-height: 24px; color: #000">{Administrator} has invited you. If you believe that you have gotten this invite in error, please disregard this message. If you are unsure of the message’s authenticity, please reach out to the person who invited you.</p>
        <p style="Margin-top: 10px;Margin-bottom: 0;font-size: 16px;line-height: 24px; color: #000">Your username is {username} and temporary password is "{####}".  You will have to change your password after you login.</p>
        <p style="Margin-top: 20px;Margin-bottom: 0;">&nbsp;</p>
        <div style="Margin-bottom: 20px;">
          <a
            style="border-radius: 4px;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px 13px 24px;text-decoration: none !important; text-align: center;color: #ffffff !important;background-color: #3b5998;"
            href="https://trietlu.badger.wwps.aws.dev/admin">Accept the invite</a>
        </div>
        <a style="font-size: 12px;line-height: 5px; color: #000;" href="https://trietlu.badger.wwps.aws.dev/admin">https://{your domain}.com/admin</a>
        <hr style="Margin-top: 30px;">
        <p style="font-size: 10px;line-height: 5px; color: #000; font-style: italic">Please do not reply to this message</p>
      </div>
    </div>
    <table style="font-size: 12px;line-height: 50px;" >
      <tr>
        <td>
          <a style="color: #000;" href="https://github.com/awslabs/performance-dashboard-on-aws">About Performance Dashboard</a>
        </td>
        <td>
          |
        </td>
        <td>
          <a style="color: #000;" href="">Privacy</a>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`

export class AuthStack extends cdk.Stack {
  public readonly userPoolArn: string;
  public readonly appClientId: string;
  public readonly userPoolId: string;
  public readonly identityPoolId: string;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const pool = new cognito.UserPool(this, "BadgerUserPool", {
      userInvitation: {
        emailSubject: 'You have been invited to the Performance Dashboard on AWS',
        emailBody: emailHtml,
      }
    });

    const client = pool.addClient("BadgerFrontend");
    const identityPool = this.buildIdentityPool(pool, client);

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
    return new cognito.CfnIdentityPool(this, "BadgerIdentityPool", {
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

    // The public role is assumed by unauthenticated identities in Badger. Which means,
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

    // The following policy gives Badger user's access to the datasets S3 bucket
    // to upload files. The permissions on this policy are taken from the Amplify docs:
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
