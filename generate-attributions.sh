#!/bin/bash

npm install -g license-report@6.3.0

echo "" > NOTICE.txt

dirs="backend cdk examples frontend"
for d in $dirs; do
    echo "$d"
    pushd $d
    if [ -f ./package.json ]; then
      echo "license report for $d"
      license-report --package=package.json --fields=name --fields=licenseType --fields=installedVersion | node ../scripts/parse-dependency.js >> ../NOTICE.txt
    fi
    popd
done

# sort and remove duplicates
echo "license-report@6.3.0 under MIT" >> NOTICE.txt
sort -u NOTICE.txt > temp
mv temp NOTICE.txt

# prepend license text
cat scripts/copyright-notice-header.txt | cat - NOTICE.txt > temp && mv temp NOTICE.txt
