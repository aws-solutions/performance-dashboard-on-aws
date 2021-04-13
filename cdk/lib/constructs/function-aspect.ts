import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import { LogRetention } from "@aws-cdk/aws-logs";
import { CfnFunction } from "@aws-cdk/aws-lambda";

export class FunctionInvalidWarningSuppressor implements cdk.IAspect {
  function_to_suppress = [
    "Frontend.Custom::WithConfigurationcloudcomponentscdklambdaatedgepatternwithconfiguration.Resource",
    "Frontend.Custom::CDKBucketDeployment",
    "Frontend.EnvConfig.Resource",
    "Frontend.EnvConfigProvider.framework-onEvent.Resource",
    "lambda-at-edge-support-stack.http-headersFunction.Resource",
    "Frontend.AWS679f53fac002430cb0da5b7982bd2287.Resource",
    "Backend.Functions.PrivateApi.Resource",
    "Backend.Functions.PublicApi.Resource",
    "Backend.Functions.DynamoDBStreamProcessor.Resource",
  ];

  /**
   * Suppress cfn_nag Warn W58: Lambda functions require permission to write CloudWatch Logs
   * Suppress cfn_nag Warn W89: Lambda functions should be deployed inside a VPC
   */
  private cfn_nag_warn(fcn: lambda.CfnFunction) {
    fcn.cfnOptions.metadata = {
      cfn_nag: {
        rules_to_suppress: [
          {
            id: "W58",
            reason:
              "Function has AWSLambdaBasicExecutionRole which provides write permissions to CloudWatch Logs",
          },
          {
            id: "W89",
            reason:
              "VPCs are not used for this use case",
          },
        ],
      },
    };
  }

  public visit(node: cdk.IConstruct): void {
    if (
      (node.node.path.includes("Frontend/LogRetention") ||
        node.node.path.includes("Backend/LogRetention")) &&
      node.node.id.includes("LogRetention")
    ) {
      const cfnFcn: lambda.CfnFunction = node.node.findChild(
        "Resource"
      ) as lambda.CfnFunction;
      this.cfn_nag_warn(cfnFcn);
    } else if (node instanceof lambda.CfnFunction) {
      for (let fcn of this.function_to_suppress) {
        if (node.logicalId.includes(fcn)) {
          this.cfn_nag_warn(node);
        }
      }
    }
  }
}
