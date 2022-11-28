/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class Database extends cdk.Construct {
  public readonly mainTable: dynamodb.Table;
  public readonly auditTrailTable: dynamodb.Table;

  // Suppress cfn_nag Warn W74: DynamoDB table should have encryption enabled using a CMK stored in KMS
  private cfn_nag_warn_w58(tbl: dynamodb.Table) {
    let cfnTable: dynamodb.CfnTable = tbl.node.findChild(
      "Resource"
    ) as dynamodb.CfnTable;
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

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const mainTable = new dynamodb.Table(scope, "MainTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
    });
    this.cfn_nag_warn_w58(mainTable);

    mainTable.addGlobalSecondaryIndex({
      indexName: "byType",
      projectionType: dynamodb.ProjectionType.ALL,
      partitionKey: {
        name: "type",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
    });

    mainTable.addGlobalSecondaryIndex({
      indexName: "byParentDashboard",
      projectionType: dynamodb.ProjectionType.ALL,
      partitionKey: {
        name: "parentDashboardId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "version",
        type: dynamodb.AttributeType.NUMBER,
      },
    });

    mainTable.addGlobalSecondaryIndex({
      indexName: "byTopicArea",
      projectionType: dynamodb.ProjectionType.ALL,
      partitionKey: {
        name: "topicAreaId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
    });

    mainTable.addGlobalSecondaryIndex({
      indexName: "byFriendlyURL",
      projectionType: dynamodb.ProjectionType.ALL,
      partitionKey: {
        name: "friendlyURL",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const auditTrailTable = new dynamodb.Table(scope, "AuditTrail", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
    });
    this.cfn_nag_warn_w58(auditTrailTable);

    this.mainTable = mainTable;
    this.auditTrailTable = auditTrailTable;
  }
}
