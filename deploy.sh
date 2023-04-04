#!/bin/bash
set -e

# Set workspace paths
WORKSPACE=$(pwd)
CDK_DIR=$WORKSPACE/cdk
FRONTEND_DIR=$WORKSPACE/frontend
BACKEND_DIR=$WORKSPACE/backend
EXAMPLES_DIR=$WORKSPACE/examples

# Validate environment name from input
environment=$1
if [ "$environment" != "" ]; then
    echo "Environment = $environment"
    export CDK_ENV_NAME=$environment
else
    echo "Please specify environment name as first argument (i.e. dev)"
    exit 0
fi

exampleLanguage=${2:-english}
if [ "$exampleLanguage" != "" ]; then
    echo "Example Language = $exampleLanguage"
else
    echo "Please specify an example language name as second argument (i.e. english|spanish|portuguese)"
    exit 0
fi

authenticationRequired=${3:-no}
if [ "$authenticationRequired" != "" ]; then
    echo "Authentication Required = $authenticationRequired"
    export AUTHENTICATION_REQUIRED=$authenticationRequired
else
    echo "Please specify if authentication is required (true|false)"
    exit 0
fi

verify_prereqs() {
    # Verify necessary commands
    echo "node version"
    node --version
    echo "npm version"
    npm --version
    echo "cdk version"
    $CDK_DIR/node_modules/aws-cdk/bin/cdk --version
}

create_build_directories() {
    # CDK complains if the backend/build, frontend/build, and examples/build
    # directories don't exist during synth. So we need to trick
    # CDK by creating empty directories for now. Later on, these
    # directories will be populated by building the backend and 
    # frontend for real.
    mkdir -p $FRONTEND_DIR/build
    mkdir -p $BACKEND_DIR/build
    mkdir -p $EXAMPLES_DIR/build
}

deploy_auth() {
    # Deploys the Authentication stack with CDK.
    # Auth stack definition is in cdk/lib/auth-stack.ts
    echo "Deploying auth stack"
    cd $CDK_DIR
    npm run cdk -- deploy Auth --require-approval never --parameters authenticationRequired=$authenticationRequired
}

deploy_authz() {
    # Deploys the Authorization stack with CDK.
    # Authz stack definition is in cdk/lib/authz-stack.ts
    echo "Deploying authz stack"
    cd $CDK_DIR

    if [ "$CDK_ADMIN_EMAIL" != "" ]; then
        npm run cdk -- deploy Authz --require-approval never --parameters  PerformanceDash-${environment}-Authz:adminEmail=$CDK_ADMIN_EMAIL --parameters authenticationRequired=$authenticationRequired
    else
        npm run cdk -- deploy Authz --require-approval never --parameters authenticationRequired=$authenticationRequired
    fi
}

deploy_backend() {
    echo "Building backend application"
    cd $BACKEND_DIR
    npm run build

    cd $CDK_DIR
    echo "Deploying backend stack"
    npm run cdk -- deploy Backend --require-approval never --outputs-file outputs-backend.json --parameters authenticationRequired=$authenticationRequired
}

deploy_frontend() {
    echo "Building frontend application"
    cd $FRONTEND_DIR
    npm run build

    cd $CDK_DIR
    echo "Deploying frontend stack"
    npm run cdk -- deploy Frontend --require-approval never
}

deploy_frontendConfig() {
    cd $CDK_DIR
    echo "Deploying frontendConfig stack"
    npm run cdk -- deploy FrontendConfig --require-approval never --parameters authenticationRequired=$authenticationRequired
}

deploy_examples() {
    echo "Deploying examples"
    cd $EXAMPLES_DIR
    npm run build

    cd $CDK_DIR
    npm run cdk -- deploy DashboardExamples --require-approval never --parameters PerformanceDash-${environment}-DashboardExamples:exampleLanguage=$exampleLanguage
}

deploy_ops() {
    echo "Deploying ops stack"
    cd $CDK_DIR
    npm run cdk -- deploy Ops --require-approval never 
}

build_cdk() {
    cd $CDK_DIR
    npm run build
}

# Start execution
verify_prereqs
create_build_directories
build_cdk
deploy_auth
deploy_authz
deploy_frontend
deploy_backend
deploy_frontendConfig
deploy_examples
deploy_ops
