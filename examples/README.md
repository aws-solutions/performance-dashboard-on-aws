# Examples Tools

This tools is created to help with the import/export of dashboard and use it as template to populate data on deployment.

## Export

The exporting step is designed to download a template from a live instance. For example, you configured a dashboard that have all the properties you are expecting then you can use the **export** tool to create a template. The template will be added to the [resources folder](./resources) and from there you can import an instance locally or using the examples lambda created after the deployment.

### How to export using the cli

```shell
export AWS_PROFILE=<value>
export AWS_REGION=<value>
export MAIN_TABLE=<value>
export DATASETS_BUCKET=<value>
export USER_EMAIL=<value>
npm install
npm run export

Welcome to Performance Dashboard on AWS Export Tool
✔ What is the template name? … template
✔ Which dashboard you want to export? … dashboardId
-----
exported dashboard: {}

```

## Import

The importing step will deploy an existing template to a live instance. For example, you need seed some dashboard in certain state. In this case you will run the **import** tool to create new dashboards.

### How to import using the cli

```shell
export AWS_PROFILE=<value>
export AWS_REGION=<value>
export MAIN_TABLE=<value>
export DATASETS_BUCKET=<value>
export EXAMPLES_BUCKET=<value>
export USER_EMAIL=<value>
npm install
npm run import

Welcome to Performance Dashboard on AWS Import Tool
✔ Which template you want to install? › english
✔ Do you want to use the default config? … yes
Using default config: {} {
  example: 'english',
  author: 'some@example.comom',
  reuseTopicArea: true,
  reuseDashboard: false,
  reuseDataset: false
}
-----
dashboard created

```

### How to import using example lambda

1- Go to your AWS account and look for the lambda with Examples in the name (Ex: PerformanceDash-dev-Dashb-SetupExampleDashboardLam-1pJMkoglwsTa)

2- Go to the configuration tab and edit the example you want to deploy.

3- Trigger the function with empty parameters

## Debug Locally

You can debug locally by running `/examples/src/cli.ts` using VSCode and the following config

.vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Import",
      "request": "launch",
      "command": "npm run import",
      "envFile": "${workspaceFolder}/.vscode/.env",
      "cwd": "${workspaceRoot}/examples",
      "type": "node-terminal",
      "restart": true,
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        "!**/node_modules/**"
      ]
    },
    {
      "name": "Export",
      "request": "launch",
      "command": "npm run export",
      "envFile": "${workspaceFolder}/.vscode/.env",
      "cwd": "${workspaceRoot}/examples",
      "type": "node-terminal",
      "restart": true,
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        "!**/node_modules/**"
      ]
    }
  ]
}
```

.vscode/.env

```
AWS_REGION=<value>
MAIN_TABLE=<value>
DATASETS_BUCKET=<value>
EXAMPLES_BUCKET=<value>
USER_EMAIL=<value>

# AWS CLI Credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SESSION_TOKEN=

```

### Tests

Tests can be run with `npm run test` or `npm run test:ci`
