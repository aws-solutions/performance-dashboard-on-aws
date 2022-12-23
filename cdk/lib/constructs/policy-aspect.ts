/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { IAspect } from "aws-cdk-lib";
import { CfnPolicy } from "aws-cdk-lib/aws-iam";
import { IConstruct } from "constructs";

export class PolicyInvalidWarningSuppressor implements IAspect {
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

    public visit(node: IConstruct): void {
        if (node instanceof CfnPolicy) {
            for (let policy of this.policy_to_suppress) {
                if (node.logicalId.includes(policy)) {
                    node.cfnOptions.metadata = {
                        cfn_nag: {
                            rules_to_suppress: [
                                {
                                    id: "W12",
                                    reason: "xray actions PutTraceSegments and PutTelemetryRecords require wildcard resources",
                                },
                            ],
                        },
                    };
                }
            }
        }
    }
}
