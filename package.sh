#!/bin/bash
set -e

# Set workspace paths
WORKSPACE=$(pwd)
CDK_DIR=$WORKSPACE/cdk
FRONTEND_DIR=$WORKSPACE/frontend
BACKEND_DIR=$WORKSPACE/backend
EXAMPLES_DIR=$WORKSPACE/examples

if [ "$#" -ne 2 ]; then
    echo "package.sh <environment> <cloudformation output directory>"
    exit 1
fi

# Validate environment name from input
environment=$1
if [ "$environment" != "" ]; then
    echo "Environment = $environment"
    export CDK_ENV_NAME=$environment
else
    echo "Please specify environment name as first argument (i.e. dev)"
    exit 1
fi

outputdir=$2
if [ "$outputdir" == "" ]; then
    echo "Please specify CloudFormation output directory as second argument"
    exit 1
fi

exampleLanguage=${3:-english}
if [ "$exampleLanguage" != "" ]; then
    echo "Example Language = $exampleLanguage"
else
    echo "Please specify an example language name as third argument (i.e. en|es|pt)"
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
    mkdir -p $EXAMPLES_DIR/build
}

package_auth() {
    echo "Packaging auth stack"
    cd $CDK_DIR

    if [ "$CDK_ADMIN_EMAIL" != "" ]; then
        npm run cdk -- synth Auth --parameters adminEmail=$CDK_ADMIN_EMAIL --parameters bucketNamePrefix=$CDK_ENV_NAME --output=$outputdir
    else
        npm run cdk -- synth Auth --parameters bucketNamePrefix=$CDK_ENV_NAME --output=$outputdir
    fi
}

package_backend() {
    echo "Building backend application"
    cd $BACKEND_DIR
    npm run build

    cd $CDK_DIR
    echo "Packaging backend stack"
    npm run cdk -- synth Backend --parameters bucketNamePrefix=$CDK_ENV_NAME --output=$outputdir
}

package_frontend() {
    echo "Building frontend application"
    cd $FRONTEND_DIR
    npm run build

    cd $CDK_DIR
    echo "Packaging frontend stack"
    npm run cdk -- synth Frontend --output=$outputdir
}

package_ops() {
    echo "Packaging ops stack"
    cd $CDK_DIR
    npm run cdk -- synth Ops --output=$outputdir
}

package_examples() {
    echo "Packaging examples stack"
    cd $EXAMPLES_DIR
    npm run build

    cd $CDK_DIR
    npm run cdk -- synth DashboardExamples --require-approval never --output=$outputdir --parameters PerformanceDash-${environment}-DashboardExamples:exampleLanguage=${exampleLanguage}
}

build_cdk() {
    cd $CDK_DIR
    npm run build
}

# Start execution
verify_prereqs
create_build_directories
build_cdk
package_auth
package_backend
package_frontend
package_ops
package_examples

