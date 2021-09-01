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

authRegion=$2
if [ "$authRegion" != "" ]; then
    echo "AuthRegion = $authRegion"
    export CDK_AUTH_REGION=$authRegion
else
    echo "Please specify region for auth as second argument (i.e. us-east-1)"
    exit 0
fi

deploy_auth() {
    # Deploys the Authentication stack with CDK.
    # Auth stack definition is in cdk/lib/auth-stack.ts
    echo "Deploying auth stack"
    cd $CDK_DIR

    originalRegion=$AWS_REGION
    AWS_REGION=$authRegion
    if [ "$CDK_ADMIN_EMAIL" != "" ]; then
        npm run cdk -- deploy --app 'npx ts-node bin/main-authstack.ts' Auth --require-approval never --parameters adminEmail=$CDK_ADMIN_EMAIL --outputs-file outputs-auth.json
    else
        npm run cdk -- deploy --app 'npx ts-node bin/main-authstack.ts' Auth --require-approval never --outputs-file outputs-auth.json
    fi

    UserPoolArn="$(grep -oP '(?<="UserPoolArn": ")[^"]*' outputs-auth.json )"
    UserPoolId="$(grep -oP '(?<="UserPoolId": ")[^"]*' outputs-auth.json )"

    IdentityPoolId="$(grep -oP '(?<="IdentityPoolId": ")[^"]*' outputs-auth.json )"
    AppClientId="$(grep -oP '(?<="AppClientId": ")[^"]*' outputs-auth.json )"
    AuthRegion=$authRegion
    AWS_REGION=$originalRegion
}

deploy_authparams() {
    cd $CDK_DIR
    echo "Deploying auth params stack"
    npm run cdk -- deploy AuthParams --app 'npx ts-node bin/main-appstack.ts' --require-approval never --parameters userPoolId=$UserPoolId --parameters userPoolArn=$UserPoolArn --parameters identityPoolId=$IdentityPoolId --parameters appClientId=$AppClientId --parameters authRegion=$AuthRegion
}

deploy_backend() {
    cd $CDK_DIR
    echo "Deploying backend stack"
    npm run cdk -- deploy Backend --app 'npx ts-node bin/main-appstack.ts' --require-approval never
}

deploy_frontend() {
    cd $CDK_DIR
    npm run cdk -- deploy Frontend --app 'npx ts-node bin/main-appstack.ts' --require-approval never 
    echo "Deploying frontend stack"
}

deploy_ops() {
    echo "Deploying ops stack"
    cd $CDK_DIR
    npm run cdk -- deploy Ops --app 'npx ts-node bin/main-appstack.ts' --require-approval never
}

# Start execution
deploy_auth
deploy_authparams
deploy_backend
deploy_frontend
deploy_ops
