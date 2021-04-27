# Using the APIs

Performance Dashboard on AWS (PDoA) has private APIs called by the web front end component to access the AWS Lambda functions that perform the application functions, and also a public Data Ingestion API that can be used by external parties to upload datasets to be used with dashboards. All the APIs are documented in this [OpenAPI specification](../backend/postman/openapi.yaml). You can use the specification to configure your API client for calling the Data Ingestion API.

## Data Ingestion API

### Enabling the API

After deploying PDoA, the Dataset Ingest API is restricted from being called from any IP address by default. To enable the Dataset Ingest API to be called from an allowed CIDR range, go to the Amazon API Gateway console, click on the PDoA API (named "APIGateway"), then on Resource Policy, then edit the following policy:
{
"Effect": "Deny",
"Principal": "_",
"Action": "execute-api:Invoke",
"Resource": "arn:aws:execute-api:<region>:<account id>:<name>/prod/_/ingestapi/\*",
"Condition": {
"IpAddress": {
"aws:SourceIp": "0.0.0.0/0"
}
}
}
Change the Deny clause to Allow, and replace the “0.0.0.0/0” value with an allowed CIDR range.

In place of the API Gateway resource policy (or in conjunction with), you can control access to the Dataset Ingest API using techniques such as the following:

- Use the AWS WAF to enable an allow-list of IP range that API calls can originate from. The WAF can also be setup with rules to prevent common web attacks.
- Use mutual TLS with the API G/W to allow calls from trusted parties only
- Configure the API to be private using VPC endpoint to limit access to callers within a particular VPC or on-premises connecting via Direct Connect
- Control access with IAM permissions

### API Key

The Dataset Ingest API is configured to require an API key passed in the AWS-API-KEY HTTP header field on every call, or else the call is rejected. By default, PDoA installs an API key with API Gateway for this API with a usage plan of 25 requests per second, and a burst of 50 requests. The Usage Plan is named “PerfDashIngestUsagePlan”. To retrieve the API key configured for the API, go the AWS Console for API Gateway, and select the "ApiGateway" API configured for PDoA. Next, select the API Keys option in the left menu bar. Click on the API Key that begins with "Perfo-ApiGa-", then copy the API key value.

### Using the API

Use the provided [OpenAPI specification](../backend/postman/openapi.yaml) to configure your client to call the Data Ingestion API. The next sections provide some examples of calling the Data Ingestion API.

#### Example - Creating New Dataset

The below service call will create a new dataset. This programmatically mirrors the user experience of uploading datasets via the user interface (UI). Upon successfully making this POST call, the dataset will be available in the UI as a dynamic dataset when creating a chart or table. Selecting a dynamic dataset will link the API-produced dataset to a chart and table in a dashboard.

```
POST: {YourBaseURL}/ingestapi/dataset – create a dataset with the following payload:
{
    "metadata": {
       "name": "New dataset",
        "type": "/json "
    },
    "data": [
        {
            "Date": "1/25/2021",
            "Emails": 2290973,
            "Letters": 122180,
            "Text Message": 2027903
        },
        {
            "Date": "1/26/2021",
            "Emails": 2962568,
            "Letters": 251346,
            "Text Message": 1578929
        },
        {
            "Date": "1/27/2021",
            "Emails": 3173257,
            "Letters": 81658,
            "Text Message": 1918500
        },
        {
            "Date": "1/28/2021",
            "Emails": 3971402,
            "Letters": 21165,
            "Text Message": 2398909
        },
        {
            "Date": "1/29/2021",
            "Emails": 3952829,
            "Letters": 178913,
            "Text Message": 2007563
        }
    ]
}
```

#### Example - Updating Existing Dataset

The below service call will update the existing dataset created above. This acts as a replacement, not an append. Upon the successful PUT call, the dataset will now be composed of the data included in your PUT call’s payload. Any existing chart or table linked to this dataset will automatically reflect the new data in their dashboard. There are no manual actions to take in the UI for the associated dashboards to be updated. The below example updates the dataset to include the existing date and notifications, but adds data for 1/30/2021 and revises the dataset name from “New dataset” to “Notification Type Running Totals”. You must include the dataset ID that you want to update in the PUT URL.

```
PUT: {YourBaseURL}/ingestapi/dataset/<datasetId>
{
    "metadata": {
        "name": "Notification Type Running Totals",
        "type": "json"
    },
    "data": [
        {
            "Date": "1/25/2021",
            "Emails": 2290973,
            "Letters": 122180,
            "Text Message": 2027903
        },
        {
            "Date": "1/26/2021",
            "Emails": 2962568,
            "Letters": 251346,
            "Text Message": 1578929
        },
        {
            "Date": "1/27/2021",
            "Emails": 3173257,
            "Letters": 81658,
            "Text Message": 1918500
        },
        {
            "Date": "1/28/2021",
            "Emails": 3971402,
            "Letters": 21165,
            "Text Message": 2398909
        },
        {
            "Date": "1/29/2021",
            "Emails": 3952829,
            "Letters": 178913,
            "Text Message": 2007563
        },
        {
            "Date": "1/30/2021",
            "Emails": 2081055,
            "Letters": 7039,
            "Text Message": 1434438
        }
    ]
}
```
