#!/bin/bash

npm install -g oss-attribution-generator

cat "" > THIRD-PARTY-LICENSES
dirs="backend cdk e2e-tests examples frontend"
for d in $dirs; do
    echo "$d"
    pushd $d
    if [ -f ./package.json ]; then
      echo "checking attributions in $d"
      generate-attribution
      #cat ../tools/copyright-notice-header.txt | cat - oss-attribution/attribution.txt > NOTICE
      echo -e "\n******************************\n" >> ../THIRD-PARTY-LICENSES
      cat oss-attribution/attribution.txt >> ../THIRD-PARTY-LICENSES
      rm -rf oss-attribution
    fi
    popd
done
