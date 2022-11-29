#!/bin/bash
set -e

# Set workspace paths
WORKSPACE=$(pwd)
CDK_DIR=$WORKSPACE/cdk
FRONTEND_DIR=$WORKSPACE/frontend
BACKEND_DIR=$WORKSPACE/backend
EXAMPLES_DIR=$WORKSPACE/examples

# Validate release version from input
newVersion=$1
if [ "$newVersion" != "" ]; then
    echo "==================================="
    echo "Releasing new version = $newVersion"
    echo "==================================="
else
    echo "Please specify the new version in semver format like v1.0.3"
    exit 0
fi

verify_prereqs() {
    echo "npm version"
    npm --version
}

update_package_jsons() {
    cd $CDK_DIR
    echo "Updating package.json in cdk"
    npm version $newVersion
    
    cd $FRONTEND_DIR
    echo "Updating package.json in frontend"
    npm version $newVersion

    cd $BACKEND_DIR
    echo "Updating package.json in backend"
    npm version $newVersion

    cd $EXAMPLES_DIR
    echo "Updating package.json in backend"
    npm version $newVersion
}

verify_prereqs
update_package_jsons