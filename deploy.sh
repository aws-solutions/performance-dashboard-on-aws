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

cname=${4:-}
if [ "$authenticationRequired" != "" ]; then
    echo "CNAME = $cname"
    export CNAME=$cname
else
    echo "No CNAME passed"
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
    cd $CDK_DIR
    echo "Deploying backend stack"
    npm run cdk -- deploy Backend --require-approval never --no-rollback --outputs-file outputs-backend.json --parameters authenticationRequired=$authenticationRequired --parameters PerformanceDash-${environment}-Backend:domainName=$cname 
}

deploy_frontend() {
    cd $CDK_DIR
    echo "Deploying frontend stack"
    npm run cdk -- deploy Frontend --require-approval never  --parameters PerformanceDash-${environment}-Frontend:domainName=$cname
}

deploy_frontendConfig() {
    cd $CDK_DIR
    echo "Deploying frontendConfig stack"
    npm run cdk -- deploy FrontendConfig --require-approval never --parameters authenticationRequired=$authenticationRequired
}

deploy_examples() {
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
deploy_auth
deploy_authz
deploy_frontend
deploy_backend
deploy_frontendConfig
deploy_examples
deploy_ops
