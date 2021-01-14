# Performance Dashboard on AWS - Backend Service

This package contains the code for the Backend service of PDoA. It is a NodeJS + Express application that serves an HTTP API.

## How to run locally

To run the backend locally from VSCode, create a folder in the root of this repository named `.vscode`. Then create a file inside named `launch.json`. Add the following contents to the file:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Backend",
      "type": "node",
      "request": "launch",
      "runtimeArgs": ["-r", "ts-node/register"],
      "outputCapture": "std",
      "env": {
        "AWS_ACCESS_KEY_ID": "",
        "AWS_SECRET_ACCESS_KEY": "",
        "AWS_SESSION_TOKEN": "",
        "AWS_REGION": "us-west-2",
        "LOCAL_MODE": "true",
        "MAIN_TABLE": "PerformanceDash-${stageName}-Backend-MainTable",
        "DATASETS_BUCKET": "performancedash-${stageName}-${accountNumber}-${region}-datasets",
        "USER_POOL_ID": "${your-user-pool-id}",
        "LOG_LEVEL": "debug",
        "TS_NODE_FILES": "true"
      },
      "args": ["${workspaceRoot}/backend/src/local/server.ts"],
      "cwd": "${workspaceRoot}/backend",
      "skipFiles": ["<node_internals>/**", "node_modules/**"]
    }
  ]
}
```

**Note** Make sure to fill in the correct environment variable values. The AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_SESSION_TOKEN may not be required if you already have credentials in you `~/.aws/credentials` file. For the other values, like MAIN_TABLE, DATASETS_BUCKET and USER_POOL_ID, you'll need to get them from the file `cdk/outputs-backend.json` after you have deployed Performance Dashboard in your AWS account.
