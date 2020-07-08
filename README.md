# Badger

Badger is an AWS solution for governments to build and deploy Performance Dashboards on AWS. It sets the framework and infrastructure to create and manage a webpage similar to UK’s performance dashboard: https://www.gov.uk/performance. This project will be open sourced on GitHub and is being built by the GTT team: https://w.amazon.com/index.php/WWPS_Government_TransformationTeam.

## Setup development environment

This repository is a monorepo that includes 3 different applications: Backend, Frontend and CDK. The three of them are written in Typescript but each has it's own set of dependencies (package.json) and they get built, packaged and deployed independently. The only reason for having them in a monorepo is because this code will be published on GitHub and it will be easier for customers to find all related packages in the same repo rather than keeping track of multiple repositories. 

### Requirements

- Install NodeJS v12+ from https://nodejs.org/en/download.  
- Install AWS CDK by running `npm install -g aws-cdk`.  
- Install Yarn by running `brew install yarn`.  

The following instructions assume that you have local AWS credentials in your `~/.aws/credentials` file for your personal Isengard account.

### Setup

You can clone this repo using Brazil by running the following commands: 

```bash
brazil ws create --name badger
cd badger
brazil ws use --package AWS-WWPS-GTT-Badger
cd src/AWS-WWPS-GTT-Badger
```

Make the scripts executable: 

```bash
chmod +x install.sh
chmod +x deploy.sh
```

### Install

Run the install script to download npm dependencies for each application.

```bash
./install.sh
```

### Deploy

The deploy command will use the AWS CDK CLI to deploy 3 CloudFormation stacks named: `Badger-env-Backend`, `Badger-env-Frontend` and `Badger-env-Auth` in the default AWS region that you have configured in your `~/.aws/config` file. If you want CDK to deploy to a specific region, you can set the environment variable `export AWS_REGION=us-west-2` before running the following command:

```bash
./deploy.sh fdingler # Replace with your alias, it will be taken as the environment name
```

### Run locally

To run the backend server locally: 

```bash
cd backend
npm run local # It starts an express.js server locally

# You should see Listening on port 8080
```

To run the React frontend locally, first create a `.env.local` file in the root of the `frontend` folder. This will contain the environment variables for the React app, you can copy the contents of the file from the `.env.production` file that got created after deploying your personal stack.

```bash
cd frontend
yarn start

# You can now open the app on http://localhost:3000
```

### Debugging on VSCode

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