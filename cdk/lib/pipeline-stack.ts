import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { Repository } from "@aws-cdk/aws-codecommit";
import * as iam from "@aws-cdk/aws-iam";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codestarnotifications from "@aws-cdk/aws-codestarnotifications";
import * as sns from "@aws-cdk/aws-sns";
import {
  CodeCommitSourceAction,
  CodeBuildAction,
  GitHubSourceAction,
} from "@aws-cdk/aws-codepipeline-actions";

interface Props extends cdk.StackProps {
  repoName: string;
  sourceProvider: "GitHub" | "CodeCommit";
  branch: string;
  githubOwner?: string;
  githubOAuthToken?: string;
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

    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket");
    const pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      artifactBucket: artifactsBucket,
    });

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const sourceAction = createSourceAction(scope, props, sourceOutput);

    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
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
  }
}

function createSourceAction(
  scope: cdk.Construct,
  props: Props,
  output: codepipeline.Artifact
): codepipeline.IAction {
  if (props.sourceProvider === "CodeCommit") {
    return createCodeCommitSourceAction(
      scope,
      props.repoName,
      props.branch,
      output
    );
  }

  if (!props.githubOAuthToken || !props.githubOwner) {
    throw new Error("Missing GitHub props owner and/or oauthtoken");
  }

  return createGitHubSourceAction(
    props.repoName,
    props.githubOwner,
    props.branch,
    props.githubOAuthToken,
    output
  );
}

function createGitHubSourceAction(
  repo: string,
  owner: string,
  branch: string,
  oauthToken: string,
  sourceOutput: codepipeline.Artifact
): GitHubSourceAction {
  return new GitHubSourceAction({
    actionName: "Source",
    repo: repo,
    output: sourceOutput,
    owner,
    branch,
    oauthToken: cdk.SecretValue.secretsManager(oauthToken),
  });
}

function createCodeCommitSourceAction(
  scope: cdk.Construct,
  repo: string,
  branch: string,
  sourceOutput: codepipeline.Artifact
): CodeCommitSourceAction {
  const codeRepo = Repository.fromRepositoryName(scope, "Repository", repo);
  return new CodeCommitSourceAction({
    actionName: "Source",
    repository: codeRepo,
    branch,
    output: sourceOutput,
  });
}
