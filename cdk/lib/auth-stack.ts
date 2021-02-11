import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import logs = require("@aws-cdk/aws-logs");
import * as fs from "fs";
import { StringAttribute } from "@aws-cdk/aws-cognito";
//import { CfnCondition, CfnParameter, Fn } from "@aws-cdk/core";

interface Props extends cdk.StackProps {
  datasetsBucketName: string;
  contentBucketName: string;
}

export class AuthStack extends cdk.Stack {
  public readonly userPoolArn: string;
  public readonly appClientId: string;
  public readonly userPoolId: string;
  public readonly identityPoolId: string;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    /**
     * CloudFormation parameters
     */
    const adminEmail = new cdk.CfnParameter(this, "adminEmail", {
      type: "String",
      description: "Email address for the admin user",
      minLength: 5,
    });

    const pool = new cognito.UserPool(this, "UserPool", {
      userInvitation: {
        emailSubject:
          "You have been invited to the {Organization} Performance Dashboard on AWS.",
        emailBody: fs.readFileSync("lib/data/email-template.html").toString(),
      },
      customAttributes: { roles: new StringAttribute({ mutable: true }) },
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
    const datasetsBucketArn = `arn:${stack.partition}:s3:::${props.datasetsBucketName}`;
    const contentBucketArn = `arn:${stack.partition}:s3:::${props.contentBucketName}`;

    const authenticatedRole = this.buildAuthRole(
      identityPool,
      datasetsBucketArn,
      contentBucketArn
    );

    const publicRole = this.buildPublicRole(
      identityPool,
      datasetsBucketArn,
      contentBucketArn
    );

    new cognito.CfnIdentityPoolRoleAttachment(this, "AuthRoleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
        unauthenticated: publicRole.roleArn,
      },
    });

    const adminUser = new cognito.CfnUserPoolUser(this, "AdminUser", {
      userPoolId: pool.userPoolId,
      username: adminEmail.valueAsString,
      userAttributes: [
        {
          name: "email",
          value: adminEmail.valueAsString,
        },
        {
          name: "custom:roles",
          value: JSON.stringify(["Admin"]),
        },
      ],
    });

    this.buildPreTokenGenerationTrigger(pool.userPoolId);

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
    new cdk.CfnOutput(this, "AdminUsername", { value: adminUser.ref });
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
    datasetsBucketArn: string,
    contentBucketArn: string
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
        resources: [
          datasetsBucketArn.concat("/public/*.json"),
          datasetsBucketArn.concat("/public/*.png"),
          datasetsBucketArn.concat("/public/*.jpg"),
          datasetsBucketArn.concat("/public/*.svg"),

          contentBucketArn.concat("/public/*.json"),
          contentBucketArn.concat("/public/*.png"),
          contentBucketArn.concat("/public/*.jpg"),
          contentBucketArn.concat("/public/*.svg"),
        ],
      })
    );

    return publicRole;
  }

  private buildAuthRole(
    identityPool: cognito.CfnIdentityPool,
    datasetsBucketArn: string,
    contentBucketArn: string
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
          datasetsBucketArn.concat("/public/*"),
          datasetsBucketArn.concat(
            "/protected/${cognito-identity.amazonaws.com:sub}/*"
          ),
          datasetsBucketArn.concat(
            "/private/${cognito-identity.amazonaws.com:sub}/*"
          ),

          contentBucketArn.concat("/public/*"),
          contentBucketArn.concat(
            "/protected/${cognito-identity.amazonaws.com:sub}/*"
          ),
          contentBucketArn.concat(
            "/private/${cognito-identity.amazonaws.com:sub}/*"
          ),
        ],
      })
    );

    authRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [
          datasetsBucketArn.concat("/uploads/*"),
          contentBucketArn.concat("/uploads/*"),
        ],
      })
    );

    authRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [
          datasetsBucketArn.concat("/protected/*"),
          contentBucketArn.concat("/protected/*"),
        ],
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

  private buildPreTokenGenerationTrigger(userPoolId: string) {
    const lambdaFunction = new lambda.Function(this, "PreTokenGeneration", {
      runtime: lambda.Runtime.NODEJS_12_X,
      description: "Allow for customization of the role of an identity token",
      code: lambda.Code.fromAsset("build/lib/auth/pretokengeneration"),
      handler: "index.handler",
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      reservedConcurrentExecutions: 25,
      logRetention: logs.RetentionDays.TEN_YEARS,
      environment: {
        USER_POOL_ID: userPoolId,
      },
    });

    lambdaFunction.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonCognitoReadOnly")
    );
  }
}
