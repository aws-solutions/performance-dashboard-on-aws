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

deploy_auth() {
    # Deploys the Authentication stack with CDK.
    # Auth stack definition is in cdk/lib/auth-stack.ts
    echo "Deploying auth stack"
    cd $CDK_DIR

    if [ "$CDK_ADMIN_EMAIL" != "" ]; then
        npm run cdk -- deploy Auth --require-approval never --parameters adminEmail=$CDK_ADMIN_EMAIL
    else
        npm run cdk -- deploy Auth --require-approval never
    fi
}

deploy_backend() {
    cd $CDK_DIR
    echo "Deploying backend stack"
    npm run cdk -- deploy Backend --require-approval never --outputs-file outputs-backend.json
}

deploy_frontend() {
    cd $CDK_DIR
    npm run cdk -- deploy Frontend --require-approval never
    echo "Deploying frontend stack"
}

deploy_ops() {
    echo "Deploying ops stack"
    cd $CDK_DIR
    npm run cdk -- deploy Ops --require-approval never
}

# Start execution
deploy_auth
deploy_backend
deploy_frontend
deploy_ops
