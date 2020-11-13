import * as cdk from "@aws-cdk/core";
import * as sns from "@aws-cdk/aws-sns";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { SnsAction } from "@aws-cdk/aws-cloudwatch-actions";
import {
  Alarm,
  Metric,
  MathExpression,
  Dashboard,
  GraphWidget,
  SingleValueWidget,
  AlarmStatusWidget,
  Color,
  TreatMissingData,
  ComparisonOperator,
} from "@aws-cdk/aws-cloudwatch";

interface Props extends cdk.StackProps {
  privateApiFunction: lambda.Function;
  publicApiFunction: lambda.Function;
  restApi: apigateway.RestApi;
  mainTable: dynamodb.Table;
}

const ENABLE_ALARM_SNS_NOTIFICATIONS = true;
const LAMBDA_ALARMS_EVALUATION_PERIOD_MINUTES = 5;
const LAMBDA_ALARMS_EVALUATION_PERIODS = 2;
const DASHBOARD_AGGREGATION_PERIOD_MINUTES = 5;
const DASHBOARD_WIDGET_HEIGHT = 9;
const DASHBOARD_DEFAULT_PERIOD = "-PT12H";

export class OpsStack extends cdk.Stack {
  private readonly opsNotifications: sns.Topic;
  private readonly props: Props;
  private readonly alarms: Alarm[];

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    this.props = props;
    this.alarms = [];
    this.opsNotifications = new sns.Topic(this, "OpsNotifications");

    this.createLambdaAlarms("PrivateApiFunction", props.privateApiFunction);
    this.createLambdaAlarms("PublicApiFunction", props.publicApiFunction);
    this.createOpsDashboard();

    new cdk.CfnOutput(this, "OpsNotificationsTopic", {
      value: this.opsNotifications.topicArn,
    });
  }

  createLambdaAlarms(id: string, lambdaFunction: lambda.Function) {
    const invocations = new Metric({
      namespace: "AWS/Lambda",
      metricName: "Invocations",
      statistic: "Sum",
      dimensions: {
        FunctionName: lambdaFunction.functionName,
      },
    });

    const errors = new Metric({
      namespace: "AWS/Lambda",
      metricName: "Errors",
      statistic: "Sum",
      dimensions: {
        FunctionName: lambdaFunction.functionName,
      },
    });

    const errorRateAlarm = new Alarm(this, id.concat("ErrorRateAlarm"), {
      alarmDescription: "At least 5% of Lambda executions resulted in error",
      evaluationPeriods: LAMBDA_ALARMS_EVALUATION_PERIODS,
      threshold: 5,
      treatMissingData: TreatMissingData.NOT_BREACHING,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      actionsEnabled: ENABLE_ALARM_SNS_NOTIFICATIONS,
      metric: new MathExpression({
        expression: "(errors / invocations) * 100",
        label: "Error Rate (%)",
        usingMetrics: {
          invocations: invocations,
          errors: errors,
        },
      }).with({
        period: cdk.Duration.minutes(LAMBDA_ALARMS_EVALUATION_PERIOD_MINUTES),
      }),
    });

    const throttlesAlarm = new Alarm(this, id.concat("ThrottleRateAlarm"), {
      alarmDescription: "At least 10 Lambda invocations were throttled",
      evaluationPeriods: LAMBDA_ALARMS_EVALUATION_PERIODS,
      threshold: 10,
      actionsEnabled: ENABLE_ALARM_SNS_NOTIFICATIONS,
      treatMissingData: TreatMissingData.NOT_BREACHING,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        namespace: "AWS/Lambda",
        metricName: "Throttles",
        statistic: "Sum",
        dimensions: {
          FunctionName: lambdaFunction.functionName,
        },
      }).with({
        period: cdk.Duration.minutes(LAMBDA_ALARMS_EVALUATION_PERIOD_MINUTES),
      }),
    });

    this.alarms.push(errorRateAlarm);
    this.alarms.push(throttlesAlarm);

    errorRateAlarm.addAlarmAction(new SnsAction(this.opsNotifications));
    throttlesAlarm.addAlarmAction(new SnsAction(this.opsNotifications));
  }

  createOpsDashboard() {
    const dashboard = new Dashboard(this, "OpsDashboard", {
      start: DASHBOARD_DEFAULT_PERIOD,
    });

    const apiRequests = this.createApiRequestsWidget();
    const apiLatency = this.createApiLatencyWidget();
    const apiRequestsAggregated = this.createApiRequestsAggregationWidget();
    const apiErrorsAggregated = this.createApiErrorsAggregationWidget();
    const apiLatencyAggregated = this.createApiLatencyAggregationWidget();
    const alarmsWidget = this.createAlarmsWidget();

    const privateApiInvocations = this.createLambdaInvocationsWidget(
      this.props.privateApiFunction,
      "Admin Users"
    );

    const publicApiInvocations = this.createLambdaInvocationsWidget(
      this.props.publicApiFunction,
      "Public Users"
    );

    const mainTableLatency = this.createDynamoDBLatencyWidget(
      this.props.mainTable
    );

    const mainTableErrors = this.createDynamoDBErrorsWidget(
      this.props.mainTable
    );

    dashboard.addWidgets(alarmsWidget);
    dashboard.addWidgets(
      apiLatencyAggregated,
      apiRequestsAggregated,
      apiErrorsAggregated
    );
    dashboard.addWidgets(apiRequests);
    dashboard.addWidgets(apiLatency);
    dashboard.addWidgets(privateApiInvocations, publicApiInvocations);
    dashboard.addWidgets(mainTableLatency);
    dashboard.addWidgets(mainTableErrors);

    return dashboard;
  }

  createLambdaInvocationsWidget(
    lambdaFunction: lambda.Function,
    label: string,
    width: number = 12
  ): GraphWidget {
    return new GraphWidget({
      title: `Lambda Invocations - ${label}`,
      width,
      height: DASHBOARD_WIDGET_HEIGHT,
      left: [
        new Metric({
          namespace: "AWS/Lambda",
          metricName: "Invocations",
          statistic: "Sum",
          color: Color.GREEN,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            FunctionName: lambdaFunction.functionName,
          },
        }),
        new Metric({
          namespace: "AWS/Lambda",
          metricName: "Errors",
          statistic: "Sum",
          color: Color.RED,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            FunctionName: lambdaFunction.functionName,
          },
        }),
        new Metric({
          namespace: "AWS/Lambda",
          metricName: "Throttles",
          statistic: "Sum",
          color: Color.ORANGE,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            FunctionName: lambdaFunction.functionName,
          },
        }),
        new Metric({
          namespace: "AWS/Lambda",
          metricName: "ConcurrentExecutions",
          statistic: "Maximum",
          color: Color.PURPLE,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            FunctionName: lambdaFunction.functionName,
          },
        }),
      ],
    });
  }

  createApiRequestsWidget(): GraphWidget {
    return new GraphWidget({
      title: "API Requests",
      width: 24,
      height: DASHBOARD_WIDGET_HEIGHT,
      left: [
        new Metric({
          namespace: "AWS/ApiGateway",
          metricName: "Count",
          statistic: "sum",
          color: Color.GREEN,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            ApiName: "ApiGateway",
          },
        }),
        new Metric({
          namespace: "AWS/ApiGateway",
          metricName: "4XXError",
          statistic: "sum",
          color: Color.ORANGE,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            ApiName: "ApiGateway",
          },
        }),
        new Metric({
          namespace: "AWS/ApiGateway",
          metricName: "5XXError",
          statistic: "sum",
          color: Color.RED,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            ApiName: "ApiGateway",
          },
        }),
      ],
    });
  }

  createApiLatencyWidget(): GraphWidget {
    return new GraphWidget({
      title: "API Latency",
      width: 24,
      height: DASHBOARD_WIDGET_HEIGHT,
      leftYAxis: {
        min: 0,
        max: 3000,
      },
      left: [
        new Metric({
          namespace: "AWS/ApiGateway",
          metricName: "Latency",
          statistic: "p50",
          color: Color.GREEN,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            ApiName: "ApiGateway",
          },
        }),
        new Metric({
          namespace: "AWS/ApiGateway",
          metricName: "Latency",
          statistic: "p99",
          color: Color.PURPLE,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            ApiName: "ApiGateway",
          },
        }),
      ],
    });
  }

  createDynamoDBLatencyWidget(table: dynamodb.Table): GraphWidget {
    return new GraphWidget({
      title: "DynamoDB Latency by Request Type",
      width: 24,
      height: DASHBOARD_WIDGET_HEIGHT,
      left: [
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "SuccessfulRequestLatency",
          statistic: "Average",
          color: Color.BLUE,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
            Operation: "Query",
          },
        }),
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "SuccessfulRequestLatency",
          statistic: "Average",
          color: Color.ORANGE,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
            Operation: "PutItem",
          },
        }),
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "SuccessfulRequestLatency",
          statistic: "Average",
          color: Color.GREEN,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
            Operation: "GetItem",
          },
        }),
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "SuccessfulRequestLatency",
          statistic: "Average",
          color: Color.PURPLE,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
            Operation: "UpdateItem",
          },
        }),
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "SuccessfulRequestLatency",
          statistic: "Average",
          color: Color.PINK,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
            Operation: "DeleteItem",
          },
        }),
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "SuccessfulRequestLatency",
          statistic: "Average",
          color: Color.GREY,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
            Operation: "TransactWriteItems",
          },
        }),
      ],
    });
  }

  createDynamoDBErrorsWidget(table: dynamodb.Table): GraphWidget {
    return new GraphWidget({
      title: "DynamoDB Errors",
      width: 24,
      height: DASHBOARD_WIDGET_HEIGHT,
      left: [
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "ThrottledRequests",
          statistic: "Sum",
          color: Color.ORANGE,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
            Operation: "GetItem",
          },
        }),
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "ThrottledRequests",
          statistic: "Sum",
          color: Color.PINK,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
            Operation: "Query",
          },
        }),
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "SystemErrors",
          statistic: "Sum",
          color: Color.RED,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
          },
        }),
        new Metric({
          namespace: "AWS/DynamoDB",
          metricName: "UserErrors",
          statistic: "Sum",
          color: Color.RED,
          period: cdk.Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
          dimensions: {
            TableName: table.tableName,
          },
        }),
      ],
    });
  }

  createApiLatencyAggregationWidget(): SingleValueWidget {
    return new SingleValueWidget({
      title: "API Latency",
      width: 8,
      setPeriodToTimeRange: true,
      metrics: [
        new Metric({
          namespace: "AWS/ApiGateway",
          metricName: "Latency",
          statistic: "p99",
          label: "p99",
          dimensions: {
            ApiName: "ApiGateway",
          },
        }),
      ],
    });
  }

  createApiRequestsAggregationWidget(): SingleValueWidget {
    return new SingleValueWidget({
      title: "API Requests",
      width: 8,
      setPeriodToTimeRange: true,
      metrics: [
        new Metric({
          namespace: "AWS/ApiGateway",
          metricName: "Count",
          statistic: "Sum",
          dimensions: {
            ApiName: "ApiGateway",
          },
        }),
      ],
    });
  }

  createApiErrorsAggregationWidget(): SingleValueWidget {
    return new SingleValueWidget({
      title: "API Errors",
      width: 8,
      setPeriodToTimeRange: true,
      metrics: [
        new Metric({
          namespace: "AWS/ApiGateway",
          metricName: "5XXError",
          statistic: "Sum",
          dimensions: {
            ApiName: "ApiGateway",
          },
        }),
      ],
    });
  }

  createAlarmsWidget(): AlarmStatusWidget {
    return new AlarmStatusWidget({
      title: "Alarm Status",
      width: 24,
      alarms: [...this.alarms],
    });
  }
}
