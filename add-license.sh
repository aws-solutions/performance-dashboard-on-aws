#!/bin/bash

dirs="backend cdk e2e-tests examples frontend"
for d in $dirs; do
    echo "add-license: $d"
    paths="$(find $d -type f -path "$d/src/*.ts") "
    paths+=$(find $d -type f -path "$d/src/*.tsx")
    paths+=$(find $d -type f -path "$d/lib/*.ts")
    paths+=$(find $d -type f -path "$d/cypress/*.ts")
    for f in $paths; do
        if ! grep -q "Copyright Amazon.com, Inc." $f
        then
            echo "update: $f"
            cat tools/copyright-file-header.txt | cat - $f > temp && mv temp $f
        fi
    done
done
