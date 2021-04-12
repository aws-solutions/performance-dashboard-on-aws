import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";

export class PolicyInvalidWarningSuppressor implements cdk.IAspect {
  policy_to_suppress = [
    "Backend.Functions.PublicApi.ServiceRole.DefaultPolicy.Resource",
    "Backend.Functions.PrivateApi.ServiceRole.DefaultPolicy.Resource",
    "Backend.Functions.DynamoDBStreamProcessor.ServiceRole.DefaultPolicy.Resource",
    "Backend.LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a.ServiceRole.DefaultPolicy.Resource",
    "Frontend.EnvConfig.ServiceRole.DefaultPolicy.Resource",
    "Frontend.LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a.ServiceRole.DefaultPolicy.Resource",
    "Frontend.EnvConfigProvider.framework-onEvent.ServiceRole.DefaultPolicy.Resource",
    "Frontend.Custom::CDKBucketDeployment",
  ];

  public visit(node: cdk.IConstruct): void {
    if (node instanceof iam.CfnPolicy) {
      //console.log(node.logicalId);
      for (let policy of this.policy_to_suppress) {
        if (node.logicalId.includes(policy)) {
          node.cfnOptions.metadata = {
            cfn_nag: {
              rules_to_suppress: [
                {
                  id: "W12",
                  reason:
                    "xray actions PutTraceSegments and PutTelemetryRecords require wildcard resources",
                },
              ],
            },
          };
        }
      }
    }
  }
}
