import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codestarnotifications from "@aws-cdk/aws-codestarnotifications";
import * as cloudtrail from "@aws-cdk/aws-cloudtrail";
import * as sns from "@aws-cdk/aws-sns";
import {
  CodeBuildAction,
  S3SourceAction,
  S3Trigger,
} from "@aws-cdk/aws-codepipeline-actions";
import { GitHubIntegration } from "./constructs/github-integration";

interface Props extends cdk.StackProps {
  githubOrg: string;
  repoName: string;
  branch: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const notificationsTopic = new sns.Topic(this, "NotificationsTopic");
    notificationsTopic.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["SNS:Publish"],
        resources: [notificationsTopic.topicArn],
        principals: [
          new iam.ServicePrincipal("codestar-notifications.amazonaws.com"),
        ],
      })
    );

    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket", {
      versioned: true,
    });
    new cdk.CfnOutput(this, "ArtifactsBucketARN", {
      description: "ARN of the artifact's bucket",
      value: artifactsBucket.bucketArn,
    });

    const pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      artifactBucket: artifactsBucket,
    });
    new cdk.CfnOutput(this, "ServiceRoleARN", {
      description: "ARN the service role",
      value: pipeline.role.roleArn,
    });

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const secureBuildOutput = new codepipeline.Artifact();

    const bucketKey = `github/${props.githubOrg}/${props.repoName}/${props.branch}/artifact.zip`;
    const trail = new cloudtrail.Trail(this, "CloudTrail");
    trail.addS3EventSelector(
      [
        {
          bucket: artifactsBucket,
          objectPrefix: bucketKey,
        },
      ],
      {
        readWriteType: cloudtrail.ReadWriteType.WRITE_ONLY,
      }
    );

    const sourceAction = new S3SourceAction({
      actionName: "Source",
      trigger: S3Trigger.EVENTS,
      bucket: artifactsBucket,
      output: sourceOutput,
      bucketKey,
    });
    new cdk.CfnOutput(this, "SourceRoleARN", {
      description: "ARN of the source action.",
      value: sourceAction.actionProperties.role?.roleArn ?? "",
    });

    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    const build = new codebuild.PipelineProject(this, "Build", {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: codebuild.ComputeType.LARGE,
      },
      environmentVariables: {
        CDK_ADMIN_EMAIL: {
          value: "johndoe@example.com",
        },
        ENVIRONMENT: {
          value: "Gamma",
        },
        LANGUAGE: {
          value: "english",
        },
        AUTH: {
          value: "false",
        },
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename("buildspec.gamma.yml"),
    });

    const buildSecure = new codebuild.PipelineProject(this, "Build-Secure", {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: codebuild.ComputeType.LARGE,
      },
      environmentVariables: {
        CDK_ADMIN_EMAIL: {
          value: "johndoe@example.com",
        },
        ENVIRONMENT: {
          value: "GammaSecure",
        },
        LANGUAGE: {
          value: "english",
        },
        AUTH: {
          value: "true",
        },
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename("buildspec.gamma.yml"),
    });

    build.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );
    buildSecure.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["*"],
        resources: ["*"],
      })
    );

    pipeline.addStage({
      stageName: "Gamma",
      actions: [
        new CodeBuildAction({
          actionName: "Build.and.Deploy",
          project: build,
          input: sourceOutput,
          outputs: [buildOutput],
          runOrder: 1,
        }),
        new CodeBuildAction({
          actionName: "Build.and.Deploy.Secure",
          project: buildSecure,
          input: sourceOutput,
          outputs: [secureBuildOutput],
          runOrder: 2,
        }),
      ],
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
    new codestarnotifications.CfnNotificationRule(
      this,
      "BuildNotificationRule",
      {
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
      }
    );
    new codestarnotifications.CfnNotificationRule(
      this,
      "BuildNotificationRuleSecure",
      {
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
      }
    );
  }
}
