#!/bin/bash
set -e

# Set workspace paths
WORKSPACE=$(pwd)
CDK_DIR=$WORKSPACE/cdk
FRONTEND_DIR=$WORKSPACE/frontend
BACKEND_DIR=$WORKSPACE/backend

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

build_back() {
    echo "Building backend application"
    cd $BACKEND_DIR
    npm run build
}

build_front() {
    echo "Building frontend application"
    cd $FRONTEND_DIR
    npm run build
}

build_cdk() {
    cd $CDK_DIR
    npm run build
}

deploy(){
    cd $WORKSPACE
    if [ "$authRegion" != "" ]; then
        echo "Cross region deploy"
        ./deployscripts/splitregion.sh "$environment" "$authRegion"
    else
        ./deployscripts/onergion.sh "$environment"
    fi
}


environment=$1
if [ "$environment" != "" ]; then
    echo "Environment = $environment"
fi

authRegion=$2
if [ "$authRegion" != "" ]; then
    echo "AuthRegion = $authRegion"
fi


# Start execution
verify_prereqs
create_build_directories
build_cdk
build_back
build_front
deploy
