#!/bin/bash

dir=$(ls .)

for d in $dir; do
    echo "$d"
    for f in $(find . -type f -path "$d/src/*.ts*"); do
        if ! grep -q "Copyright Amazon.com, Inc." $f
        then
            cat license.txt | cat - $f > temp && mv temp $f
        fi
    done
    for f in $(find . -type f -path "$d/lib/*.ts*"); do
        if ! grep -q "Copyright Amazon.com, Inc." $f
        then
            cat license.txt | cat - $f > temp && mv temp $f
        fi
    done
done
