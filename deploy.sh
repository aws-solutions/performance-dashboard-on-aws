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

verify_prereqs() {
    # Verify necessary commands
    echo "node version"
    node --version
    echo "npm version"
    npm --version
    echo "cdk version"
    cdk --version
}

create_build_directories() {
    # CDK complains if the backend/build and frontend/build
    # directories don't exist during synth. So we need to trick
    # CDK by creating empty directories for now. Later on, these
    # directories will be populated by building the backend and 
    # frontend for real.
    mkdir -p $FRONTEND_DIR/build
    mkdir -p $BACKEND_DIR/build
}

deploy_auth() {
    # Deploys the Authentication stack with CDK.
    # Auth stack definition is in cdk/lib/auth-stack.ts
    echo "Deploying auth stack"
    cd $CDK_DIR
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
    # We need to create a .env.production file in the frontend folder
    # with values exported from the backend and auth CDK stacks. 
    # The file createEnvFile.js maps the CDK outputs-backend.json file to 
    # the .env.production file necessary format. The file needs
    # to be called production just because react-scripts treats this
    # as a production build (does minification, transpile, etc).
    # 
    # This process is based on the create-react-app documentation:
    # https://create-react-app.dev/docs/adding-custom-environment-variables
    echo "Creating .env file for frontend"
    dest=$FRONTEND_DIR/.env.production
    source=$CDK_DIR/outputs-backend.json
    node $CDK_DIR/scripts/createEnvFile.js $environment $source $dest

    echo "Building frontend application"
    cd $FRONTEND_DIR
    yarn build

    cd $CDK_DIR
    cdk deploy Frontend
    echo "Deploying frontend stack"
}

# Start execution
verify_prereqs
create_build_directories
deploy_auth
deploy_backend
deploy_frontend
