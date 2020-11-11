# Scalability of the Performance Dashboard on AWS

Performance Dashboard on AWS is built with a Serverless architecture, which provides huge benefits when it comes to scalability, redundancy and fault-tolerance. Serverless services automatically scale based on demand and automatically span across Availability Zones which provides redundancy for better fault tolerance. However, as with any AWS service, there are [Quotas](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html) that you should be aware of because they will determine the scaling limits of an application. The 2 main components that are independently deployable are the **Frontend** (static website) and the **Backend** (api, database). This document describes the scalability aspects of both components.

![arch](./images/architecture.svg)

## Scaling the Frontend

The Frontend is a static website, also known as a [Single Page Application](https://developer.mozilla.org/en-US/docs/Glossary/SPA), composed of HTML, JavaScript and CSS files. These files are stored in an S3 bucket that is fronted by a CloudFront distribution. End users accessing the Performance Dashboard load the static website on their browser by hitting the CloudFront distribution URL. CloudFront then serves the content from the [edge location with the lowest latency](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html) to the user. If the content is not in that edge location already, CloudFront retrieves it from the S3 bucket.

Generally speaking, the Frontend should not be the bottleneck for scalability of the Performance Dashboard. There is a lot of room for scalability there as the default quota for a CloudFront distribution is currently 250,000 requests per second and it can be increased if necessary: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html.

## Scaling the Backend

The Backend is composed by 3 sub-components: The API (runs on Amazon API Gateway), a NodeJS application (runs on AWS Lambda) and the database (using Amazon DynamoDB). The three services are Serverless and automatically scale on-demand. However, you should be aware of the following quotas:

| Service     | Quota                 | Default Value | Can be Increased? |
| ----------- | --------------------- | ------------- | ----------------- |
| API Gateway | Requests per Second   | 10,000        | Yes               |
| Lambda      | Concurrent Executions | 1,000         | Yes               |

You can find more information about API Gateway quotas here: https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html and Lambda quotas here https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html. We also recommend you reading the [Lambda Scaling behavior](https://docs.aws.amazon.com/lambda/latest/dg/invocation-scaling.html) to understand the details of how the service scales.

## Load Testing Benchmark

We have done load testing excercises to provide some concrete numbers that hopefully will serve as reference to understand how the Performance Dashboard scales.

> **Note** Our benchmark considers that the Performanace Dashboard is the only application deployed in an AWS account. Having other applications deployed on the same account and in the same region may impact your experience because AWS Quotas are shared across all applications in the account and region.

> **Also note** that the following numbers are just guidance and not a guarantee. They are the result of the load testing we have done ourselves, but we recommend you do your own load testing on your Performance Dashboard installation so you can get more accurate numbers for your specific situation.

### Benchmark Results

We experienced a P99 latency for backend requests to be 255ms. In other words, 99% of the requests to the backend finished in less than 255ms. This means that a single instance of a Lambda function can roughly handle 3.9 requests per second (RPS). So, in an AWS Account with the default quota of 1,000 concurrent Lambda executions, we observed that a load of 3,000 RPS to the Performance Dashboard was handled without any throttles or errors. In our benchmark, throttles started ocurring right after we passed that threshold of 3,000 RPS.

In conclusion, if you plan to serve more than 3,000 requests per second, consider requesting an increase of the [AWS Lambda Concurrent Executions quota](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) for your account. And if you plan to serve more than 10,000 requests per second, consider requesting an increase of the [API Gateway RPS quota](https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html) as well.
