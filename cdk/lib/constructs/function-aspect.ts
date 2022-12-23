/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { CfnFunction } from "aws-cdk-lib/aws-lambda";
import { IAspect } from "aws-cdk-lib";
import { IConstruct } from "constructs";

export class FunctionInvalidWarningSuppressor implements IAspect {
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
     * Suppress cfn_nag Warn W92: Lambda functions should define ReservedConcurrentExecutions to reserve simultaneous executions
     */
    private cfn_nag_warn(fcn: CfnFunction) {
        fcn.cfnOptions.metadata = {
            cfn_nag: {
                rules_to_suppress: [
                    {
                        id: "W58",
                        reason: "Function has AWSLambdaBasicExecutionRole which provides write permissions to CloudWatch Logs",
                    },
                    {
                        id: "W89",
                        reason: "VPCs are not used for this use case",
                    },
                    {
                        id: "W92",
                        reason: "ReservedConcurrentExecutions are placed on the Lambda serving Admin traffic to guarantee the Admin console is available under load.  The Lambda serving public traffic should not have an upper bound, and our docs advises the customer to adjust the concurrency appropriately.",
                    },
                ],
            },
        };
    }

    public visit(node: IConstruct): void {
        if (
            (node.node.path.includes("Frontend/LogRetention") ||
                node.node.path.includes("Backend/LogRetention")) &&
            node.node.id.includes("LogRetention")
        ) {
            const cfnFcn: CfnFunction = node.node.findChild("Resource") as CfnFunction;
            this.cfn_nag_warn(cfnFcn);
        } else if (node instanceof CfnFunction) {
            for (let fcn of this.function_to_suppress) {
                if (node.logicalId.includes(fcn)) {
                    this.cfn_nag_warn(node);
                }
            }
        }
    }
}
