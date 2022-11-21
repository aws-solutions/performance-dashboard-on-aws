#!/bin/bash

pushd ./notice-generator

# reset file
cat copyright-notice-header.txt > ../NOTICE.txt

npm run generate

# append new attributions
cat oss-attribution/attribution.txt >> ../NOTICE.txt
rm -rf oss-attribution

popd

