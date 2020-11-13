# Runbook

This runbook describes procedures for a technical operator (TechOps) to troubleshoot issues with the Performance Dashboard.

## The Ops Dashboard

The purpose of the operations dashboard is to serve as a single pane of glass to look at the current health of the Performance Dashboard infrastructure. We recommend to start looking at the dashboard as the first step to troubleshoot an issue. You will find it by opening your CloudWatch console: https://console.aws.amazon.com/cloudwatch/home#dashboards: and click on the dashboard with a similar name to this: `OpsDashboardCE408D93-bldvfxWYfBUH`.

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
