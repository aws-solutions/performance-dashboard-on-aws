/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { UserPool, CfnUserPoolUser, CfnIdentityPoolRoleAttachment } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { Stack, StackProps, CfnOutput, CfnCondition, Fn } from "aws-cdk-lib";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { adminEmailParameter, authenticationRequiredParameter } from "./constructs/parameters";

interface Props extends StackProps {
    datasetsBucketName: string;
    contentBucketName: string;
    userPoolArn: string;
    appClientId: string;
    identityPoolId: string;
}

export class AuthorizationStack extends Stack {
    public readonly adminEmail: string;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const authenticationRequired = authenticationRequiredParameter(this);
        const adminEmail = adminEmailParameter(this);

        const pool = UserPool.fromUserPoolArn(this, "UserPool", props.userPoolArn);

        const stack = Stack.of(this);
        const datasetsBucketArn = `arn:${stack.partition}:s3:::${props.datasetsBucketName}`;
        const contentBucketArn = `arn:${stack.partition}:s3:::${props.contentBucketName}`;

        const adminRole = this.buildIdentityPoolRole(
            "CognitoAdminRole",
            true,
            props.identityPoolId,
        );
        this.addAdminPolicies(adminRole, datasetsBucketArn, contentBucketArn);

        const editorRole = this.buildIdentityPoolRole(
            "CognitoEditorRole",
            true,
            props.identityPoolId,
        );
        this.addEditorPolicies(editorRole, datasetsBucketArn, contentBucketArn);

        const protectedRole = this.buildIdentityPoolRole(
            "CognitoProtectedRole",
            true,
            props.identityPoolId,
        );
        this.addProtectedPolicies(protectedRole, datasetsBucketArn, contentBucketArn);

        const publicRole = this.buildIdentityPoolRole(
            "CognitoPublicRole",
            false,
            props.identityPoolId,
        );
        this.addPublicPolicies(publicRole, datasetsBucketArn, contentBucketArn);

        const denyRole = this.buildIdentityPoolRole("CognitoDenyRole", false, props.identityPoolId);

        new CfnCondition(this, "AuthenticationRequiredCond", {
            expression: Fn.conditionEquals(authenticationRequired, "yes"),
        });

        const unauthenticatedRole = Fn.conditionIf(
            "AuthenticationRequiredCond",
            denyRole.roleArn,
            publicRole.roleArn,
        );

        const providerUrl = `cognito-idp.${stack.region}.amazonaws.com/${pool.userPoolId}:${props.appClientId}`;
        new CfnIdentityPoolRoleAttachment(this, "AuthRoleAttachment", {
            identityPoolId: props.identityPoolId,
            roles: {
                authenticated: protectedRole.roleArn,
                unauthenticated: unauthenticatedRole,
            },
            roleMappings: {
                cognito: {
                    ambiguousRoleResolution: "AuthenticatedRole",
                    type: "Rules",
                    identityProvider: providerUrl,
                    rulesConfiguration: {
                        rules: [
                            {
                                claim: "custom:roles",
                                matchType: "Contains",
                                value: "Admin",
                                roleArn: adminRole.roleArn,
                            },
                            {
                                claim: "custom:roles",
                                matchType: "Contains",
                                value: "Editor",
                                roleArn: editorRole.roleArn,
                            },
                            {
                                claim: "custom:roles",
                                matchType: "Contains",
                                value: "Public",
                                roleArn: protectedRole.roleArn,
                            },
                            {
                                claim: "custom:groups",
                                matchType: "Contains",
                                value: "Admin",
                                roleArn: adminRole.roleArn,
                            },
                            {
                                claim: "custom:groups",
                                matchType: "Contains",
                                value: "Editor",
                                roleArn: editorRole.roleArn,
                            },
                            {
                                claim: "custom:groups",
                                matchType: "Contains",
                                value: "Public",
                                roleArn: protectedRole.roleArn,
                            },
                        ],
                    },
                },
            },
        });

        const adminUser = new CfnUserPoolUser(this, "AdminUser", {
            userPoolId: pool.userPoolId,
            username: Fn.select(0, Fn.split("@", adminEmail.valueAsString)),
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
        this.adminEmail = adminEmail.valueAsString;

        new CfnOutput(this, "AdminUsername", { value: adminUser.ref });
    }

    private addAdminPolicies(adminRole: Role, datasetsBucketArn: string, contentBucketArn: string) {
        // The following policy gives user's access to the datasets S3 bucket to upload
        // files. The permissions on this policy are taken from the Amplify docs:
        // https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-amazon-s3

        adminRole.addToPolicy(
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

        adminRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:DeleteObject"],
                resources: [
                    contentBucketArn.concat("/public/logo/*"),
                    contentBucketArn.concat("/public/favicon/*"),
                ],
            }),
        );

        adminRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:PutObject"],
                resources: [
                    datasetsBucketArn.concat("/uploads/*"),
                    contentBucketArn.concat("/uploads/*"),
                ],
            }),
        );

        adminRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:GetObject"],
                resources: [
                    datasetsBucketArn.concat("/protected/*"),
                    contentBucketArn.concat("/protected/*"),
                ],
            }),
        );

        this.addPublicPolicies(adminRole, datasetsBucketArn, contentBucketArn);
    }

    private addEditorPolicies(
        editorRole: Role,
        datasetsBucketArn: string,
        contentBucketArn: string,
    ) {
        // The following policy gives user's access to the datasets S3 bucket to upload
        // files. The permissions on this policy are taken from the Amplify docs:
        // https://docs.amplify.aws/lib/storage/getting-started/q/platform/js#using-amazon-s3

        editorRole.addToPolicy(
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

        editorRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:PutObject"],
                resources: [
                    datasetsBucketArn.concat("/uploads/*"),
                    contentBucketArn.concat("/uploads/*"),
                ],
            }),
        );

        editorRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:GetObject"],
                resources: [
                    datasetsBucketArn.concat("/protected/*"),
                    contentBucketArn.concat("/protected/*"),
                ],
            }),
        );

        this.addPublicPolicies(editorRole, datasetsBucketArn, contentBucketArn);
    }

    private addProtectedPolicies(
        protectedRole: Role,
        datasetsBucketArn: string,
        contentBucketArn: string,
    ) {
        protectedRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:GetObject", "s3:PutObject"],
                resources: [
                    datasetsBucketArn.concat("/protected/${cognito-identity.amazonaws.com:sub}/*"),
                    datasetsBucketArn.concat("/private/${cognito-identity.amazonaws.com:sub}/*"),

                    contentBucketArn.concat("/protected/${cognito-identity.amazonaws.com:sub}/*"),
                    contentBucketArn.concat("/private/${cognito-identity.amazonaws.com:sub}/*"),
                ],
            }),
        );

        protectedRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:GetObject"],
                resources: [
                    datasetsBucketArn.concat("/protected/*"),
                    contentBucketArn.concat("/protected/*"),
                ],
            }),
        );

        this.addPublicPolicies(protectedRole, datasetsBucketArn, contentBucketArn);
    }

    private addPublicPolicies(
        publicRole: Role,
        datasetsBucketArn: string,
        contentBucketArn: string,
    ) {
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
    }

    private buildIdentityPoolRole(
        name: string,
        authenticated: boolean,
        identityPoolId: string,
    ): Role {
        const type = authenticated ? "authenticated" : "unauthenticated";
        return new Role(this, name, {
            assumedBy: new FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    StringEquals: {
                        "cognito-identity.amazonaws.com:aud": identityPoolId,
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
