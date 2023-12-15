#!/bin/bash
set -e

# Set workspace paths
WORKSPACE=$(pwd)
CDK_DIR=$WORKSPACE/cdk
FRONTEND_DIR=$WORKSPACE/frontend
BACKEND_DIR=$WORKSPACE/backend
EXAMPLES_DIR=$WORKSPACE/examples

verify_prereqs() {
    # Verify necessary commands
    echo "node version"
    node --version
    echo "npm version"
    npm --version
    echo "cdk version"
    cdk --version
}

build_backend() {
    echo "Building backend application"
    cd $BACKEND_DIR
    npm run build
}

build_frontend() {
    echo "Building frontend application"
    cd $FRONTEND_DIR
    npm run build
}

build_examples() {
    echo "Packaging examples stack"
    cd $EXAMPLES_DIR
    npm run build
}

build_cdk() {
    cd $CDK_DIR
    npm run build
}

# Start execution
build_cdk
build_backend
build_frontend
build_examples

