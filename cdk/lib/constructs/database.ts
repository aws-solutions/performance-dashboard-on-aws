import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class BadgerDatabase extends cdk.Construct {
  public readonly mainTable: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const table = new dynamodb.Table(scope, "BadgerTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
    });

    table.addGlobalSecondaryIndex({
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

    this.mainTable = table;
  }
}
