# Installing Performance Dashboard

## Using AWS CloudFormation Template (CFT)

## Using AWS Cloud Development Kit (CDK)

# Configuring Performance Dashboard

## Domain Name and Certificate

## User Management

### Customize Email Invite

When you create a new user in the Performance Dashboard Amazon Cognito user pool, Cognito will send an email to invite that user to login to Performance Dashboard. A default invite email template is provided, which you can customize to suit your organization. To customize, if using CloudFormation to install Performance Dashboard, edit the file **cdk/cloudformation/auth-stack.json** and make the changes below:

- Open **cdk/cloudformation/auth-stack.json** in your editor
- Look for the resource of type AWS::Cognito::UserPool
- Look for the InviteMessageTemplate section in that resource
- Edit the EmailSubject and EmailTemplate fields, replacing the placeholder values enclosed within "{}" with your own:
  - {Organization} - replace with your organization name
  - {Administrator} - replace with the name of person sending the invite
  - {Your Domain} - replace with your domain name

After making the edits, install your changes using CloudFormation. See the section above on installing Performance Dashboard using CloudFormation.

If you prefer to use CDK, you can make similar edits to the file **cdk/lib/data/email-template-html**, replacing the placeholder values enclosed within "{}" with your own. After making the edits, install your changes using CDK. See the section above on installing Performance Dashboard using CDK.

## Manage Topic Areas
