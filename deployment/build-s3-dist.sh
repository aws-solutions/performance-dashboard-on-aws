#!/bin/bash
#
# This script packages your project into a solution distributable that can be
# used as an input to the solution builder validation pipeline.
#
# Important notes and prereq's:
#   1. The initialize-repo.sh script must have been run in order for this script to
#      function properly.
#   2. This script should be run from the repo's /deployment folder.
#
# This script will perform the following tasks:
#   1. Remove any old dist files from previous runs.
#   2. Install dependencies for the cdk-solution-helper; responsible for
#      converting standard 'cdk synth' output into solution assets.
#   3. Build and synthesize your CDK project.
#   4. Run the cdk-solution-helper on template outputs and organize
#      those outputs into the /global-s3-assets folder.
#   5. Organize source code artifacts into the /regional-s3-assets folder.
#   6. Remove any temporary files used for staging.
#
# Parameters:
#  - source-bucket-base-name: Name for the S3 bucket location where the template will source the Lambda
#    code from. The template will append '-[region_name]' to this bucket name.
#    For example: ./build-s3-dist.sh solutions v1.0.0
#    The template will then expect the source code to be located in the solutions-[region_name] bucket
#  - solution-name: name of the solution for consistency
#  - version-code: version of the package

# Important: CDK global version number
cdk_version=1.87.1

# Check to see if the required parameters have been provided:
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Please provide the base source bucket name, trademark approved solution name and version where the lambda code will eventually reside."
    echo "For example: ./build-s3-dist.sh solutions trademarked-solution-name v1.0.0"
    exit 1
fi

# Get reference for all important folders
template_dir="$PWD"
staging_dist_dir="$template_dir/staging"
template_dist_dir="$template_dir/global-s3-assets"
build_dist_dir="$template_dir/regional-s3-assets"
source_dir="$template_dir/../source"

echo "------------------------------------------------------------------------------"
echo "[Init] Remove any old dist files from previous runs"
echo "------------------------------------------------------------------------------"

echo "rm -rf $template_dist_dir"
rm -rf $template_dist_dir
echo "mkdir -p $template_dist_dir"
mkdir -p $template_dist_dir
echo "rm -rf $build_dist_dir"
rm -rf $build_dist_dir
echo "mkdir -p $build_dist_dir"
mkdir -p $build_dist_dir
echo "rm -rf $staging_dist_dir"
rm -rf $staging_dist_dir
echo "mkdir -p $staging_dist_dir"
mkdir -p $staging_dist_dir

echo "------------------------------------------------------------------------------"
echo "[Init] Install dependencies for the cdk-solution-helper"
echo "------------------------------------------------------------------------------"

echo "cd $template_dir/cdk-solution-helper"
cd $template_dir/cdk-solution-helper
echo "npm install"
npm install

echo "npm install -g aws-cdk@$cdk_version"
npm install -g aws-cdk@$cdk_version

echo "------------------------------------------------------------------------------"
echo "[Synth] CDK Project"
echo "------------------------------------------------------------------------------"

# Run 'cdk synth' to generate raw solution outputs
echo "cd $source_dir"
cd $source_dir
echo "chmod +x ./install.sh && ./install.sh"
chmod +x ./install.sh && ./install.sh
echo "chmod +x ./package.sh && ./package.sh release $staging_dist_dir"
chmod +x ./package.sh && ./package.sh release $staging_dist_dir

# Remove unnecessary output files
echo "cd $staging_dist_dir"
cd $staging_dist_dir
echo "rm tree.json manifest.json cdk.out"
rm tree.json manifest.json cdk.out

echo "------------------------------------------------------------------------------"
echo "[Packing] Template artifacts"
echo "------------------------------------------------------------------------------"

# Move outputs from staging to build_dist_dir
echo "Move outputs from staging to build_dist_dir"
echo "cp $staging_dist_dir/*.template.json $build_dist_dir/"
cp $staging_dist_dir/*.template.json $build_dist_dir/
cp $template_dir/performance-dashboard-on-aws.template $template_dist_dir/
rm *.template.json

declare -a template_locations=("$template_dist_dir" "$build_dist_dir" )

for loc in ${template_locations[@]}; do
   echo "Processing templates in $loc"

   # Rename all *.template.json files to *.template
    echo "Rename all *.template.json to *.template"
    echo "copy templates and rename"
    for f in $loc/*.template.json; do
        mv -- "$f" "${f%.template.json}.template"
    done

    # Run the helper to clean-up the templates and remove unnecessary CDK elements
    echo "Run the helper to clean-up the templates and remove unnecessary CDK elements"
    echo "node $template_dir/cdk-solution-helper/index $loc"
    node $template_dir/cdk-solution-helper/index $loc
    if [ "$?" = "1" ]; then
        echo "(cdk-solution-helper) ERROR: there is likely output above." 1>&2
        exit 1
    fi

    # Find and replace bucket_name, solution_name, and version
    echo "Find and replace bucket_name, solution_name, and version"
    cd $loc
    echo "Updating code source bucket in template with $1"
    replace="s/%%BUCKET_NAME%%/$1/g"
    echo "sed -i '' -e $replace $loc/*.template"
    sed -i '' -e $replace $loc/*.template
    replace="s/%%SOLUTION_NAME%%/$2/g"
    echo "sed -i '' -e $loc/*.template"
    sed -i '' -e $replace $loc/*.template
    replace="s/%%VERSION%%/$3/g"
    echo "sed -i '' -e $replace $loc/*.template"
    sed -i '' -e $replace $loc/*.template
done

# Place in both regional and global folders.  Parent CFT embeds regional instance.
# Customers can access it directly in global folder to install it independently of parent CFT
cp $build_dist_dir/lambda-at-edge-support-stack.template $template_dist_dir/LambdaEdge.template
mv $build_dist_dir/lambda-at-edge-support-stack.template $build_dist_dir/LambdaEdge.template

echo "------------------------------------------------------------------------------"
echo "[Packing] Source code artifacts"
echo "------------------------------------------------------------------------------"

# General cleanup of node_modules and package-lock.json files
echo "find $staging_dist_dir -iname "node_modules" -type d -exec rm -rf "{}" \; 2> /dev/null"
find $staging_dist_dir -iname "node_modules" -type d -exec rm -rf "{}" \; 2> /dev/null
echo "find $staging_dist_dir -iname "package-lock.json" -type f -exec rm -f "{}" \; 2> /dev/null"
find $staging_dist_dir -iname "package-lock.json" -type f -exec rm -f "{}" \; 2> /dev/null

# ... For each asset.* source code artifact in the temporary /staging folder...
cd $staging_dist_dir

echo "cp *.zip $build_dist_dir"
cp *.zip $build_dist_dir

for fname in `find . -mindepth 1 -maxdepth 1 -type d`; do

    # Build the artifcats
    if ls $fname/package.json 1> /dev/null 2>&1; then
        echo "===================================="
        echo "This is Node runtime"
        echo "===================================="
        cd $fname
        echo "Clean and rebuild artifacts"
        npm run clean
        npm install --production
        if [ "$?" = "1" ]; then
	        echo "ERROR: Seems like package-lock.json does not exists or is out of sync with package.josn. Trying npm install instead" 1>&2
            npm install
        fi
        # Zip the artifact
        echo "zip -r ../$fname.zip *"
        zip -rq ../$fname.zip *
    else
        cd $fname
        # Zip the artifact
        echo "zip -rq ../$fname.zip *"
        zip -rq ../$fname.zip *
    fi

    cd $staging_dist_dir

    # Copy the zipped artifact from /staging to /regional-s3-assets
    echo "cp $fname.zip $build_dist_dir"
    cp $fname.zip $build_dist_dir

    # Remove the old, unzipped artifact from /staging
    echo "rm -rf $fname"
    rm -rf $fname

    # Remove the old, zipped artifact from /staging
    echo "rm $fname.zip"
    rm $fname.zip

    # ... repeat until all source code artifacts are zipped and placed in the
    # ... /regional-s3-assets folder

done

echo "------------------------------------------------------------------------------"
echo "[Cleanup] Remove temporary files"
echo "------------------------------------------------------------------------------"

# Delete the temporary /staging folder
echo "rm -rf $staging_dist_dir"
rm -rf $staging_dist_dir
