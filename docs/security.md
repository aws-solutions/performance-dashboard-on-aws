# Security and Your Responsibility

Security and compliance is a [shared responsibility](https://aws.amazon.com/compliance/shared-responsibility-model/) between AWS and the customer. AWS is responsible for protecting the infrastructure that runs the AWS services used by Performance Dashboard. The customer is responsible for securing their customer content using the security controls available with Performance Dashboard and the underlying AWS services it's built on. Out of the box, Performance Dashboard is secured through controls such as:

- Access to Performance Dashboard content such as dashboards and data is controlled through user authentication and authorization
- Data stored by Performance Dashboard is encrypted at rest
- Data exchanged between clients and Performance Dashboard is encrypted in transit
- Protection against DDoS attacks
- Customers choose the region in which their customer content will be stored

To further minimize application security risks, we recommend you follow the guidelines outlined in the sections below.

## Securing AWS Account

Customers run Performance Dashboard in their own AWS accounts. Customers are responsible for securing their accounts and resources according to AWS [best practices](https://aws.amazon.com/premiumsupport/knowledge-center/security-best-practices/).

## Limit Access to Administrative Functions

To create dashboards and perform other administrative functions, a user must be granted the Editor role and authenticate in order to access the Performance Dashboard. To reduce the threat of attackers from outside your organization attempting to login to Performance Dashboard, you can [block access](./on-prem_access.md) to the **/admin** path to only come from your on-premises network.

## Use Public Data Only

You are responsible for the data that you choose to use with your dashboards. Performance Dashboard is intended to be used with public data, and you should not use sensitive or classified data with it. You should also not use data with PII and PHI information to display in your dashboards.
