/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
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
    HorizontalAnnotation,
} from "aws-cdk-lib/aws-cloudwatch";
import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import { Key } from "aws-cdk-lib/aws-kms";

interface Props extends StackProps {
    privateApiFunction: Function;
    publicApiFunction: Function;
    dynamodbStreamsFunction: Function;
    restApi: RestApi;
    mainTable: Table;
    auditTrailTable: Table;
    environment: string;
}

const ENABLE_ALARM_SNS_NOTIFICATIONS = true;
const LAMBDA_ALARMS_EVALUATION_PERIOD_MINUTES = 5;
const LAMBDA_ALARMS_EVALUATION_PERIODS = 2;
const DASHBOARD_AGGREGATION_PERIOD_MINUTES = 5;
const DASHBOARD_WIDGET_HEIGHT = 9;
const DASHBOARD_DEFAULT_PERIOD = "-PT12H";
const LAMBDA_THROTTLE_THRESHOLD = 10;

export class OpsStack extends Stack {
    private readonly opsNotifications: Topic;
    private readonly props: Props;
    private readonly alarms: Alarm[];

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        this.props = props;
        this.alarms = [];

        const targetKmsKey = new Key(this, "PDoA", {
            enableKeyRotation: true,
        });
        targetKmsKey.addAlias(`PDoA/OpsNotifications-${props.environment}`);

        this.opsNotifications = new Topic(this, "OpsNotifications", {
            masterKey: targetKmsKey,
        });

        this.createLambdaAlarms("PrivateApiFunction", props.privateApiFunction);
        this.createLambdaAlarms("PublicApiFunction", props.publicApiFunction);
        this.createLambdaAlarms("DynamoDBStreamsFunction", props.dynamodbStreamsFunction);
        this.createOpsDashboard();

        new CfnOutput(this, "OpsNotificationsTopic", {
            value: this.opsNotifications.topicArn,
        });
    }

    createLambdaAlarms(id: string, lambdaFunction: Function) {
        const invocations = new Metric({
            namespace: "AWS/Lambda",
            metricName: "Invocations",
            statistic: "Sum",
            dimensionsMap: {
                FunctionName: lambdaFunction.functionName,
            },
        });

        const errors = new Metric({
            namespace: "AWS/Lambda",
            metricName: "Errors",
            statistic: "Sum",
            dimensionsMap: {
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
                period: Duration.minutes(LAMBDA_ALARMS_EVALUATION_PERIOD_MINUTES),
            }),
        });

        const throttlesAlarm = new Alarm(this, id.concat("ThrottleRateAlarm"), {
            alarmDescription: "At least 10 Lambda invocations were throttled",
            evaluationPeriods: LAMBDA_ALARMS_EVALUATION_PERIODS,
            threshold: LAMBDA_THROTTLE_THRESHOLD,
            actionsEnabled: ENABLE_ALARM_SNS_NOTIFICATIONS,
            treatMissingData: TreatMissingData.NOT_BREACHING,
            comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            metric: new Metric({
                namespace: "AWS/Lambda",
                metricName: "Throttles",
                statistic: "Sum",
                dimensionsMap: {
                    FunctionName: lambdaFunction.functionName,
                },
            }).with({
                period: Duration.minutes(LAMBDA_ALARMS_EVALUATION_PERIOD_MINUTES),
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
            "Admin Users",
        );

        const publicApiInvocations = this.createLambdaInvocationsWidget(
            this.props.publicApiFunction,
            "Public Users",
        );

        const dynamodbStreamsInvocations = this.createLambdaInvocationsWidget(
            this.props.dynamodbStreamsFunction,
            "DynamoDB Streams Processor",
            24,
        );

        const mainTableLatency = this.createDynamoDBLatencyWidget(
            this.props.mainTable,
            "DynamoDB Main Table - Latency by Request Type",
        );

        const mainTableErrors = this.createDynamoDBErrorsWidget(
            this.props.mainTable,
            "DynamoDB Main Table - Errors",
        );

        const auditTrailTableLatency = this.createDynamoDBLatencyWidget(
            this.props.mainTable,
            "DynamoDB Audit Trail Table - Latency by Request Type",
        );

        const auditTrailTableErrors = this.createDynamoDBErrorsWidget(
            this.props.mainTable,
            "DynamoDB Audit Trail Table - Errors",
        );

        dashboard.addWidgets(alarmsWidget);
        dashboard.addWidgets(apiLatencyAggregated, apiRequestsAggregated, apiErrorsAggregated);
        dashboard.addWidgets(apiRequests);
        dashboard.addWidgets(apiLatency);
        dashboard.addWidgets(privateApiInvocations, publicApiInvocations);
        dashboard.addWidgets(dynamodbStreamsInvocations);
        dashboard.addWidgets(mainTableLatency);
        dashboard.addWidgets(mainTableErrors);
        dashboard.addWidgets(auditTrailTableLatency);
        dashboard.addWidgets(auditTrailTableErrors);

        return dashboard;
    }

    createLambdaInvocationsWidget(
        lambdaFunction: Function,
        label: string,
        width: number = 12,
    ): GraphWidget {
        const horizontalAnnotation: HorizontalAnnotation = {
            value: LAMBDA_THROTTLE_THRESHOLD,
            color: Color.ORANGE,
            visible: true,
            label: "Throttle",
        };
        return new GraphWidget({
            title: `Lambda Invocations - ${label}`,
            width,
            height: DASHBOARD_WIDGET_HEIGHT,
            leftAnnotations: [horizontalAnnotation],
            left: [
                new Metric({
                    namespace: "AWS/Lambda",
                    metricName: "Invocations",
                    statistic: "Sum",
                    color: Color.GREEN,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        FunctionName: lambdaFunction.functionName,
                    },
                }),
                new Metric({
                    namespace: "AWS/Lambda",
                    metricName: "Errors",
                    statistic: "Sum",
                    color: Color.RED,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        FunctionName: lambdaFunction.functionName,
                    },
                }),
                new Metric({
                    namespace: "AWS/Lambda",
                    metricName: "Throttles",
                    statistic: "Sum",
                    color: Color.ORANGE,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        FunctionName: lambdaFunction.functionName,
                    },
                }),
                new Metric({
                    namespace: "AWS/Lambda",
                    metricName: "ConcurrentExecutions",
                    statistic: "Maximum",
                    color: Color.PURPLE,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
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
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        ApiName: "ApiGateway",
                    },
                }),
                new Metric({
                    namespace: "AWS/ApiGateway",
                    metricName: "4XXError",
                    statistic: "sum",
                    color: Color.ORANGE,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        ApiName: "ApiGateway",
                    },
                }),
                new Metric({
                    namespace: "AWS/ApiGateway",
                    metricName: "5XXError",
                    statistic: "sum",
                    color: Color.RED,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
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
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        ApiName: "ApiGateway",
                    },
                }),
                new Metric({
                    namespace: "AWS/ApiGateway",
                    metricName: "Latency",
                    statistic: "p99",
                    color: Color.PURPLE,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        ApiName: "ApiGateway",
                    },
                }),
            ],
        });
    }

    createDynamoDBLatencyWidget(table: Table, title: string): GraphWidget {
        return new GraphWidget({
            title: title,
            width: 24,
            height: DASHBOARD_WIDGET_HEIGHT,
            left: [
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "SuccessfulRequestLatency",
                    statistic: "Average",
                    color: Color.BLUE,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                        Operation: "Query",
                    },
                }),
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "SuccessfulRequestLatency",
                    statistic: "Average",
                    color: Color.ORANGE,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                        Operation: "PutItem",
                    },
                }),
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "SuccessfulRequestLatency",
                    statistic: "Average",
                    color: Color.GREEN,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                        Operation: "GetItem",
                    },
                }),
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "SuccessfulRequestLatency",
                    statistic: "Average",
                    color: Color.PURPLE,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                        Operation: "UpdateItem",
                    },
                }),
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "SuccessfulRequestLatency",
                    statistic: "Average",
                    color: Color.PINK,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                        Operation: "DeleteItem",
                    },
                }),
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "SuccessfulRequestLatency",
                    statistic: "Average",
                    color: Color.GREY,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                        Operation: "TransactWriteItems",
                    },
                }),
            ],
        });
    }

    createDynamoDBErrorsWidget(table: Table, title: string): GraphWidget {
        return new GraphWidget({
            title: title,
            width: 24,
            height: DASHBOARD_WIDGET_HEIGHT,
            left: [
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "ThrottledRequests",
                    statistic: "Sum",
                    color: Color.ORANGE,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                        Operation: "GetItem",
                    },
                }),
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "ThrottledRequests",
                    statistic: "Sum",
                    color: Color.PINK,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                        Operation: "Query",
                    },
                }),
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "SystemErrors",
                    statistic: "Sum",
                    color: Color.RED,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
                        TableName: table.tableName,
                    },
                }),
                new Metric({
                    namespace: "AWS/DynamoDB",
                    metricName: "UserErrors",
                    statistic: "Sum",
                    color: Color.RED,
                    period: Duration.minutes(DASHBOARD_AGGREGATION_PERIOD_MINUTES),
                    dimensionsMap: {
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
                    dimensionsMap: {
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
                    dimensionsMap: {
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
                    dimensionsMap: {
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
