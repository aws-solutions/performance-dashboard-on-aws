/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { ReadWriteType, Trail } from "aws-cdk-lib/aws-cloudtrail";
import {
    BuildSpec,
    ComputeType,
    LinuxBuildImage,
    PipelineProject,
} from "aws-cdk-lib/aws-codebuild";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import { CodeBuildAction, S3SourceAction, S3Trigger } from "aws-cdk-lib/aws-codepipeline-actions";
import { CfnNotificationRule } from "aws-cdk-lib/aws-codestarnotifications";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import { GitHubIntegration } from "./constructs/github-integration";

interface Props extends StackProps {
    githubOrg: string;
    repoName: string;
    branch: string;
    environment: string;
    secure?: boolean;
}

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const notificationsTopic = new Topic(this, "NotificationsTopic");
        notificationsTopic.addToResourcePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["SNS:Publish"],
                resources: [notificationsTopic.topicArn],
                principals: [new ServicePrincipal("codestar-notifications.amazonaws.com")],
            }),
        );

        const artifactsBucket = new Bucket(this, "ArtifactsBucket", {
            versioned: true,
        });
        new CfnOutput(this, "ArtifactsBucketARN", {
            description: "ARN of the artifact's bucket",
            value: artifactsBucket.bucketArn,
        });

        const pipeline = new Pipeline(this, "Pipeline", {
            artifactBucket: artifactsBucket,
        });
        new CfnOutput(this, "ServiceRoleARN", {
            description: "ARN the service role",
            value: pipeline.role.roleArn,
        });

        const sourceOutput = new Artifact();
        const buildOutput = new Artifact();
        const secureBuildOutput = new Artifact();

        const bucketKey = `github/${props.githubOrg}/${props.repoName}/${props.branch}/artifact.zip`;
        const trail = new Trail(this, "CloudTrail");
        trail.addS3EventSelector(
            [
                {
                    bucket: Bucket.fromBucketArn(
                        this,
                        "ArtifactsBucket",
                        artifactsBucket.bucketArn,
                    ),
                    objectPrefix: bucketKey,
                },
            ],
            {
                readWriteType: ReadWriteType.WRITE_ONLY,
            },
        );

        const sourceAction = new S3SourceAction({
            actionName: "Source",
            trigger: S3Trigger.EVENTS,
            bucket: artifactsBucket,
            output: sourceOutput,
            bucketKey,
        });
        new CfnOutput(this, "SourceRoleARN", {
            description: "ARN of the source action.",
            value: sourceAction.actionProperties.role?.roleArn ?? "",
        });

        pipeline.addStage({
            stageName: "Source",
            actions: [sourceAction],
        });

        const build = new PipelineProject(this, "Build", {
            environment: {
                buildImage: LinuxBuildImage.STANDARD_5_0,
                computeType: ComputeType.LARGE,
            },
            environmentVariables: {
                CDK_ADMIN_EMAIL: {
                    value: "johndoe@example.com",
                },
                ENVIRONMENT: {
                    value: props.environment,
                },
                LANGUAGE: {
                    value: "english",
                },
                AUTH: {
                    value: "no",
                },
            },
            buildSpec: BuildSpec.fromSourceFilename("buildspec.deploy.yml"),
        });

        const buildSecure = new PipelineProject(this, "Build-Secure", {
            environment: {
                buildImage: LinuxBuildImage.STANDARD_5_0,
                computeType: ComputeType.LARGE,
            },
            environmentVariables: {
                CDK_ADMIN_EMAIL: {
                    value: "johndoe@example.com",
                },
                ENVIRONMENT: {
                    value: `${props.environment}Secure`,
                },
                LANGUAGE: {
                    value: "english",
                },
                AUTH: {
                    value: "yes",
                },
            },
            buildSpec: BuildSpec.fromSourceFilename("buildspec.deploy.yml"),
        });

        build.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["*"],
                resources: ["*"],
            }),
        );
        buildSecure.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["*"],
                resources: ["*"],
            }),
        );

        const actions: CodeBuildAction[] = [
            new CodeBuildAction({
                actionName: "Build.and.Deploy",
                project: build,
                input: sourceOutput,
                outputs: [buildOutput],
                runOrder: 1,
            }),
        ];

        if (props.secure) {
            actions.push(
                new CodeBuildAction({
                    actionName: "Build.and.Deploy.Secure",
                    project: buildSecure,
                    input: sourceOutput,
                    outputs: [secureBuildOutput],
                    runOrder: 2,
                }),
            );
        }
        pipeline.addStage({
            stageName: "Deploy",
            actions,
        });

        const decryptArns = [pipeline.role.roleArn];
        if (sourceAction.actionProperties.role?.roleArn) {
            decryptArns.push(sourceAction.actionProperties.role.roleArn);
        }

        new GitHubIntegration(this, "GitHubIntegration", {
            githubOrg: props.githubOrg,
            bucketArn: artifactsBucket.bucketArn,
            region: this.region,
            accountId: this.account,
            decryptArns,
        });

        /**
         * CodeBuild notification configuration taken from documentation:
         * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html
         */
        new CfnNotificationRule(this, "BuildNotificationRule", {
            detailType: "BASIC",
            resource: build.projectArn,
            name: "BuildNotifications",
            eventTypeIds: ["codebuild-project-build-state-failed"],
            targets: [
                {
                    targetType: "SNS",
                    targetAddress: notificationsTopic.topicArn,
                },
            ],
        });
        new CfnNotificationRule(this, "BuildNotificationRuleSecure", {
            detailType: "BASIC",
            resource: buildSecure.projectArn,
            name: "BuildNotificationsSecure",
            eventTypeIds: ["codebuild-project-build-state-failed"],
            targets: [
                {
                    targetType: "SNS",
                    targetAddress: notificationsTopic.topicArn,
                },
            ],
        });
    }
}
