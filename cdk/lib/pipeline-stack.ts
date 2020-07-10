import * as cdk from "@aws-cdk/core";
import s3 = require("@aws-cdk/aws-s3");
import codecommit = require("@aws-cdk/aws-codecommit");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions");
import codebuild = require("@aws-cdk/aws-codebuild");

interface Props extends cdk.StackProps {
  repoName: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

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
    const buildCdkOutput = new codepipeline.Artifact();
    const buildBackendOutput = new codepipeline.Artifact();

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new codepipeline_actions.CodeCommitSourceAction({
          actionName: "CodeCommit_Source",
          repository: codeRepo,
          branch: "mainline",
          output: sourceOutput,
        }),
      ],
    });

    // Declare a new CodeBuild project for the CDK app
    const buildCdk = new codebuild.PipelineProject(this, "BuildCdk", {
      environment: { buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2 },
      buildSpec: codebuild.BuildSpec.fromSourceFilename("cdk/buildspec.yml"),
      environmentVariables: {
        PACKAGE_BUCKET: {
          value: artifactsBucket.bucketName,
        },
      },
    });

    // Declare a new CodeBuild project for the Backend app
    const buildBackend = new codebuild.PipelineProject(this, "BuildBackend", {
      environment: { buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2 },
      buildSpec: codebuild.BuildSpec.fromSourceFilename("backend/buildspec.yml"),
      environmentVariables: {
        PACKAGE_BUCKET: {
          value: artifactsBucket.bucketName,
        },
      },
    });

    pipeline.addStage({
      stageName: "Build",
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: "BuildCDK",
          project: buildCdk,
          input: sourceOutput,
          outputs: [buildCdkOutput],
        }),
        new codepipeline_actions.CodeBuildAction({
          actionName: "BuildBackend",
          project: buildBackend,
          input: sourceOutput,
          outputs: [buildBackendOutput],
        }),
      ],
    });
  }
}
