/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import {
    StringAttribute,
    UserPool,
    CfnIdentityPoolRoleAttachment,
    CfnUserPoolUser,
    UserPoolClient,
    CfnIdentityPool,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { CfnParameter, Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { readFileSync } from "fs";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";

interface Props extends StackProps {
    datasetsBucketName: string;
    contentBucketName: string;
}

export class AuthStack extends Stack {
    public readonly userPoolArn: string;
    public readonly appClientId: string;
    public readonly userPoolId: string;
    public readonly identityPoolId: string;
    public readonly adminEmail: string;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        /**
         * CloudFormation parameters
         */
        const adminEmail = new CfnParameter(this, "adminEmail", {
            type: "String",
            description: "Email address for the admin user",
            minLength: 5,
        });
        const pool = new UserPool(this, "UserPool", {
            userInvitation: {
                emailSubject:
                    "You have been invited to the {Organization} Performance Dashboard on AWS.",
                emailBody: readFileSync("lib/data/email-template.html").toString(),
            },
            customAttributes: { roles: new StringAttribute({ mutable: true }) },
        });

        const client = pool.addClient("Frontend", {
            preventUserExistenceErrors: true,
        });
        const identityPool = this.buildIdentityPool(pool, client);

        identityPool.cfnOptions.metadata = {
            cfn_nag: {
                rules_to_suppress: [
                    {
                        id: "W57",
                        reason: "Use case allows unauthenticated users to access S3 objects",
                    },
                ],
            },
        };

        const stack = Stack.of(this);
        const datasetsBucketArn = `arn:${stack.partition}:s3:::${props.datasetsBucketName}`;
        const contentBucketArn = `arn:${stack.partition}:s3:::${props.contentBucketName}`;

        const authenticatedRole = this.buildAuthRole(
            identityPool,
            datasetsBucketArn,
            contentBucketArn,
        );

        const publicRole = this.buildPublicRole(identityPool, datasetsBucketArn, contentBucketArn);

        new CfnIdentityPoolRoleAttachment(this, "AuthRoleAttachment", {
            identityPoolId: identityPool.ref,
            roles: {
                authenticated: authenticatedRole.roleArn,
                unauthenticated: publicRole.roleArn,
            },
        });

        const adminUser = new CfnUserPoolUser(this, "AdminUser", {
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

        /**
         * Outputs
         */
        this.userPoolArn = pool.userPoolArn;
        this.appClientId = client.userPoolClientId;
        this.userPoolId = pool.userPoolId;
        this.adminEmail = adminEmail.valueAsString;
        this.identityPoolId = identityPool.ref;

        new CfnOutput(this, "UserPoolArn", { value: this.userPoolArn });
        new CfnOutput(this, "AppClientId", { value: this.appClientId });
        new CfnOutput(this, "UserPoolId", { value: this.userPoolId });
        new CfnOutput(this, "AdminUsername", { value: adminUser.ref });
        new CfnOutput(this, "IdentityPoolId", {
            value: identityPool.ref,
        });
    }

    private buildIdentityPool(userPool: UserPool, client: UserPoolClient) {
        return new CfnIdentityPool(this, "IdentityPool", {
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
        identityPool: CfnIdentityPool,
        datasetsBucketArn: string,
        contentBucketArn: string,
    ): Role {
        const publicRole = this.buildIdentityPoolRole(
            "CognitoPublicRole",
            "unauthenticated",
            identityPool,
        );

        // The public role is assumed by unauthenticated identities. Which means,
        // any user that lands on the public-facing website that does not have a login.
        // Need to be careful with what permissions you give to this role. It should be as
        // restricted as possible.

        publicRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
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
            }),
        );

        return publicRole;
    }

    private buildAuthRole(
        identityPool: CfnIdentityPool,
        datasetsBucketArn: string,
        contentBucketArn: string,
    ): Role {
        const authRole = this.buildIdentityPoolRole(
            "CognitoAuthRole",
            "authenticated",
            identityPool,
        );

        // The following policy gives user's access to the datasets S3 bucket to upload
        // files. The permissions on this policy are taken from the Amplify docs:
        // https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-amazon-s3

        authRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:GetObject", "s3:PutObject"],
                resources: [
                    datasetsBucketArn.concat("/public/*"),
                    datasetsBucketArn.concat("/protected/${cognito-identity.amazonaws.com:sub}/*"),
                    datasetsBucketArn.concat("/private/${cognito-identity.amazonaws.com:sub}/*"),

                    contentBucketArn.concat("/public/*"),
                    contentBucketArn.concat("/protected/${cognito-identity.amazonaws.com:sub}/*"),
                    contentBucketArn.concat("/private/${cognito-identity.amazonaws.com:sub}/*"),
                ],
            }),
        );

        authRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:DeleteObject"],
                resources: [
                    contentBucketArn.concat("/public/logo/*"),
                    contentBucketArn.concat("/public/favicon/*"),
                ],
            }),
        );

        authRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:PutObject"],
                resources: [
                    datasetsBucketArn.concat("/uploads/*"),
                    contentBucketArn.concat("/uploads/*"),
                ],
            }),
        );

        authRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:GetObject"],
                resources: [
                    datasetsBucketArn.concat("/protected/*"),
                    contentBucketArn.concat("/protected/*"),
                ],
            }),
        );

        return authRole;
    }

    private buildIdentityPoolRole(
        name: string,
        type: "authenticated" | "unauthenticated",
        identityPool: CfnIdentityPool,
    ): Role {
        return new Role(this, name, {
            assumedBy: new FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    StringEquals: {
                        "cognito-identity.amazonaws.com:aud": identityPool.ref,
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": type,
                    },
                },
                "sts:AssumeRoleWithWebIdentity",
            ),
        });
    }
}
