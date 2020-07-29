import * as cdk from "@aws-cdk/core";
import s3 = require("@aws-cdk/aws-s3");
import codecommit = require("@aws-cdk/aws-codecommit");
import iam = require("@aws-cdk/aws-iam");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import codebuild = require("@aws-cdk/aws-codebuild");
import * as codestarnotifications from "@aws-cdk/aws-codestarnotifications";
import sns = require("@aws-cdk/aws-sns");
import {
  CodeCommitSourceAction,
  CodeBuildAction,
} from "@aws-cdk/aws-codepipeline-actions";

interface Props extends cdk.StackProps {
  repoName: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const notificationsTopic = new sns.Topic(this, "NotificationsTopic");
    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket");
    const codeRepo = codecommit.Repository.fromRepositoryName(
      this,
      "Repository",
      props.repoName
    );

    const pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      artifactBucket: artifactsBucket,
    });

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new CodeCommitSourceAction({
          actionName: "Source",
          repository: codeRepo,
          branch: "mainline",
          output: sourceOutput,
        }),
      ],
    });

    const build = new codebuild.PipelineProject(this, "Build", {
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
        computeType: codebuild.ComputeType.LARGE,
      },
      environmentVariables: {
        ENVIRONMENT: {
          value: "Gamma",
        },
      },
    });

    build.addToRolePolicy(
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
      ],
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
        name: "BadgerBuildNotifications",
        eventTypeIds: [
          "codebuild-project-build-state-failed",
        ],
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
