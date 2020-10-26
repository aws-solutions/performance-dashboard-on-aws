# Installing Performance Dashboard

## Using AWS CloudFormation Template (CFT)

## Using AWS Cloud Development Kit (CDK)

# Configuring Performance Dashboard

## Domain Name and Certificate

## User Management

### Customize Email Invite

When you create a new user in the Performance Dashboard Amazon Cognito user pool, Cognito will send an email to invite that user to login to Performance Dashboard. A default invite email template is provided, which you can customize to suit your organization. To customize, edit the file **cdk/lib/data/email-template-html** and make the changes below:

- Open **cdk/lib/data/email-template-html** in your editor
- Replace the placeholder values enclosed within "{}" with your own:
  - {Organization} - replace with your organization name
  - {Administrator} - replace with the name of person sending the invite
  - {Your Domain} - replace with your domain name
  - {username} and {####} - the username and temporary password created by Cognito. Don't replace these, leave them as is

After making the edits, install your changes using CDK. See the section above on installing Performance Dashboard using CDK.

## Manage Topic Areas
