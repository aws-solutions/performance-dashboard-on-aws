import * as cdk from "@aws-cdk/core";
import s3 = require("@aws-cdk/aws-s3");
import codecommit = require("@aws-cdk/aws-codecommit");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import codebuild = require("@aws-cdk/aws-codebuild");
import {
  CodeCommitSourceAction,
  CodeBuildAction,
  CloudFormationCreateUpdateStackAction,
} from "@aws-cdk/aws-codepipeline-actions";

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

    const build = new codebuild.PipelineProject(this, "BuildBadger", {
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
        computeType: codebuild.ComputeType.LARGE,
      },
      environmentVariables: {
        PACKAGE_BUCKET: {
          value: artifactsBucket.bucketName,
        },
      },
    });

    pipeline.addStage({
      stageName: "Build",
      actions: [
        new CodeBuildAction({
          actionName: "Build",
          project: build,
          input: sourceOutput,
          outputs: [buildOutput],
          runOrder: 1,
        }),
      ],
    });

    pipeline.addStage({
      stageName: 'Gamma',
      actions: [
        new CloudFormationCreateUpdateStackAction({
          actionName: 'DeployAuth',
          templatePath: buildOutput.atPath("Auth.template.json"),
          stackName: 'Badger-gamma-Auth',
          adminPermissions: true,
          runOrder: 1
        }),
        new CloudFormationCreateUpdateStackAction({
          actionName: 'DeployBackend',
          templatePath: buildOutput.atPath("Backend.template.json"),
          stackName: 'Badger-gamma-Backend',
          adminPermissions: true,
          runOrder: 2
        }),
      ],
    });
  }
}
