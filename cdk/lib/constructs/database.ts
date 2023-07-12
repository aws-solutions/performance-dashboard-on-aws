/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import {
    AttributeType,
    BillingMode,
    CfnTable,
    ProjectionType,
    StreamViewType,
    Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class Database extends Construct {
    public readonly mainTable: Table;
    public readonly auditTrailTable: Table;

    // Suppress cfn_nag Warn W74: DynamoDB table should have encryption enabled using a CMK stored in KMS
    private cfn_nag_warn_w58(tbl: Table) {
        const cfnTable: CfnTable = tbl.node.findChild("Resource") as CfnTable;
        cfnTable.cfnOptions.metadata = {
            cfn_nag: {
                rules_to_suppress: [
                    {
                        id: "W74",
                        reason: "Using default AWS owned CMK",
                    },
                ],
            },
        };
    }

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const mainTable = new Table(scope, "MainTable", {
            billingMode: BillingMode.PAY_PER_REQUEST,
            pointInTimeRecovery: true,
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
            partitionKey: {
                name: "pk",
                type: AttributeType.STRING,
            },
            sortKey: {
                name: "sk",
                type: AttributeType.STRING,
            },
        });
        this.cfn_nag_warn_w58(mainTable);

        mainTable.addGlobalSecondaryIndex({
            indexName: "byType",
            projectionType: ProjectionType.ALL,
            partitionKey: {
                name: "type",
                type: AttributeType.STRING,
            },
            sortKey: {
                name: "sk",
                type: AttributeType.STRING,
            },
        });

        mainTable.addGlobalSecondaryIndex({
            indexName: "byParentDashboard",
            projectionType: ProjectionType.ALL,
            partitionKey: {
                name: "parentDashboardId",
                type: AttributeType.STRING,
            },
            sortKey: {
                name: "version",
                type: AttributeType.NUMBER,
            },
        });

        mainTable.addGlobalSecondaryIndex({
            indexName: "byTopicArea",
            projectionType: ProjectionType.ALL,
            partitionKey: {
                name: "topicAreaId",
                type: AttributeType.STRING,
            },
            sortKey: {
                name: "pk",
                type: AttributeType.STRING,
            },
        });

        mainTable.addGlobalSecondaryIndex({
            indexName: "byFriendlyURL",
            projectionType: ProjectionType.ALL,
            partitionKey: {
                name: "friendlyURL",
                type: AttributeType.STRING,
            },
        });

        const auditTrailTable = new Table(scope, "AuditTrail", {
            billingMode: BillingMode.PAY_PER_REQUEST,
            pointInTimeRecovery: true,
            partitionKey: {
                name: "pk",
                type: AttributeType.STRING,
            },
            sortKey: {
                name: "sk",
                type: AttributeType.STRING,
            },
        });
        this.cfn_nag_warn_w58(auditTrailTable);

        this.mainTable = mainTable;
        this.auditTrailTable = auditTrailTable;
    }
}
