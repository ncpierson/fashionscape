#!/bin/bash

echo $npm_package_version > .version

tag="fashionscape-api-v$npm_package_version"

git add package.json
git add .version
git commit -m "$tag"

git tag "$tag"

git push
git push --tags
