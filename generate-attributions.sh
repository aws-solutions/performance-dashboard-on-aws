#!/bin/bash

echo "" > NOTICE.txt

parserTool="$PWD/scripts/parse-dependency.js"
dirs=". backend cdk examples frontend"
licenseReportPath="$PWD/node_modules/license-report/index.js"
output="$PWD/NOTICE.txt"
for d in $dirs; do
    echo "$d"
    pushd $d
    if [ -f ./package.json ]; then
      echo "license report for $d"
      node $licenseReportPath --package=package.json --fields=name --fields=licenseType --fields=installedVersion | node $parserTool >> $output
    fi
    popd
done

# sort and remove duplicates
sort -u $output > temp
mv temp $output

# prepend license text
cat scripts/copyright-notice-header.txt | cat - $output > temp && mv temp $output
