/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnOutput } from "aws-cdk-lib";
import { Artifacts, BuildSpec, LinuxBuildImage, Project } from "aws-cdk-lib/aws-codebuild";
import {
    ArnPrincipal,
    CfnRole,
    Effect,
    FederatedPrincipal,
    OpenIdConnectProvider,
    PolicyDocument,
    PolicyStatement,
    Role,
} from "aws-cdk-lib/aws-iam";
import { Key } from "aws-cdk-lib/aws-kms";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface GitHubIntegrationProps {
    readonly githubOrg: string;
    readonly bucketArn: string;
    readonly region: string;
    readonly accountId: string;
    readonly decryptArns: string[];
}

export class GitHubIntegration extends Construct {
    private readonly props: GitHubIntegrationProps;
    private readonly idp: OpenIdConnectProvider;
    public readonly dispatcherCodeBuildProject: Project;

    constructor(scope: Construct, id: string, props: GitHubIntegrationProps) {
        super(scope, id);
        this.props = props;
        this.idp = new OpenIdConnectProvider(this, "OidProvider", {
            url: "https://token.actions.githubusercontent.com",
            clientIds: ["sts.amazonaws.com"],
        });

        if (!props.githubOrg) {
            throw new Error("Missing GitHub organization");
        }

        const artifactsBucket = Bucket.fromBucketArn(this, "ArtifactsBucket", props.bucketArn);
        const artifactsEncryptionKey = new Key(this, "ArtifactsEncryptionKey", {
            description:
                "KMS key for the Dispatcher CodeBuild project to use for encrypting artifacts",
            alias: "github-dispatcher-codebuild-key",
            enableKeyRotation: true,
        });

        props.decryptArns.forEach((roleArn) => {
            artifactsEncryptionKey.grantEncryptDecrypt(new ArnPrincipal(roleArn));
        });

        this.dispatcherCodeBuildProject = new Project(this, "GitHubDispatcherCodeBuildProject", {
            projectName: "GitHubDispatcher",
            environment: {
                buildImage: LinuxBuildImage.AMAZON_LINUX_2,
            },
            buildSpec: BuildSpec.fromObject({
                version: "0.2",
                artifacts: {
                    files: ["**/*"],
                    name: "github/$GITHUB_REPOSITORY/$GITHUB_REF_NAME/artifact.zip",
                },
            }),
            artifacts: Artifacts.s3({
                bucket: artifactsBucket,
                packageZip: true,
                includeBuildId: false,
            }),
            encryptionKey: artifactsEncryptionKey,
        });
        const codeBuildCfnRole = this.dispatcherCodeBuildProject.role?.node.defaultChild as CfnRole;
        codeBuildCfnRole?.addPropertyOverride("RoleName", "GitHubDispatcherCodeBuildServiceRole");

        const gitHubDispatcherRole = this.createGitHubRole(
            "Dispatcher",
            this.dispatcherCodeBuildProject,
        );

        new CfnOutput(this, "ArtifactsBucketARN", {
            description: "ARN of the artifact's bucket",
            value: artifactsBucket.bucketArn,
        });

        new CfnOutput(this, "GitHubDispatcherIamRole", {
            description:
                "ARN of the IAM Role that GitHub assumes to run the Dispatcher CodeBuild project",
            value: gitHubDispatcherRole.roleArn,
        });

        new CfnOutput(this, "GitHubDispatcherCodeBuildProjectName", {
            description: "Name of the GitHub Dispatcher CodeBuild Project",
            value: this.dispatcherCodeBuildProject.projectName,
        });
    }

    createGitHubRole(type: string, codeBuildProject: Project): Role {
        return new Role(this, `GitHub${type}Role`, {
            roleName: `GitHubIntegration-CodeBuild-${type}-Role`,
            assumedBy: new FederatedPrincipal(
                this.idp.openIdConnectProviderArn,
                {
                    StringLike: {
                        "token.actions.githubusercontent.com:sub": `repo:${this.props.githubOrg}/*`,
                    },
                },
                "sts:AssumeRoleWithWebIdentity",
            ),
            inlinePolicies: {
                AllowBuilds: new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            effect: Effect.ALLOW,
                            actions: ["codebuild:StartBuild", "codebuild:BatchGetBuilds"],
                            resources: [codeBuildProject.projectArn],
                        }),
                        new PolicyStatement({
                            effect: Effect.ALLOW,
                            actions: ["logs:GetLogEvents"],
                            resources: [
                                `arn:aws:logs:${this.props.region}:${this.props.accountId}:log-group:/aws/codebuild/${codeBuildProject.projectName}:*`,
                            ],
                        }),
                    ],
                }),
            },
        });
    }
}
