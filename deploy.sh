#!/bin/bash
set -e

# Set workspace paths
WORKSPACE=$(pwd)
CDK_DIR=$WORKSPACE/cdk
FRONTEND_DIR=$WORKSPACE/frontend
BACKEND_DIR=$WORKSPACE/backend

# Validate environment name from input
environment=$1
if [ "$environment" != "" ]; then
    echo "Environment = $environment"
    export CDK_ENV_NAME=$environment
else
    echo "Please specify environment name as first argument (i.e. dev)"
    exit 0
fi

list_cdk_stacks() {
    echo "CDK Stacks Available"
    cd $CDK_DIR
    cdk list
}

deploy_auth() {
    echo "Deploying auth stack"
    cdk deploy Auth
}

deploy_backend() {
    echo "Building backend application"
    cd $BACKEND_DIR
    npm run build
    cd $CDK_DIR
    echo "Deploying backend stack"
    cdk deploy Backend --outputs-file outputs-backend.json
}

deploy_frontend() {
    # We need to create a .env file in the frontend folder with values
    # exported from the backend and auth stacks. The file createEnvFile.js
    # maps the CDK outputs.json file to the .env file necessary format.
    # 
    # We then set the environment variable NODE_ENV with the environment name
    # and react-scripts will load the corresponding .env file at build time.
    # 
    # This process is based on the create-react-app documentation:
    #
    # https://create-react-app.dev/docs/adding-custom-environment-variables
    echo "Creating .env file for frontend"
    dest=$FRONTEND_DIR/.env.$environment
    node $CDK_DIR/scripts/createEnvFile.js $environment $dest

    echo "Building frontend app"
    cd $FRONTEND_DIR
    export NODE_ENV=$environment
    yarn build

    cd $CDK_DIR
    cdk deploy Frontend
    echo "Deploying frontend stack"
}

# Start execution
list_cdk_stacks
deploy_auth
deploy_backend
deploy_frontend