#!/bin/bash

npm install -g oss-attribution-generator
npm install -g license-report

cat "" > NOTICE.txt
cat "" > THIRD-PARTY-LICENSES.txt

dirs="backend cdk examples frontend"
for d in $dirs; do
    echo "$d"
    pushd $d
    if [ -f ./package.json ]; then
      echo "checking attributions in $d"
      generate-attribution
      echo -e "\n******************************\n" >> ../THIRD-PARTY-LICENSES.txt
      cat oss-attribution/attribution.txt >> ../THIRD-PARTY-LICENSES.txt
      rm -rf oss-attribution

      license-report --package=package.json --fields=name --fields=licenseType --fields=installedVersion | node ../scripts/parse-dependency.js >> ../NOTICE.txt
    fi
    popd
done

# remove duplicates
cat THIRD-PARTY-LICENSES.txt | node scripts/parse-licenses.js > temp
mv temp THIRD-PARTY-LICENSES.txt

# sort and remove duplicates
sort -u NOTICE.txt > temp
mv temp NOTICE.txt

# prepend license text
cat scripts/copyright-notice-header.txt | cat - NOTICE.txt > temp && mv temp NOTICE.txt
