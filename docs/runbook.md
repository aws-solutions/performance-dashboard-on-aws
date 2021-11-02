# Runbook

This runbook describes procedures for a technical operator (TechOps) to troubleshoot issues with the Performance Dashboard.

## The Ops Dashboard

The purpose of the operations dashboard is to serve as a single pane of glass to look at the current health of the Performance Dashboard infrastructure. We recommend to start looking at the dashboard as the first step to troubleshoot an issue. You will find it by opening your CloudWatch console: https://console.aws.amazon.com/cloudwatch/home#dashboards: and click on the dashboard with a similar name to this: `OpsDashboardCE408D93-bldvfxWYfBUH`. The dashboard has 9 metric graphs and 6 alarms configured with the different errors an operator may face like high latency, slow response, blank pages caused by 4XX or 5XX errors, or database errors:

### Metric Graphs

- API Requests (Here you can see the Count, the 4XX Errors and 5XX Errors)
- API Latency (Here you can see the p50 and p99 latency in milliseconds)
- Lambda Invocations - Admin Users (Here you can see the Invocations, Errors, Throttles and Concurrent Executions)
- Lambda Invocations - Public Users (Here you can see the Invocations, Errors, Throttles and Concurrent Executions)
- Lambda Invocations - DynamoDB Streams Processor (Here you can see the Invocations, Errors, Throttles and Concurrent Executions)
- DynamoDB Main Table - Latency by Request Type (Here you can see the latency in milliseconds for Query, PutItem, GetItem, UpdateItem, DeleteItem and TransactWriteItems requests for the main table)
- DynamoDB Main Table - Errors (Here you can see the GetItem ThrottledRequests, Query ThrottledRequests, SystemErrors and UserErrors for the main table)
- DynamoDB Audit Trail Table - Latency by Request Type (Here you can see the latency in milliseconds for Query, PutItem, GetItem, UpdateItem, DeleteItem and TransactWriteItems requests for the audit trail table)
- DynamoDB Audit Trail Table - Errors (Here you can see the GetItem ThrottledRequests, Query ThrottledRequests, SystemErrors and UserErrors for the audit trail table)

### Alarms

- PrivateApiFunctionErrorRateAlarm (Conditions: Error Rate (%) >= 5 for 2 datapoints within 10 minutes)
- PublicApiFunctionErrorRateAlarm (Conditions: Error Rate (%) >= 5 for 2 datapoints within 10 minutes)
- DynamoDBStreamsFunctionErrorRateAlarm (Conditions: Error Rate (%) >= 5 for 2 datapoints within 10 minutes)
- DynamoDBStreamsFunctionThrottleRateAlarm (Conditions: Throttles >= 10 for 2 datapoints within 10 minutes)
- PublicApiFunctionThrottleRateAlarm (Conditions: Throttles >= 10 for 2 datapoints within 10 minutes)
- PrivateApiFunctionThrottleRateAlarm (Conditions: Throttles >= 10 for 2 datapoints within 10 minutes)

## How to search the logs

As the backend runs on Lambda functions, the logs are automatically shipped to CloudWatch Logs. Follow this steps to browse them:

1. Open the CloudWatch Logs Console: https://console.aws.amazon.com/cloudwatch/home#logsV2:logs-insights.
2. In the _Select Log Group_ dropdown input, type the prefix `/aws/lambda/PerformanceDash-` to filter all the Lambda functions related to Performance Dashboard.
3. Select both log groups that have a name like `PerformanceDash-{stage}-FunctionsPrivateApi` and `PerformanceDash-{stage}-FunctionsPublicApi`. These are the log groups that contain logs related to public and private traffic.
4. In the query textbox, enter the following query:

```sql
fields @timestamp, @message, @logStream
| sort @timestamp desc
| filter @message like /Exception|ERROR|error/
| limit 100
```

Replace the text `/Exception|ERROR|error/` for your desired search query. For example if you are looking for a request related to a specific dashboard ID, you may enter the dashboard UUID in the filter query like so:

```sql
fields @timestamp, @message, @logStream
| sort @timestamp desc
| filter @message like /f9e68a02-5234-44e7-87d2-bb035ed2a9d6/
| limit 100
```

5. Your log results should start appearing shortly if there are matches found.

## How to contact AWS support

You can contact AWS Support [here](https://aws.amazon.com/contact-us/).
