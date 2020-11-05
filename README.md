# Performance Dashboard on AWS

![Unit Tests](https://github.com/awslabs/performance-dashboard-on-aws/workflows/Unit%20Tests/badge.svg?branch=mainline)

Performance Dashboard on AWS is a solution for national, municipal, and local governments to publish and visualize their data, so it can be easily shared internally and externally. This cost-effective solution presents digital service performance and other metrics in an accessible, clear, and open way. Performance Dashboard on AWS allows users to customize dashboards to visually demonstrate efficiencies achieved such as the processing of driver license applications or how citizenship statistics have changed over time. Dashboards clearly present performance data to meet the needs of data users including digital leaders, service owners, and the public.

Below are a few key features:
- Users can configure dashoards to visualize data in easy-to-understand ways through the use of charts and tables. The pairing of modern data visualizations and text features help governments share their data-driven findings.
- A supportive workflow guides users through dashboard creation step-by-step, from creating an initial draft to archiving a published dashboard.
- Built with AWS serverless technology, the system is designed to keep costs at a minimum by only incurring costs when your dashboard is actively being used.

To access additional details on the system's features and workflows, please view the user guide.

Performance Dashboard on AWS is setup by running its CloudFormation template. This will create an instantiation of the solution. The architecture diagram provides an overview of what will be built:

<p align="center">
  <img src="docs/images/architecture.svg" alt="Architecture diagram">
</p>

## Deployment

This repository is a monorepo that includes 3 different applications: Backend, Frontend and CDK. The three of them are written in Typescript but each has it's own set of dependencies (package.json) and they get built, packaged and deployed independently.

### Requirements

- [Node.js 12](https://nodejs.org/en/download)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [An AWS Account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)

The following instructions assume that you have local AWS credentials in `~/.aws/credentials` file with IAM permissions to launch CloudFormation stacks.

### 1. Clone this repository

```bash
git clone https://github.com/awslabs/performance-dashboard-on-aws.git
cd performance-dashboard-on-aws
```

Make the installation and deployment scripts executable:

```bash
chmod +x install.sh
chmod +x deploy.sh
chmod +x test.sh
```

Bootstrap AWS CDK for the first time in your AWS account by running the following commands:

```bash
# Need to bootstrap us-east-1 for Lambda@Edge
cdk bootstrap aws://AWS-Account-ID/us-east-1

# Also boostrap the region you plan to deploy to
cdk bootstrap aws://AWS-Account-ID/desired-region
```

### 2. Install

Run the install script to download npm dependencies.

```bash
./install.sh
```

(Optional) Run the unit tests to make sure everything is in order.

```bash
./test.sh
```

### 3. Deploy

The deploy script will use the AWS CDK to deploy 3 CloudFormation stacks named: `PerformanceDash-{env}-Backend`, `PerformanceDash-{env}-Frontend` and `PerformanceDash-{env}-Auth` where `{env}` is the environment name that you specify as parameter to the deployment script. By default, the stacks will be created in the AWS region that you have configured in your `~/.aws/config` file. If you want CDK to deploy to a specific region, you can set the environment variable `export AWS_REGION=us-west-2` before running the deployment script.

To create a `dev` environment for example, you may run the deployment script like so:

```bash
./deploy.sh dev
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## Want to contribute?

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License

This project is licensed under the Apache-2.0 License.
