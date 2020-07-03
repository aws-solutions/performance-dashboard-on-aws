## Requirements

- NodeJS v12+ (https://nodejs.org/en/download)
- CDK (npm install -g aws-cdk)
- Yarn (brew install yarn)
- AWS Credentials ([How to setup local credentials](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html))

## Frontend

Install dependencies

```
cd frontend
yarn install
```

To run the frontend app locally:

```
yarn start
```

To deploy the frontend to your AWS account, build it first:

```
npm run build
```

Then go into cdk folder and deploy from there:

```
cd ../cdk
npm install
npm run deploy:personal Frontend
```

## Backend

Install dependencies

```
cd backend
npm install
```

To run the backend locally: 

```
npm run local
```

To deploy the backend to your AWS account the first time:

```
cd ../cdk
npm install
npm run deploy:personal Backend
```

## Debugging on VSCode

Create a directory in the root of this project called `.vscode` and then a file inside called `launch.json`. Add the following content to the file: 

```
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Backend",
        "type": "node",
        "request": "launch",
        "runtimeArgs": ["-r", "ts-node/register"],
        "args": ["${workspaceRoot}/backend/src/local/server.ts"],
        "cwd": "${workspaceRoot}/backend",
        "skipFiles": ["<node_internals>/**", "node_modules/**"]
      }
    ]
}
```

You will be able to run the local backend server from vscode so you can set breakpoints.