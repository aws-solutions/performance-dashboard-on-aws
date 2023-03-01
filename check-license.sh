#!/bin/bash
license="MIT,Apache-2.0,BSD-2-Clause,BSD-3-Clause,ISC,0BSD,CC0-1.0,CC-BY-4.0 AND MIT,CC-BY-4.0,MPL-2.0,Unlicense,EPL-1.0,UNLICENSED,(MIT AND Zlib),Zlib,WTFPL,Python-2.0"
dirs="backend cdk e2e-tests examples frontend"
for d in $dirs; do
    echo "$d"
    pushd $d
    if [ -f ./package.json ]; then
      echo "checking licenses in $d"
      ../node_modules/license-checker/bin/license-checker --production --exclude "$license"
    fi
    popd
done
