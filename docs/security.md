# Security and Your Responsibility

Security and compliance is a [shared responsibility](https://aws.amazon.com/compliance/shared-responsibility-model/) between AWS and the customer. AWS is responsible for protecting the infrastructure that runs the AWS services used by Performance Dashboard on AWS (PDoA). The customer is responsible for securing their customer content using the security controls available with PDoA and the underlying AWS services it's built on. Out of the box, PDoA is secured through controls such as:

- Access to content such as dashboards and data is controlled through user authentication and authorization.
- Data stored by PDoA is encrypted at rest.
- Data exchanged between clients and PDoA is encrypted in transit.
- Protection against DDoS attacks.
- Customers choose the region in which their customer content will be stored.

To further minimize application security risks, we recommend you follow the guidelines outlined in the sections below.

## Securing AWS Account

Customers run Performance Dashboard on AWS in their own AWS accounts. Customers are responsible for securing their accounts and resources according to AWS [best practices](https://aws.amazon.com/premiumsupport/knowledge-center/security-best-practices/).

## Limit Access to Administrative Functions

To create dashboards and perform other administrative functions, a user must be granted the Editor role and authenticate in order to access the Performance Dashboard on AWS. To reduce the threat of attackers from outside your organization attempting to login, you can [block access](./on-prem-access.md) to the **/admin** path to only come from your on-premises network.

## Publish data responsibly

You are responsible for the data you choose to use with your dashboards, where they are hosted, and who has access to them. You should not use data with PII and PHI information to display in public dashboards.
